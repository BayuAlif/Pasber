<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\work_order;

class Mekanik extends Model
{
    protected $table = 'mekanik';

    protected $fillable = [
        'bengkel_id',
        'nama',
        'email',
        'status',
    ];

    public function workOrders()
    {
        return $this->hasMany(work_order::class);
    }
}
