<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kendaraan extends Model
{
    protected $table = 'kendaraan';

    protected $primaryKey = 'kendaraanID';

    protected $fillable = [
        'user_id',
        'nomorPolisi',
        'merek',
        'model',
        'tahun',
        'jenisKendaraan',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
