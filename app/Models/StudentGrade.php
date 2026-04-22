<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentGrade extends Model
{
    public $incrementing = true; // id is integer id()
    protected $keyType = 'int';

    protected $fillable = ['id', 'assessment_id', 'student_id', 'score', 'is_absent'];

    public function assessment() { return $this->belongsTo(Assessment::class); }
    public function student() { return $this->belongsTo(Student::class); }
}
