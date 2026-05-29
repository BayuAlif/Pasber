<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailNotaMaterial extends Model
{
    protected $table = 'detail_nota_material';

    protected $fillable = [
        'WOID',
        'materialID',
        'qty'
    ];

    public function workOrder()
    {
        return $this->belongsTo(
            work_order::class,
            'WOID'
        );
    }

    public function material()
    {
        return $this->belongsTo(
            Material::class,
            'materialID'
        );
    }
}
