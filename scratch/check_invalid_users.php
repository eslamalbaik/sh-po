<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Staff;
use App\Models\User;

foreach (Staff::all() as $s) {
    if (!$s->user_id) {
        echo "Staff {$s->staff_no} has NULL user_id\n";
        continue;
    }
    if (!User::find($s->user_id)) {
        echo "Staff {$s->staff_no} has INVALID user_id: {$s->user_id}\n";
    }
}
echo "Check complete.\n";
