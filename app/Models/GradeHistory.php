<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GradeHistory extends Model
{
    protected $table = 'grade_history';
    protected $fillable = ['student_grade_id', 'old_score', 'new_score', 'old_absent', 'new_absent', 'staff_id'];

    public function grade() { return $this->belongsTo(StudentGrade::class, 'student_grade_id'); }
    public function staff() { return $this->belongsTo(Staff::class, 'staff_id'); }
}
