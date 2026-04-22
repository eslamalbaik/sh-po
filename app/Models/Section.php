<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    protected $fillable = ['grade_id', 'letter', 'label_ar', 'label_en'];

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }
}
