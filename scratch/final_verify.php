<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "🔍 Final Verification...\n";

$scenarios = [
    'Teacher Scan' => ['id' => 'T572703', 'pass' => '572703', 'role' => 'teacher'],
    'Admin Scan' => ['id' => 'ADMIN4', 'pass' => 'Admin@2026', 'role' => 'admin'],
];

foreach ($scenarios as $name => $data) {
    $user = User::where('login_id', $data['id'])->first();
    if (!$user) {
        echo "❌ $name: User not found!\n";
        continue;
    }

    $pass = Hash::check($data['pass'], $user->password);
    echo ($pass ? "✅" : "❌") . " $name (ID: {$data['id']}): Password Match: " . ($pass ? "YES" : "NO") . "\n";
    
    if ($user->role === 'teacher') {
        $staff = $user->staff;
        echo "   Name AR: " . ($staff->name_ar ?? 'N/A') . "\n";
    }
}
