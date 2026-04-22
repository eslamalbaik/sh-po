<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = ['name_ar', 'name_en'];

    public function assignments()
    {
        return $this->hasMany(TeacherAssignment::class);
    }
}
