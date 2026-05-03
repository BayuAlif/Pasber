<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bengkel extends Model
{
     use HasFactory;

      protected $fillable = [
        'nama',
        'alamat'
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
