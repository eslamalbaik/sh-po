<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Student;
use App\Models\StudentGrade;
use App\Models\Assessment;

echo "🕵️ Diagnosing Student Grade Disconnect...\n";

$assessmentId = 33223; // We know this one exists and has 25 grades
$grades = StudentGrade::where('assessment_id', $assessmentId)->get();

if ($grades->count() > 0) {
    echo "Found " . $grades->count() . " grades for assessment $assessmentId.\n";
    $sampleGrade = $grades->first();
    echo "Sample Grade Student ID: " . $sampleGrade->student_id . "\n";
    
    $student = Student::find($sampleGrade->student_id);
    if ($student) {
        echo "✅ Student FOUND: " . $student->name_ar . "\n";
    } else {
        echo "❌ Student NOT FOUND in students table.\n";
        
        // Search if this ID exists in another column or if there's a numeric match
        echo "Searching for clues...\n";
        $clue = Student::where('student_no', 'like', '%' . $sampleGrade->student_id . '%')
                      ->orWhere('student_id_no', 'like', '%' . $sampleGrade->student_id . '%')
                      ->first();
        if ($clue) {
            echo "💡 Possible Match Found via student_no/id_no: " . $clue->name_ar . " (ID: " . $clue->id . ")\n";
        } else {
            echo "❓ No student matches even by number. Checking first 10 students...\n";
            foreach (Student::limit(5)->get() as $s) {
                echo "  Student: " . $s->name_ar . " | ID: " . $s->id . " | No: " . $s->student_no . "\n";
            }
        }
    }
} else {
    echo "No grades found at all for assessment $assessmentId.\n";
}
