<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentResultView extends Model
{
    protected $table = 'v_student_results';
    public $timestamps = false;
    protected $primaryKey = null;
    public $incrementing = false;

    // سكوب لجلب نتائج طالب معين
    public function scopeForStudent($query, $studentId)
    {
        return $query->where('student_id', $studentId);
    }
}
