<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('parent_portal_views', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->char('student_id', 36);
            $table->string('viewer_type', 20); // parent | admin
            $table->string('action', 30); // login | view_results
            $table->char('viewer_user_id', 36)->nullable();
            $table->char('viewer_staff_id', 36)->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('student_id')->references('id')->on('students')->cascadeOnDelete();
            $table->foreign('viewer_user_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('viewer_staff_id')->references('id')->on('staff')->nullOnDelete();
            $table->index(['student_id', 'created_at']);
            $table->index(['viewer_type', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parent_portal_views');
    }
};
