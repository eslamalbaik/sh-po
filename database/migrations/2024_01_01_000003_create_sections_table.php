<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('grade_id');
            $table->string('letter', 10);
            $table->string('label_ar')->nullable();
            $table->string('label_en')->nullable();
            $table->timestamps();

            $table->foreign('grade_id')->references('id')->on('grades')->onDelete('cascade');
            $table->unique(['grade_id', 'letter']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sections');
    }
};
