<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$s = \App\Models\Staff::where('staff_no', '576105')->first();
if ($s) {
    foreach ($s->assignments as $a) {
        echo "Sub: {$a->subject_id} | Name AR: {$a->subject->name_ar} | Name EN: {$a->subject->name_en}\n";
    }
} else {
    echo "Staff not found\n";
}
