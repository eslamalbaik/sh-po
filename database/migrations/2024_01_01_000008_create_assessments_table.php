<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('assessments', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->unsignedBigInteger('section_id');
            $table->char('staff_id', 36)->nullable();
            $table->unsignedBigInteger('subject_id')->nullable();
            $table->enum('status', ['draft', 'published'])->default('published');
            $table->timestamp('published_at')->nullable();
            $table->string('note_ar')->nullable();
            $table->string('note_en')->nullable();
            $table->enum('type', ['exam', 'task', 'quiz', 'project', 'oral'])->default('exam');
            $table->decimal('full_mark', 5, 2)->default(20);
            $table->decimal('weight', 5, 2)->default(20);
            $table->timestamps();

            $table->foreign('section_id')->references('id')->on('sections')->onDelete('cascade');
            $table->foreign('staff_id')->references('id')->on('staff')->nullOnDelete();
            $table->foreign('subject_id')->references('id')->on('subjects')->nullOnDelete();
            $table->index(['section_id', 'subject_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assessments');
    }
};
