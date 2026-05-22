<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\bengkel;
use App\Models\booking;
use App\Models\kendaraan;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'noKontak',
        'alamat',
        'fotoProfile',
        'bengkel_id',
        'is_profile_complete'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }



    public function bengkel()
    {
        return $this->belongsTo(Bengkel::class);
    }

    public function kendaraan()
    {
        return $this->hasMany(Kendaraan::class);
    }

    public function booking()
    {
        return $this->hasMany(Booking::class);
    }
}
