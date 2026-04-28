<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Searchable;

class Subject extends Model
{
    use Searchable;

    protected $fillable = ['name_ar', 'name_en'];

    protected $searchable = ['name_ar', 'name_en'];

    public function assignments()
    {
        return $this->hasMany(TeacherAssignment::class);
    }
}
