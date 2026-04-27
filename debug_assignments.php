<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$staff = App\Models\Staff::where('staff_no', '579584')->first();
if (!$staff) {
    echo "Staff not found\n";
    exit;
}

echo "--- Assignments (Official) ---\n";
foreach ($staff->assignments as $a) {
    $sec = $a->section;
    $gradeNum = $sec->grade->number ?? 'N/A';
    $letter = $sec->letter ?? 'N/A';
    $labelAr = $sec->label_ar ?? 'N/A';
    echo "ID: {$a->id} | Sem: {$a->semester_id} | Grade: {$gradeNum} | Letter: {$letter} | LabelAr: {$labelAr} | Subject: " . ($a->subject->name_ar ?? 'N/A') . "\n";
}

echo "\n--- Assessments (Actual Data) ---\n";
$assessments = App\Models\Assessment::where('staff_id', $staff->id)
    ->select('section_id', 'subject_id')
    ->distinct()
    ->get();

foreach ($assessments as $ass) {
    $exists = $staff->assignments()->where('section_id', $ass->section_id)->where('subject_id', $ass->subject_id)->exists();
    $sec = App\Models\Section::with('grade')->find($ass->section_id);
    $sub = App\Models\Subject::find($ass->subject_id);
    $status = $exists ? "OFFICIAL" : "ORPHAN (Missing from assignments table!)";
    echo "Sec: " . ($sec->label_ar ?? 'N/A') . " | Sub: " . ($sub->name_ar ?? 'N/A') . " | Status: {$status}\n";
}
