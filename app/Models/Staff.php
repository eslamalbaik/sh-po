<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Searchable;

class Staff extends Model
{
    use Searchable;

    protected $fillable = [
        'id',
        'user_id',
        'name_ar',
        'name_en',
        'staff_no'
    ];

    protected $searchable = ['name_ar', 'name_en', 'staff_no'];

    public $incrementing = false;
    protected $keyType = 'string';

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assignments()
    {
        return $this->hasMany(TeacherAssignment::class, 'staff_id');
    }

    public function groups()
    {
        return $this->hasMany(Group::class, 'staff_id');
    }
}
