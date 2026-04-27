<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$subjects = \App\Models\Subject::all();
foreach ($subjects as $s) {
    echo "ID: {$s->id} | AR: {$s->name_ar} | EN: {$s->name_en}\n";
}
