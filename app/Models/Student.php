<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Student extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'student_no', 'student_id_no', 'name_ar', 'name_en', 
        'grade_id', 'section_id', 'parent_user_id', 'parent_mobile', 'is_active'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    public function grade() { return $this->belongsTo(Grade::class); }
    public function section() { return $this->belongsTo(Section::class); }
    public function parent() { return $this->belongsTo(User::class, 'parent_user_id'); }
    public function grades() { return $this->hasMany(StudentGrade::class); }
}
