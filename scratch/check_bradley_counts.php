<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Staff;
use App\Models\TeacherAssignment;
use App\Models\Student;
use App\Models\Section;

$staff = Staff::where('name_ar', 'like', '%برادلى%')->first();
if (!$staff) { echo "Staff not found\n"; exit; }

echo "Staff Name: " . $staff->name_ar . "\n";

$assignments = TeacherAssignment::where('staff_id', $staff->id)
    ->with(['section.grade', 'subject'])
    ->get();

foreach ($assignments as $a) {
    $section = $a->section;
    $count = Student::where('section_id', $a->section_id)->where('is_active', true)->count();
    $label = ($section->grade->number ?? '') . ($section->letter ?? '');
    echo "Pill Label: " . $label . " | DB ID: " . $a->section_id . " | Students: " . $count . "\n";
    
    if ($label == '8Gen6' || $label == '8Gen5') {
        echo "Students in " . $label . ":\n";
        $students = Student::where('section_id', $a->section_id)->where('is_active', true)->orderBy('name_ar')->get();
        foreach ($students as $i => $s) {
            echo ($i+1) . ". " . $s->name_ar . "\n";
        }
    }
}
