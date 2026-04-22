<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeacherAssignment extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'staff_id',
        'section_id',
        'subject_id',
        'semester_id',
        'expected_assessments'
    ];

    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
}
