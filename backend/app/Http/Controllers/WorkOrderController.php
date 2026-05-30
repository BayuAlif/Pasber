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
            'booking.bengkel',
            'mekanik',
            'logs'
        ])->get();

        return response()->json([
            'data' => $workOrders
        ]);
    }

    public function store(Request $request) {}


    public function show(string $id)
    {
        work_order::with([
            'booking.kendaraan',
            'mekanik'
        ])->get();
    }

    public function update(Request $request, string $id) {}

    public function destroy(string $id) {}

    public function active(Request $request)
    {
        $user = $request->user();

        $workOrder = work_order::with([
            'booking.kendaraan',
            'nota.payment'
        ])
            ->whereHas('booking', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })

            ->where('statusWO', '!=', 'paid')
            ->latest()
            ->get();

        return response()->json($workOrder);
    }
}
