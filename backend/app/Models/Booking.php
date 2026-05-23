<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Kendaraan;
use App\Models\work_order;
use App\Models\User;

class Booking extends Model
{
     protected $table = 'booking';


    protected $fillable = [
        'user_id',
        'kendaraan_id',
        'bengkel_id',
        'tanggalBooking',
        'Keluhan',
        'status',
        'jadwalService',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function kendaraan()
    {
        return $this->belongsTo(Kendaraan::class);
    }

    public function workOrder()
    {
        return $this->hasOne(work_order::class);
    }
        public function bengkel()
    {
        return $this->belongsTo(Bengkel::class);
    }
}
