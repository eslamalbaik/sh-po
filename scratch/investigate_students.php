<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Student;
use App\Models\Section;

// Get Bradley's sections
$sections = Section::where('letter', 'like', 'Gen%')->with('grade')->get();

foreach ($sections as $s) {
    $count = Student::where('section_id', $s->id)->where('is_active', true)->count();
    $fullName = ($s->grade->number ?? '') . $s->letter;
    if ($fullName == '8Gen5' || $fullName == '8Gen6') {
        echo "Section: " . $fullName . " (ID: " . $s->id . ") - Students: " . $count . "\n";
    }
}

// Compare 8Gen5 and 8Gen6
$sec5 = Section::whereHas('grade', function($q){$q->where('number', 8);})->where('letter', 'Gen5')->first();
$sec6 = Section::whereHas('grade', function($q){$q->where('number', 8);})->where('letter', 'Gen6')->first();

if ($sec5 && $sec6) {
    $names5 = Student::where('section_id', $sec5->id)->where('is_active', true)->pluck('name_ar')->toArray();
    $names6 = Student::where('section_id', $sec6->id)->where('is_active', true)->pluck('name_ar')->toArray();
    
    $common = array_intersect($names5, $names6);
    echo "\nCommon names between 8Gen5 and 8Gen6: " . count($common) . "\n";
    if (count($common) > 0) {
        foreach ($common as $c) echo "- " . $c . "\n";
    }

    echo "\nStudents in 8Gen6 but not 8Gen5:\n";
    $diff = array_diff($names6, $names5);
    foreach ($diff as $d) echo "- " . $d . "\n";
}

// Check for duplicate names in the whole database
echo "\nChecking for duplicate student names across the entire database:\n";
$duplicates = Student::select('name_ar', \DB::raw('COUNT(*) as count'))
    ->groupBy('name_ar')
    ->having('count', '>', 1)
    ->get();

if ($duplicates->count() > 0) {
    foreach ($duplicates as $d) {
        echo "- " . $d->name_ar . " (" . $d->count . " times)\n";
    }
} else {
    echo "No duplicate student names found.\n";
}
