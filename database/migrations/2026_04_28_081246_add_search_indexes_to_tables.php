<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->index('name_ar');
            $table->index('name_en');
            $table->index('student_no');
        });

        Schema::table('staff', function (Blueprint $table) {
            $table->index('name_ar');
            $table->index('name_en');
            $table->index('staff_no');
        });

        Schema::table('subjects', function (Blueprint $table) {
            $table->index('name_ar');
            $table->index('name_en');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropIndex(['name_ar']);
            $table->dropIndex(['name_en']);
            $table->dropIndex(['student_no']);
        });

        Schema::table('staff', function (Blueprint $table) {
            $table->dropIndex(['name_ar']);
            $table->dropIndex(['name_en']);
            $table->dropIndex(['staff_no']);
        });

        Schema::table('subjects', function (Blueprint $table) {
            $table->dropIndex(['name_ar']);
            $table->dropIndex(['name_en']);
        });
    }
};
