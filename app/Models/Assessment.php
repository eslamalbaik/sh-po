<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Assessment extends Model
{
    use HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'section_id', 'staff_id', 'subject_id', 'status', 
        'published_at', 'note_ar', 'note_en', 'type', 'full_mark', 'weight'
    ];

    public function section() { return $this->belongsTo(Section::class); }
    public function staff() { return $this->belongsTo(Staff::class); }
    public function subject() { return $this->belongsTo(Subject::class); }
    public function studentGrades() { return $this->hasMany(StudentGrade::class); }
}
