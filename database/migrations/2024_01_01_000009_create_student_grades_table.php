<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('student_grades', function (Blueprint $table) {
            $table->id();
            $table->char('assessment_id', 36);
            $table->char('student_id', 36);
            $table->decimal('score', 5, 2)->nullable();
            $table->boolean('is_absent')->default(false);
            $table->timestamps();

            $table->foreign('assessment_id')->references('id')->on('assessments')->onDelete('cascade');
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
            $table->unique(['assessment_id', 'student_id']); // لضمان UPSERT
            $table->index('student_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_grades');
    }
};
