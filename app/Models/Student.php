<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Traits\Searchable;

class Student extends Model
{
    use Searchable;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'student_no', 'student_id_no', 'name_ar', 'name_en',
        'grade_id', 'section_id', 'parent_user_id', 'parent_mobile', 'is_active',
        'parent_password_hash', 'parent_password_plain_temp',
        'parent_password_generated_at', 'parent_password_distributed_at',
    ];

    protected $hidden = [
        'parent_password_hash',
        'parent_password_plain_temp',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'parent_password_generated_at'   => 'datetime',
        'parent_password_distributed_at' => 'datetime',
    ];

    protected $searchable = ['name_ar', 'name_en', 'student_no'];

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
    public function groups() { return $this->belongsToMany(Group::class, 'group_students'); }
    public function parentPortalViews() { return $this->hasMany(ParentPortalView::class); }
}
