<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Nota extends Model
{
    protected $table = 'Nota';

    protected $fillable = [
        'WOID',
        'tanggal',
        'totalHarga',
        'status'
    ];

    public function workOrder()
    {
        return $this->belongsTo(
            work_order::class,
            'WOID'
        );
    }
    public function payment()
    {
        return $this->hasOne(
            Payment::class,
            'nota_id'
        );
    }
}
