<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    protected $table = 'Material';

    protected $fillable = [
        'namaMaterial',
        'merekMaterial',
        'kodeMaterial',
        'satuan',
        'harga',
        'stok'
    ];
}
