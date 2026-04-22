<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Student;
use App\Models\StudentGrade;
use App\Models\Assessment;
use App\Models\Section;

echo "🕵️ STARTING DEEP DATA AUDIT...\n";

// Use the assessment we found earlier
$assessmentId = 33223;
$a = Assessment::find($assessmentId);

if (!$a) {
    echo "❌ Assessment $assessmentId not found!\n";
    exit;
}

$section = Section::find($a->section_id);
echo "Assessment: " . $a->note_ar . " | Section: " . ($section->grade->number . $section->letter) . " (ID: " . $a->section_id . ")\n";

$studentsInSection = Student::where('section_id', $a->section_id)->pluck('id')->toArray();
echo "Students currently in this section: " . count($studentsInSection) . "\n";

$grades = StudentGrade::where('assessment_id', $assessmentId)->get();
echo "Grades found for this assessment: " . $grades->count() . "\n";

$foundCount = 0;
$mismatchCount = 0;
$ghostCount = 0;

foreach ($grades as $g) {
    if (in_array($g->student_id, $studentsInSection)) {
        $foundCount++;
    } else {
        $mismatchCount++;
        // Check if the student even exists in the database at all
        $s = Student::find($g->student_id);
        if ($s) {
            echo "  ⚠️ Grade for student " . $s->name_ar . " (ID: " . $g->student_id . ") found, but student is in Section: " . $s->section_id . "\n";
        } else {
            $ghostCount++;
        }
    }
}

echo "\nSummary for Assessment $assessmentId:\n";
echo "✅ Perfect matches (Student in Correct Section): $foundCount\n";
echo "⚠️ Mismatches (Student exists but in DIFFERENT Section): $mismatchCount\n";
echo "👻 Ghost Grades (Student ID does NOT exist in students table): $ghostCount\n";

if ($ghostCount > 0) {
    echo "\nTrying to find ghost students by name/no...\n";
    $sampleGhostId = $grades->first(fn($g) => !Student::find($g->student_id))->student_id;
    echo "Sample Ghost ID: $sampleGhostId\n";
}
