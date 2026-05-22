<?php

namespace App\Http\Controllers;
use App\Models\work_order;

use Illuminate\Http\Request;

class WorkOrderController extends Controller
{
       public function index()
        {
                $workOrders = work_order::with([
                'booking.kendaraan',
                'mekanik'
            ])->get();

            return response()->json([
                'data' => $workOrders
            ]);
        }

    public function store(Request $request)
    {
        $request->validate([
            'booking_id' => 'required|exists:booking,id',
            'mekanik_id' => 'required|exists:mekanik,id',
            'statusWO' => 'required',
        ]);

        $workOrder = work_order::create([
            'booking_id' => $request->booking_id,
            'mekanik_id' => $request->mekanik_id,
            'statusWO' => $request->statusWO,
            'estimasiWaktu' => $request->estimasiWaktu,
        ]);

        return response()->json([
            'message' => 'Work order berhasil dibuat',
            'data' => $workOrder
        ], 201);
    }

    public function show(string $id)
    {
        work_order::with([
            'booking.kendaraan',
            'mekanik'
        ])->get();
    }

    public function update(Request $request, string $id)
    {

    }

    public function destroy(string $id)
    {

    }
}
