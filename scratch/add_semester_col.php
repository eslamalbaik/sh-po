<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

echo "🚀 Adding semester_id to assessments table...\n";

if (!Schema::hasColumn('assessments', 'semester_id')) {
    Schema::table('assessments', function (Blueprint $table) {
        $table->unsignedTinyInteger('semester_id')->default(3)->after('subject_id');
    });
    echo "✅ Column added successfully.\n";
} else {
    echo "ℹ️ Column already exists.\n";
}
