<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Booking;
use App\Models\Mekanik;
use App\Models\DetailNotaJasa;
use App\Models\DetailNotaMaterial;
use App\Models\Nota;

class work_order extends Model
{
    protected $table = 'work_order';

    protected $fillable = [
        'booking_id',
        'mekanik_id',
        'statusWO',
        'estimasiWaktu',
        'kodeWO',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function mekanik()
    {
        return $this->belongsTo(Mekanik::class);
    }

    public function logs()
    {
        return $this->hasMany(WorkOrderLog::class);
    }
    public function detailMaterial()
    {
        return $this->hasMany(
            DetailNotaMaterial::class,
            'WOID'
        );
    }

    public function detailJasa()
    {
        return $this->hasMany(
            DetailNotaJasa::class,
            'WOID'
        );
    }

    public function nota()
    {
        return $this->hasOne(
            Nota::class,
            'WOID'
        );
    }
}
