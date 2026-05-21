<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Booking;
use App\Models\Mekanik;

class work_order extends Model
{
    protected $table = 'work_order';

    protected $fillable = [
        'booking_id',
        'mekanik_id',
        'statusWO',
        'estimasiWaktu',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function mekanik()
    {
        return $this->belongsTo(Mekanik::class);
    }
}
