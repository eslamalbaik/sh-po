<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Staff;
use App\Models\TeacherAssignment;
use App\Models\Student;

$staffCandidate = Staff::where('name_ar', 'like', '%برادلى%')->first();
if (!$staffCandidate) { echo "Staff not found\n"; exit; }

echo "Teacher: " . $staffCandidate->name_ar . " (" . $staffCandidate->id . ")\n";

$assignments = TeacherAssignment::where('staff_id', $staffCandidate->id)
    ->with(['section.grade', 'subject'])
    ->get();

echo "\n--- Assignments for this Teacher ---\n";
foreach ($assignments as $a) {
    $count = Student::where('section_id', $a->section_id)->where('is_active', true)->count();
    $sectionName = ($a->section->grade->number ?? '') . ($a->section->letter ?? '');
    echo "ID: " . $a->id . " | Section: " . $sectionName . " | Subject: " . $a->subject->name_ar . " | Students: " . $count . "\n";
}

// Any other teachers for 8Gen6?
$sec6 = \App\Models\Section::whereHas('grade', function($q){$q->where('number', 8);})->where('letter', 'Gen6')->first();
if ($sec6) {
    $others = TeacherAssignment::where('section_id', $sec6->id)
        ->where('staff_id', '!=', $staffCandidate->id)
        ->with('staff', 'subject')
        ->get();
    echo "\n--- Other Teachers for Section 8Gen6 ---\n";
    foreach ($others as $o) {
        echo "- Teacher: " . ($o->staff->name_ar ?? 'Unknown') . " | Subject: " . ($o->subject->name_ar ?? 'N/A') . "\n";
    }
}

// Compare current 8Gen6 names with what the user provided in his text
// User's first few names for his "System shows this" section (which has 29):
// 1. احمد مسلم محمد بالكعم العامري
// 2. بطى سيف على الشحي
// ...
if ($sec6) {
    $dbNames6 = Student::where('section_id', $sec6->id)->where('is_active', true)->orderBy('name_ar')->pluck('name_ar')->toArray();
    echo "\n--- First 5 Students in 8Gen6 in Database ---\n";
    foreach (array_slice($dbNames6, 0, 5) as $i => $name) {
        echo ($i+1) . ". " . $name . "\n";
    }
}
