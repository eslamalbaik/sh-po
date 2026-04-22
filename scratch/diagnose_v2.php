<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = User::where('role', 'teacher')->get();

echo "Analyzing " . $users->count() . " teachers...\n";

foreach ($users as $user) {
    $id = trim($user->login_id);
    $num = preg_replace('/[^0-9]/', '', $id);
    $hash = $user->password;
    
    $match = "NONE";
    
    // Check various combinations
    $tests = [
        'BCRYPT' => password_verify($num, $hash) || password_verify($id, $hash),
        'SHA256_ID' => hash('sha256', $id) === $hash,
        'SHA256_NUM' => hash('sha256', $num) === $hash,
        'PLAIN_ID' => $id === $hash,
        'PLAIN_NUM' => $num === $hash,
        'MD5_ID' => md5($id) === $hash,
        'MD5_NUM' => md5($num) === $hash,
    ];
    
    foreach ($tests as $type => $passed) {
        if ($passed) {
            $match = $type;
            break;
        }
    }
    
    if ($id === 'T572703') {
        echo "DEBUG T572703:\n";
        echo "  ID: $id\n";
        echo "  NUM: $num\n";
        echo "  HASH: $hash\n";
        echo "  calc SHA256(ID): " . hash('sha256', $id) . "\n";
        echo "  Match Found: $match\n";
    }

    if ($match === "NONE") {
        // Maybe it's double SHA256 or something?
        // Let's just log it
    }
}
