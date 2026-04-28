<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('group_students', function (Blueprint $table) {
            $table->id();
            $table->char('group_id', 36);
            $table->char('student_id', 36);
            $table->timestamps();

            $table->foreign('group_id')->references('id')->on('groups')->onDelete('cascade');
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
            $table->unique(['group_id', 'student_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('group_students');
    }
};
