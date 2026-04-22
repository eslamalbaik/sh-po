<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

function testPassword($name, $stored, $input, $expected) {
    $user = new User();
    $user->password = $stored;
    
    // Manually set password because the 'hashed' cast might interfere if we just assign
    // For testing existing DB values, we should set the raw value
    $user->setRawAttributes(['password' => $stored]);
    
    $result = $user->verifyPassword($input);
    $needsRehash = $user->needsRehash();
    
    echo "Test [$name]:\n";
    echo "  Stored: $stored\n";
    echo "  Input:  $input\n";
    echo "  Result: " . ($result ? "PASS" : "FAIL") . " (Expected: " . ($expected ? "PASS" : "FAIL") . ")\n";
    echo "  Needs Rehash: " . ($needsRehash ? "YES" : "NO") . "\n\n";
}

// 1. Test Bcrypt
$bcryptHash = Hash::make('secret123');
testPassword('Bcrypt', $bcryptHash, 'secret123', true);

// 2. Test SHA256
$sha256Hash = hash('sha256', 'legacy123');
testPassword('SHA256', $sha256Hash, 'legacy123', true);

// 3. Test Plain
testPassword('Plain', 'plain123', 'plain123', true);

// 4. Test T-Prefix mismatch (Teacher case)
$userT = new User();
$userT->setRawAttributes([
    'role' => 'teacher',
    'login_id' => 'T572703',
    'password' => hash('sha256', 'T572703')
]);
$resultT = $userT->verifyPassword('572703');

echo "Test [T-Prefix] Fix:\n";
echo "  User Role: " . $userT->role . "\n";
echo "  User Login ID: " . $userT->login_id . "\n";
echo "  Stored Hash: " . $userT->password . "\n";
echo "  Calculated Hash (T+Input): " . hash('sha256', 'T' . '572703') . "\n";
echo "  Result: " . ($resultT ? "PASS" : "FAIL") . " (Expected: PASS)\n\n";

// 5. Test Incorrect
testPassword('Incorrect', $bcryptHash, 'wrong', false);
