<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ParentPortalView extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'id',
        'student_id',
        'viewer_type',
        'action',
        'viewer_user_id',
        'viewer_staff_id',
        'ip_address',
        'user_agent',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
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

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function viewerUser()
    {
        return $this->belongsTo(User::class, 'viewer_user_id');
    }

    public function viewerStaff()
    {
        return $this->belongsTo(Staff::class, 'viewer_staff_id');
    }
}
