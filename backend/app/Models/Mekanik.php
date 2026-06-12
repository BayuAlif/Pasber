<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\work_order;

class Mekanik extends Model
{
    protected $table = 'mekanik';

    protected $fillable = [
        'kodeMekanik',
        'bengkel_id',
        'nama',
        'email',
        'telepon',
        'spesialisasi',
        'foto',
        'status'
    ];

    public function workOrders()
    {
        return $this->hasMany(work_order::class);
    }
    public function bengkel()
    {
        return $this->belongsTo(
            Bengkel::class,
            'bengkel_id'
        );
    }
}
