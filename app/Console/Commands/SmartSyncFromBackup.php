<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class SmartSyncFromBackup extends Command
{
    protected $signature = 'sync:from-backup {file=backup.sql : The path to the backup.sql file}';
    protected $description = 'Smart synchronization of data from backup.sql using Upsert logic';

    /**
     * Order of tables to process to satisfy FK constraints.
     */
    private array $tableOrder = [
        'users',
        'grades',
        'subjects',
        'sections',
        'staff',
        'students',
        'teacher_assignments',
        'groups',
        'elective_students',
        'group_students',
        'assessments',
        'student_grades',
    ];

    public function handle(): int
    {
        $filePath = $this->argument('file');

        if (!file_exists($filePath)) {
            // Check if it's a relative path from workspace or absolute
            if (!file_exists(base_path($filePath))) {
                $this->error("File not found: {$filePath}");
                return self::FAILURE;
            }
            $filePath = base_path($filePath);
        }

        $this->info("🚀 Starting Smart Sync from {$filePath}...");
        
        // Disable FK checks to allow smooth transition and prevent ordering deadlocks
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        try {
            // Step 1: Discover schemas from the backup file to map column indices to names
            $schemas = $this->discoverSchemas($filePath);

            // Step 2: Sync each table in the predefined order
            foreach ($this->tableOrder as $tableName) {
                if (!isset($schemas[$tableName])) {
                    $this->warn("⚠️ Table [{$tableName}] schema not found in backup. Skipping.");
                    continue;
                }
                $this->syncTable($tableName, $filePath, $schemas[$tableName]);
            }

            $this->newLine();
            $this->info("🎉 Smart Sync completed successfully!");
        } catch (\Exception $e) {
            $this->error("❌ Error during sync: " . $e->getMessage());
            $this->line($e->getTraceAsString());
        } finally {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        }

        return self::SUCCESS;
    }

    /**
     * Scan the SQL file for CREATE TABLE statements to extract column names.
     */
    private function discoverSchemas(string $filePath): array
    {
        $this->info("🔍 Discovering table schemas in backup...");
        $schemas = [];
        $handle = fopen($filePath, "r");
        
        $currentTable = null;
        $inCreate = false;
        $cols = [];

        while (($line = fgets($handle)) !== false) {
            if (preg_match("/CREATE TABLE `(\w+)`/i", $line, $matches)) {
                $currentTable = $matches[1];
                $inCreate = true;
                $cols = [];
                continue;
            }

            if ($inCreate) {
                if (preg_match("/^\s*`(\w+)`/i", $line, $matches)) {
                    $cols[] = $matches[1];
                }
                if (str_contains($line, ") ENGINE=")) {
                    $schemas[$currentTable] = $cols;
                    $inCreate = false;
                    $currentTable = null;
                }
            }
        }
        fclose($handle);
        return $schemas;
    }

    /**
     * Parse INSERT statements and perform upserts in batches.
     */
    private function syncTable(string $table, string $filePath, array $backupColumns): void
    {
        $this->info("📥 Processing table: [{$table}]");

        $dbColumns = Schema::getColumnListing($table);
        $syncColumns = array_intersect($dbColumns, $backupColumns);

        if (empty($syncColumns)) {
            $this->error("  - No matching columns for [{$table}]. Check schema compatibility.");
            return;
        }

        $handle = fopen($filePath, "r");
        $batchData = [];
        $batchSize = 250; // Balanced batch size for performance and memory
        $totalSynced = 0;

        $insertPattern = "/INSERT INTO `{$table}` VALUES/i";

        while (($line = fgets($handle)) !== false) {
            if (preg_match($insertPattern, $line)) {
                // Extract the part after "VALUES"
                $valuesPart = substr($line, strpos(strtoupper($line), "VALUES") + 6);
                $this->processValues($valuesPart, $table, $backupColumns, $syncColumns, $batchData, $totalSynced, $batchSize, $handle);
            }
        }

        // Final flush for remaining data
        $this->flushBatch($table, $batchData, $syncColumns);
        
        fclose($handle);
        $this->line("  ✓ Synced {$totalSynced} rows.");
    }

    /**
     * Efficiently parses multi-line SQL values blocks.
     */
    private function processValues(string $content, string $table, array $backupColumns, array $syncColumns, array &$batchData, int &$totalSynced, int $batchSize, $handle): void
    {
        $buffer = $content;
        while (true) {
            // Regex to match (val1, val2, ...) followed by , or ;
            // This handles common MySQL dump formats.
            if (preg_match("/\s*\((.*?)\)\s*([,;])/s", $buffer, $matches, PREG_OFFSET_CAPTURE)) {
                $rowRaw = $matches[1][0];
                $delimiter = $matches[2][0];
                $endPos = $matches[0][1] + strlen($matches[0][0]);
                
                $data = $this->parseRow($rowRaw, $backupColumns);
                if ($data) {
                    $batchData[] = array_intersect_key($data, array_flip($syncColumns));
                    $totalSynced++;
                    
                    if (count($batchData) >= $batchSize) {
                        $this->flushBatch($table, $batchData, $syncColumns);
                        $batchData = [];
                    }
                }
                
                $buffer = substr($buffer, $endPos);
                if ($delimiter === ';') break; // End of statement
            } else {
                // Buffer doesn't contain a full row yet, read more from file
                $line = fgets($handle);
                if ($line === false) break;
                $buffer .= $line;
            }
        }
    }

    /**
     * Perform the actual DB upsert.
     */
    private function flushBatch(string $table, array $batchData, array $syncColumns): void
    {
        if (empty($batchData)) return;

        // Priority for unique keys: 'id', then custom composite keys, then first column.
        $uniqueKeys = ['id'];
        if (!in_array('id', $syncColumns)) {
            if ($table === 'student_grades') {
                $uniqueKeys = ['assessment_id', 'student_id'];
            } elseif ($table === 'group_students') {
                $uniqueKeys = ['group_id', 'student_id'];
            } elseif ($table === 'elective_students') {
                $uniqueKeys = ['subject_id', 'student_id'];
            } else {
                $uniqueKeys = [$syncColumns[0]];
            }
        }

        $actualUniqueKeys = array_intersect($uniqueKeys, $syncColumns);
        if (empty($actualUniqueKeys)) $actualUniqueKeys = [$syncColumns[0]];

        $updateColumns = array_diff($syncColumns, $actualUniqueKeys);

        try {
            DB::table($table)->upsert($batchData, $actualUniqueKeys, $updateColumns);
        } catch (\Exception $e) {
            $this->error("Failed to upsert batch for [{$table}]: " . $e->getMessage());
        }
    }

    /**
     * Parse a single row of SQL values into an associative array.
     */
    private function parseRow(string $row, array $columnNames): ?array
    {
        // Replace NULL keyword with a safe placeholder for CSV parsing
        $row = preg_replace('/\bNULL\b/i', '___NULL___', $row);
        
        $values = str_getcsv($row, ",", "'", "\\");
        
        $data = [];
        foreach ($values as $index => $val) {
            if ($index >= count($columnNames)) break;
            
            $col = $columnNames[$index];
            $val = trim($val);
            
            if ($val === '___NULL___') {
                $data[$col] = null;
            } else {
                $data[$col] = $val;
            }
        }
        
        return $data;
    }
}
