<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Staff;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

$s = Staff::where('staff_no', 'T1164')->first();
if ($s) {
    // Check if user with this login_id exists
    $u = User::where('login_id', 'T1164')->first();
    if (!$u) {
        $u = User::create([
            'login_id' => 'T1164',
            'name' => $s->name_ar,
            'password' => Hash::make('00000'),
            'role' => 'teacher'
        ]);
        echo "Created new user for Sabrina: {$u->id}\n";
    } else {
        echo "User already exists for Sabrina: {$u->id}\n";
    }
    
    $s->user_id = $u->id;
    $s->save();
    echo "Linked Sabrina to user: {$u->id}\n";
} else {
    echo "Sabrina staff record not found!\n";
}
