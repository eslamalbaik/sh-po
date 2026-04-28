<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('groups', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->string('name_ar');
            $table->string('name_en')->nullable();
            $table->char('staff_id', 36);
            $table->unsignedBigInteger('subject_id');
            $table->unsignedBigInteger('grade_id');
            $table->timestamps();

            $table->foreign('staff_id')->references('id')->on('staff')->onDelete('cascade');
            $table->foreign('subject_id')->references('id')->on('subjects')->onDelete('cascade');
            $table->foreign('grade_id')->references('id')->on('grades')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('groups');
    }
};
