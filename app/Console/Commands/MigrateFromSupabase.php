<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class MigrateFromSupabase extends Command
{
    protected $signature   = 'migrate:from-supabase';
    protected $description = 'سحب جميع البيانات من Supabase وتخزينها في MySQL المحلية';

    private string $url = 'https://agfwsdxigdbdsulzdjab.supabase.co';
    private string $key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnZndzZHhpZ2RiZHN1bHpkamFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NDAzNjEsImV4cCI6MjA5MTMxNjM2MX0.yPYmdFpUQDd6k-w9gyiAKta88qiPCHV9v913-oV9Xgc';

    /** جلب صفحة واحدة من Supabase REST API */
    private function fetch(string $table, int $limit = 1000, int $offset = 0, string $select = '*'): array
    {
        $resp = Http::timeout(30)->withHeaders([
            'apikey'        => $this->key,
            'Authorization' => "Bearer {$this->key}",
        ])->get("{$this->url}/rest/v1/{$table}", compact('select', 'limit', 'offset'));

        if ($resp->failed()) {
            $this->error("فشل جلب [{$table}] offset={$offset}: " . $resp->status());
            return [];
        }
        return $resp->json() ?? [];
    }

    /** تحويل تاريخ Supabase (ISO8601) إلى تنسيق MySQL */
    private function formatDt(?string $dt): ?string
    {
        if (!$dt) return null;
        return date('Y-m-d H:i:s', strtotime($dt));
    }

    /**
     * جلب جميع الصفوف بدفعات — يتعامل مع أي عدد تلقائياً
     */
    private function fetchAll(string $table, string $select = '*', int $pageSize = 1000): array
    {
        $all = []; $offset = 0;
        do {
            $batch = $this->fetch($table, $pageSize, $offset, $select);
            $all   = array_merge($all, $batch);
            $offset += $pageSize;
        } while (count($batch) === $pageSize);
        return $all;
    }

    public function handle(): int
    {
        $this->info('🚀 بدء ترحيل البيانات من Supabase...');
        $this->newLine();

        // تعطيل التحقق من المفاتيح الأجنبية مؤقتاً
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        try {

        // ── 1. grades ──────────────────────────────────────────
        $this->info('📥 [1/9] grades');
        foreach ($this->fetchAll('grades') as $r) {
            DB::table('grades')->updateOrInsert(
                ['id' => $r['id']],
                ['number' => $r['number'], 'updated_at' => now()]
            );
        }
        $this->line("  ✓ " . DB::table('grades')->count() . " صفوف دراسية");

        // ── 2. sections ────────────────────────────────────────
        $this->info('📥 [2/9] sections');
        foreach ($this->fetchAll('sections') as $r) {
            DB::table('sections')->updateOrInsert(
                ['id' => $r['id']],
                [
                    'grade_id'   => $r['grade_id'],
                    'letter'     => $r['letter'],
                    'label_ar'   => $r['label_ar'] ?? null,
                    'label_en'   => $r['label_en'] ?? null,
                    'updated_at' => now(),
                ]
            );
        }
        $this->line("  ✓ " . DB::table('sections')->count() . " شعبة");

        // ── 3. subjects ────────────────────────────────────────
        $this->info('📥 [3/9] subjects');
        foreach ($this->fetchAll('subjects') as $r) {
            DB::table('subjects')->updateOrInsert(
                ['id' => $r['id']],
                ['name_ar' => $r['name_ar'], 'name_en' => $r['name_en'], 'updated_at' => now()]
            );
        }
        $this->line("  ✓ " . DB::table('subjects')->count() . " مادة");

        // ── 4. users (pagination - قد يكون أكثر من 1000) ─────
        $this->info('📥 [4/9] users');
        $offset = 0; $pageSize = 1000;
        do {
            $batch = $this->fetch('users', $pageSize, $offset);
            foreach ($batch as $r) {
                DB::table('users')->updateOrInsert(
                    ['id' => $r['id']],
                    [
                        'login_id'        => $r['login_id'],
                        'email'           => $r['email']           ?? null,
                        'name'            => $r['name']            ?? null,
                        'role'            => $r['role']            ?? 'teacher',
                        'password'        => $r['password_hash']   ?? bcrypt('changeme'),
                        'failed_attempts' => $r['failed_attempts'] ?? 0,
                        'locked_until'    => $this->formatDt($r['locked_until'] ?? null),
                        'is_active'       => $r['is_active']       ?? true,
                        'updated_at'      => now(),
                    ]
                );
            }
            $offset += $pageSize;
            $this->line("  → " . DB::table('users')->count() . " مستخدم حتى الآن...");
        } while (count($batch) === $pageSize);
        $this->line("  ✓ " . DB::table('users')->count() . " مستخدم إجمالاً");

        // ── 5. staff ───────────────────────────────────────────
        $this->info('📥 [5/9] staff');
        foreach ($this->fetchAll('staff') as $r) {
            DB::table('staff')->updateOrInsert(
                ['id' => $r['id']],
                [
                    'user_id'    => $r['user_id'],
                    'name_ar'    => $r['name_ar'],
                    'name_en'    => $r['name_en']  ?? null,
                    'staff_no'   => $r['staff_no'] ?? null,
                    'updated_at' => now(),
                ]
            );
        }
        $this->line("  ✓ " . DB::table('staff')->count() . " معلم/موظف");

        // ── 6. students (pagination) ───────────────────────────
        $this->info('📥 [6/9] students');
        $offset = 0;
        do {
            $batch = $this->fetch('students', $pageSize, $offset);
            foreach ($batch as $r) {
                // نبحث بـ id الأصلي أولاً، ثم بـ student_no كاحتياط للبيانات المكررة
                $existing = DB::table('students')->where('id', $r['id'])->exists();
                if (!$existing) {
                    // تجاهل أي تكرار في student_no — نأخذ الأول فقط
                    $existingByNo = DB::table('students')->where('student_no', $r['student_no'])->exists();
                    if ($existingByNo) continue; // تخطي النسخة المكررة
                }
                DB::table('students')->updateOrInsert(
                    ['id' => $r['id']],
                    [
                        'student_no'     => $r['student_no'],
                        'student_id_no'  => $r['student_id_no']  ?? null,
                        'name_ar'        => $r['name_ar'],
                        'name_en'        => $r['name_en'],
                        'grade_id'       => $r['grade_id']       ?? null,
                        'section_id'     => $r['section_id']     ?? null,
                        'parent_user_id' => $r['parent_user_id'] ?? null,
                        'parent_mobile'  => $r['parent_mobile']  ?? null,
                        'is_active'      => $r['is_active']      ?? true,
                        'updated_at'     => now(),
                    ]
                );
            }
            $offset += $pageSize;
            $this->line("  → " . DB::table('students')->count() . " طالب حتى الآن...");
        } while (count($batch) === $pageSize);
        $this->line("  ✓ " . DB::table('students')->count() . " طالب إجمالاً");

        // ── 7. teacher_assignments ─────────────────────────────
        $this->info('📥 [7/9] teacher_assignments');
        foreach ($this->fetchAll('teacher_assignments') as $r) {
            DB::table('teacher_assignments')->updateOrInsert(
                [
                    'staff_id'    => $r['staff_id'],
                    'section_id'  => $r['section_id'],
                    'subject_id'  => $r['subject_id'],
                    'semester_id' => $r['semester_id'] ?? 3,
                ],
                [
                    'expected_assessments' => $r['expected_assessments'] ?? 5,
                    'updated_at'           => now(),
                ]
            );
        }
        $this->line("  ✓ " . DB::table('teacher_assignments')->count() . " تكليف");

        // ── 8. assessments (pagination) ────────────────────────
        $this->info('📥 [8/9] assessments');
        $offset = 0;
        do {
            $batch = $this->fetch('assessments', $pageSize, $offset);
            foreach ($batch as $r) {
                DB::table('assessments')->updateOrInsert(
                    ['id' => $r['id']],
                    [
                        'section_id'   => $r['section_id'],
                        'staff_id'     => $r['staff_id']    ?? null,
                        'subject_id'   => $r['subject_id']  ?? null,
                        'status'       => $r['status']       ?? 'published',
                        'published_at' => $this->formatDt($r['published_at'] ?? null),
                        'note_ar'      => $r['note_ar']      ?? null,
                        'note_en'      => $r['note_en']      ?? null,
                        'type'         => $r['type']          ?? 'exam',
                        'full_mark'    => $r['full_mark']     ?? 20,
                        'weight'       => $r['weight']        ?? 20,
                        'updated_at'   => now(),
                    ]
                );
            }
            $offset += $pageSize;
        } while (count($batch) === $pageSize);
        $this->line("  ✓ " . DB::table('assessments')->count() . " تقييم");

        // ── 9. student_grades (pagination كبيرة) ───────────────
        $this->info('📥 [9/9] student_grades (بدفعات)...');
        $offset = 0; $total = 0;
        do {
            $batch = $this->fetch('student_grades', $pageSize, $offset,
                                  'assessment_id,student_id,score,is_absent');
            foreach ($batch as $r) {
                DB::table('student_grades')->updateOrInsert(
                    [
                        'assessment_id' => $r['assessment_id'],
                        'student_id'    => $r['student_id'],
                    ],
                    [
                        'score'      => $r['score'],
                        'is_absent'  => $r['is_absent'] ?? false,
                        'updated_at' => now(),
                    ]
                );
            }
            $total  += count($batch);
            $offset += $pageSize;
            $this->line("  → {$total} درجة حتى الآن...");
        } while (count($batch) === $pageSize);
        $this->line("  ✓ {$total} درجة إجمالاً");

        // ── ملخص نهائي ──────────────────────────────────────────
        $this->newLine();
        $this->info('🎉 اكتملت عملية الترحيل!');
        $this->table(
            ['الجدول', 'العدد في MySQL'],
            [
                ['grades',              DB::table('grades')->count()],
                ['sections',            DB::table('sections')->count()],
                ['subjects',            DB::table('subjects')->count()],
                ['users',               DB::table('users')->count()],
                ['staff',               DB::table('staff')->count()],
                ['students',            DB::table('students')->count()],
                ['teacher_assignments', DB::table('teacher_assignments')->count()],
                ['assessments',         DB::table('assessments')->count()],
                ['student_grades',      DB::table('student_grades')->count()],
            ]
        );

        } catch (\Exception $e) {
            $this->error("Error: " . $e->getMessage());
        } finally {
            // إعادة تفعيل التحقق من المفاتيح الأجنبية
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        }

        return self::SUCCESS;
    }
}
