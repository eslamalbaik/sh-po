<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$staffUsers = DB::table('users')
    ->join('staff', 'users.id', '=', 'staff.user_id')
    ->select('users.email', 'staff.name_ar', 'users.role', 'users.login_id')
    ->limit(5)
    ->get();

foreach ($staffUsers as $user) {
    echo "Name: {$user->name_ar}, Email: {$user->email}, LoginID: {$user->login_id}, Role: {$user->role}\n";
}
