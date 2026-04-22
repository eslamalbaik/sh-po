<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'login_id',
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'locked_until',
        'failed_attempts',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'locked_until' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    // Relationships
    public function staff()
    {
        return $this->hasOne(Staff::class, 'user_id');
    }

    public function students()
    {
        return $this->hasMany(Student::class, 'parent_user_id');
    }

    /**
     * Verify if the given password matches the stored hash.
     */
    public function verifyPassword(string $password): bool
    {
        return \Illuminate\Support\Facades\Hash::check($password, $this->password);
    }

    /**
     * Check if the current password needs to be rehashed to Bcrypt.
     */
    public function needsRehash(): bool
    {
        return !str_starts_with($this->password, '$2y$');
    }
}
