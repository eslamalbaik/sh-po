<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Student;
use App\Models\Assessment;
use App\Models\StudentGrade;

$staffId = '2c5ac072-1b33-4c77-a786-599e35d2145a';
$sectionId = 33;
$subjectId = 7;

$assessments = Assessment::where('staff_id', $staffId)
    ->where('section_id', $sectionId)
    ->where('subject_id', $subjectId)
    ->get();

$students = Student::where('section_id', $sectionId)->where('is_active', true)->get();
$studentIds = $students->pluck('id');

$grades = StudentGrade::whereIn('assessment_id', $assessments->pluck('id'))
    ->whereIn('student_id', $studentIds)
    ->get();

echo "Assessments Count: " . $assessments->count() . "\n";
echo "Students Count: " . $students->count() . "\n";
echo "Grades Count: " . $grades->count() . "\n";

$totalPossible = $assessments->sum('full_mark') * $students->count();
$totalActual = $grades->sum('score');

echo "Total Possible Points (Sum of full_marks * student count): " . $totalPossible . "\n";
echo "Total Actual Points (Sum of all scores): " . $totalActual . "\n";

if ($totalPossible > 0) {
    $avg = ($totalActual / $totalPossible) * 100;
    echo "Resulting Average Score: " . round($avg, 2) . "%\n";
} else {
    echo "Total Possible is 0\n";
}
