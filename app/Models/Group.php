<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Group extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'name_ar', 'name_en', 'description', 'staff_id', 'subject_id', 'grade_id'
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

    public function teacher()
    {
        return $this->belongsTo(Staff::class, 'staff_id');
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'group_students');
    }

    public function assessments()
    {
        return $this->hasMany(Assessment::class);
    }
}
