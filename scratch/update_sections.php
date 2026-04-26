<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Section;

Section::all()->each(function($s) {
    $s->letter = str_replace('Gen', 'عام', $s->letter);
    $s->label_ar = str_replace('Gen', 'عام', $s->label_ar);
    $s->label_en = str_replace('Gen', 'عام', $s->label_en);
    $s->save();
});

echo "Sections updated successfully.\n";
