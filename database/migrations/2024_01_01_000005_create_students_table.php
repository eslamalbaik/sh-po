<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->string('student_no')->unique();
            $table->string('student_id_no')->nullable(); // رقم الهوية = كلمة مرور ولي الأمر
            $table->string('name_ar');
            $table->string('name_en');
            $table->unsignedBigInteger('grade_id')->nullable();
            $table->unsignedBigInteger('section_id')->nullable();
            $table->char('parent_user_id', 36)->nullable();
            $table->string('parent_mobile', 20)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('grade_id')->references('id')->on('grades')->nullOnDelete();
            $table->foreign('section_id')->references('id')->on('sections')->nullOnDelete();
            $table->foreign('parent_user_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
