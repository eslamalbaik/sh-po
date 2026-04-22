<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

$url = 'https://agfwsdxigdbdsulzdjab.supabase.co';
$key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnZndzZHhpZ2RiZHN1bHpkamFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NDAzNjEsImV4cCI6MjA5MTMxNjM2MX0.yPYmdFpUQDd6k-w9gyiAKta88qiPCHV9v913-oV9Xgc';

function fetchAll($url, $key, $table) {
    $all = []; $offset = 0; $pageSize = 1000;
    do {
        $resp = Http::withHeaders([
            'apikey' => $key,
            'Authorization' => "Bearer $key",
        ])->get("$url/rest/v1/$table", ['limit' => $pageSize, 'offset' => $offset]);
        $batch = $resp->json();
        $all = array_merge($all, $batch);
        $offset += $pageSize;
    } while (count($batch) === $pageSize);
    return $all;
}

$remoteStudents = fetchAll($url, $key, 'students');
$localStudentsNos = DB::table('students')->pluck('student_no')->toArray();

$missing = [];
$counts = array_count_values(array_column($remoteStudents, 'student_no'));
$duplicates = array_filter($counts, function($c) { return $c > 1; });

echo "Total Remote Students: " . count($remoteStudents) . "\n";
echo "Total Local Students: " . count($localStudentsNos) . "\n";
echo "Difference: " . (count($remoteStudents) - count($localStudentsNos)) . "\n";
echo "Duplicate student_nos in Supabase: " . count($duplicates) . " unique student_nos have duplicates.\n";

$totalDupRows = 0;
foreach($duplicates as $no => $count) {
    $totalDupRows += ($count - 1);
}
echo "Total extra rows caused by duplicates in Supabase: " . $totalDupRows . "\n";

echo "\nSample of duplicates in Supabase:\n";
$i = 0;
foreach($duplicates as $no => $count) {
    echo "Student No: $no (Count: $count)\n";
    if (++$i > 5) break;
}
