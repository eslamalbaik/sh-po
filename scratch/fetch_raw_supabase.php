<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Http;

$url = 'https://agfwsdxigdbdsulzdjab.supabase.co';
$key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnZndzZHhpZ2RiZHN1bHpkamFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NDAzNjEsImV4cCI6MjA5MTMxNjM2MX0.yPYmdFpUQDd6k-w9gyiAKta88qiPCHV9v913-oV9Xgc';

$resp = Http::withHeaders([
    'apikey' => $key,
    'Authorization' => "Bearer $key",
])->get("$url/rest/v1/users", [
    'login_id' => 'eq.T572703',
    'select' => '*'
]);

if ($resp->successful()) {
    print_r($resp->json());
} else {
    echo "Error: " . $resp->status() . "\n";
    echo $resp->body() . "\n";
}
