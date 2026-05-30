<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailNotaJasa extends Model
{
    protected $table = 'detail_nota_jasa';

    protected $fillable = [
        'WOID',
        'namaJasa',
        'hargaJasa'
    ];

    public function workOrder()
    {
        return $this->belongsTo(
            work_order::class,
            'WOID'
        );
    }
}
