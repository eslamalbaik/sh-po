<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentGrade extends Model
{
    public $incrementing = true; // id is integer id()
    protected $keyType = 'int';

    protected $fillable = ['id', 'assessment_id', 'student_id', 'staff_id', 'score', 'is_absent', 'created_by', 'updated_by', 'is_edited'];

    public function assessment() { return $this->belongsTo(Assessment::class); }
    public function student() { return $this->belongsTo(Student::class); }
    public function creator() { return $this->belongsTo(Staff::class, 'created_by'); }
    public function updater() { return $this->belongsTo(Staff::class, 'updated_by'); }
    public function history() { return $this->hasMany(GradeHistory::class, 'student_grade_id'); }
}
