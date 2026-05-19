<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->string('parent_password_hash')->nullable()->after('student_id_no');
            $table->string('parent_password_plain_temp')->nullable()->after('parent_password_hash');
            $table->timestamp('parent_password_generated_at')->nullable()->after('parent_password_plain_temp');
            $table->timestamp('parent_password_distributed_at')->nullable()->after('parent_password_generated_at');
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn([
                'parent_password_hash',
                'parent_password_plain_temp',
                'parent_password_generated_at',
                'parent_password_distributed_at',
            ]);
        });
    }
};
