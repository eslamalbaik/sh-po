<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = User::where('role', 'teacher')->get();

echo "Analyzing " . $users->count() . " teachers...\n";
echo str_repeat("-", 80) . "\n";
echo str_pad("Login ID", 15) . " | " . str_pad("Stored Hash (First 10)", 15) . " | " . "Match Found?\n";
echo str_repeat("-", 80) . "\n";

$stats = [
    'bcrypt' => 0,
    'sha256_full_id' => 0,
    'sha256_numbers' => 0,
    'sha256_lower' => 0,
    'plain_full' => 0,
    'plain_numbers' => 0,
    'no_match' => 0
];

foreach ($users as $user) {
    $found = false;
    $id = trim($user->login_id);
    $numbers = preg_replace('/[^0-9]/', '', $id);
    $hash = $user->password;
    
    $matchType = "❌ NONE";

    if (str_starts_with($hash, '$2y$')) {
        $matchType = "✅ BCRYPT";
        $stats['bcrypt']++;
        $found = true;
    } elseif (hash('sha256', $id) === $hash) {
        $matchType = "✅ SHA256(ID)";
        $stats['sha256_full_id']++;
        $found = true;
    } elseif (hash('sha256', strtolower($id)) === $hash) {
        $matchType = "✅ SHA256(lower ID)";
        $stats['sha256_lower']++;
        $found = true;
    } elseif ($numbers && hash('sha256', $numbers) === $hash) {
        $matchType = "✅ SHA256(Numbers)";
        $stats['sha256_numbers']++;
        $found = true;
    } elseif ($id === $hash) {
        $matchType = "✅ PLAIN(ID)";
        $stats['plain_full']++;
        $found = true;
    } elseif ($numbers && $numbers === $hash) {
        $matchType = "✅ PLAIN(Numbers)";
        $stats['plain_numbers']++;
        $found = true;
    }
    
    if (!$found) $stats['no_match']++;

    echo str_pad($id, 15) . " | " . str_pad(substr($hash, 0, 10), 15) . " | " . $matchType . "\n";
}

echo str_repeat("-", 80) . "\n";
echo "Summary Statistics:\n";
foreach ($stats as $type => $count) {
    echo str_pad($type, 20) . ": $count\n";
}
