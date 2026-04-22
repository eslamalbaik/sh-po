<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Assessment;

$user = User::where('login_id', 'T572703')->first();
$staff = $user->staff;

echo "Staff: " . $staff->name_ar . " (ID: " . $staff->id . ")\n";
echo "Current Assignments:\n";
foreach ($staff->assignments as $ass) {
    echo "  Section: " . $ass->section->grade->number . $ass->section->letter . " (ID: " . $ass->section_id . ") | Subject: " . $ass->subject->name_ar . " (ID: " . $ass->subject_id . ")\n";
}

echo "\nChecking for matching assessments in DB...\n";
$targetNotes = ['الاختبار التكويني الأول - الفصل الدراسي الثالث', 'اختبار قصير'];

foreach ($targetNotes as $note) {
    $exists = Assessment::where('note_ar', 'like', "%$note%")->get();
    echo "Assessments matching '$note': " . $exists->count() . "\n";
    foreach ($exists as $e) {
        echo "  - ID: " . $e->id . " | Section: " . $e->section_id . " | Staff: " . $e->staff_id . "\n";
    }
}
