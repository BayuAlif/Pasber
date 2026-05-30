<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bengkel extends Model
{
     use HasFactory;

     protected $table = 'bengkel';
    protected $fillable = [
        'nama',
        'alamat',
        'lat',
        'lng',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

     public function mekanik()
    {
        return $this->hasMany(
            Mekanik::class,
            'bengkel_id'
        );
    }

}
