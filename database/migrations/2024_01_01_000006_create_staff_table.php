<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('staff', function (Blueprint $table) {
            $table->char('id', 36)->primary(); // UUID في Supabase
            $table->char('user_id', 36);
            $table->string('name_ar');
            $table->string('name_en')->nullable();
            $table->string('staff_no')->nullable()->unique();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staff');
    }
};
