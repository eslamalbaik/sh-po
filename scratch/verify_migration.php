<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

$url = 'https://agfwsdxigdbdsulzdjab.supabase.co';
$key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnZndzZHhpZ2RiZHN1bHpkamFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NDAzNjEsImV4cCI6MjA5MTMxNjM2MX0.yPYmdFpUQDd6k-w9gyiAKta88qiPCHV9v913-oV9Xgc';

$tables = [
    'grades'              => 'grades',
    'sections'            => 'sections',
    'subjects'            => 'subjects',
    'users'               => 'users',
    'staff'               => 'staff',
    'students'            => 'students',
    'teacher_assignments' => 'teacher_assignments',
    'assessments'         => 'assessments',
    'student_grades'      => 'student_grades',
];

echo str_pad("Table", 25) . " | " . str_pad("Supabase", 10) . " | " . str_pad("Local MySQL", 10) . " | Status\n";
echo str_repeat("-", 65) . "\n";

foreach ($tables as $localTable => $remoteTable) {
    // Get local count
    $localCount = DB::table($localTable)->count();

    // Get remote count via Supabase REST API (HEAD request for count)
    $resp = Http::withHeaders([
        'apikey' => $key,
        'Authorization' => "Bearer $key",
        'Range' => '0-0', // Just count
        'Prefer' => 'count=exact'
    ])->head("$url/rest/v1/$remoteTable");

    $remoteCount = 0;
    if ($resp->successful()) {
        $contentRange = $resp->header('Content-Range'); // format "0-0/total"
        if ($contentRange) {
            $parts = explode('/', $contentRange);
            $remoteCount = (int) ($parts[1] ?? 0);
        }
    } else {
        $remoteCount = "Error (" . $resp->status() . ")";
    }

    $status = ($localCount === $remoteCount) ? "✅ Match" : "❌ Mismatch";
    if (is_string($remoteCount)) $status = "⚠️ Error";

    echo str_pad($localTable, 25) . " | " . str_pad($remoteCount, 10) . " | " . str_pad($localCount, 10) . " | $status\n";
}
