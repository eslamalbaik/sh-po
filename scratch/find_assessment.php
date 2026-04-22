<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Assessment;

echo "Searching for specific assessment...\n";

$a = Assessment::where('note_ar', 'like', '%الاختبار التكويني الأول%')->get();

if ($a->count() > 0) {
    foreach ($a as $item) {
        echo "Found ID: " . $item->id . "\n";
        echo "  Note: " . $item->note_ar . "\n";
        echo "  Section ID: " . $item->section_id . "\n";
        echo "  Subject ID: " . $item->subject_id . "\n";
        echo "  Staff ID: " . $item->staff_id . "\n";
        echo "  Semester: " . $item->semester_id . "\n";
        echo "-------------------\n";
    }
} else {
    echo "No matching assessment found in database.\n";
}
