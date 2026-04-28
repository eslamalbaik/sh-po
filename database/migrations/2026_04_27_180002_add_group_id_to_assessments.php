<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('assessments', function (Blueprint $table) {
            $table->unsignedBigInteger('section_id')->nullable()->change();
            $table->char('group_id', 36)->nullable()->after('section_id');
            $table->foreign('group_id')->references('id')->on('groups')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('assessments', function (Blueprint $table) {
            $table->dropForeign(['group_id']);
            $table->dropColumn('group_id');
            $table->unsignedBigInteger('section_id')->nullable(false)->change();
        });
    }
};
