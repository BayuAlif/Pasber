<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
     protected $table = 'booking';

    protected $primaryKey = 'BookingID';

    protected $fillable = [
        'user_id',
        'kendaraanID',
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
    return $this->belongsTo(
        Kendaraan::class,
        'kendaraanID'
    );
}
}
