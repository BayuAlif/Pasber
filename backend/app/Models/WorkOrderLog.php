<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkOrderLog extends Model
{
    protected $table = 'work_order_logs';

    protected $fillable = [
        'work_order_id',
        'status',
    ];

    public function workOrder()
    {
        return $this->belongsTo(work_order::class);
    }
}
