<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

$users = User::where('role', 'teacher')->take(10)->get();

$salts = ['', 'MZS@2026', 'MZS@Staff2026', '2026', 'changeme'];

echo "Pattern Finding...\n";

foreach ($users as $u) {
    $id = trim($u->login_id);
    $num = preg_replace('/[^0-9]/', '', $id);
    $hash = $u->password;
    
    echo "ID: $id | Hash: $hash\n";
    
    foreach ([$id, $num] as $in) {
        foreach ($salts as $salt) {
            $candidates = [
                'SHA256(in)' => hash('sha256', $in),
                'SHA256(in.salt)' => hash('sha256', $in . $salt),
                'SHA256(salt.in)' => hash('sha256', $salt . $in),
                'MD5(in)' => md5($in),
                'MD5(in.salt)' => md5($in . $salt),
                'SHA1(in)' => sha1($in),
                'SHA256(SHA256(in))' => hash('sha256', hash('sha256', $in)),
                'SHA256(MD5(in))' => hash('sha256', md5($in)),
            ];
            
            foreach ($candidates as $name => $val) {
                if ($val === $hash) {
                    echo "  MATCH! Type: $name (Input: $in, Salt: $salt)\n";
                }
            }
        }
    }
}
