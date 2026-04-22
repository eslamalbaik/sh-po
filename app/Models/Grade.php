<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    protected $fillable = ['number'];

    public function sections()
    {
        return $this->hasMany(Section::class);
    }
}
