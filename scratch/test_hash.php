<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$plain = 'secret123';
$hashed = Hash::make($plain);

$user = new User();
$user->password = $hashed;

echo "Original Hash: " . $hashed . "\n";
echo "User Password Attribute: " . $user->password . "\n";

if ($hashed === $user->password) {
    echo "NO DOUBLE HASHING\n";
} else {
    echo "DOUBLE HASHING DETECTED!\n";
}
