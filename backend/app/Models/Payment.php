<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'nota_id',
        'transaction_id',
        'payment_type',
        'amount',
    ];

    public function nota()
    {
        return $this->belongsTo(
            Nota::class,
            'nota_id'
        );
    }
}
