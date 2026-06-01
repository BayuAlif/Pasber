<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\work_order;
use App\Models\WorkOrderLog;
use Illuminate\Support\Facades\Auth;

class AdminWorkOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        $workOrders = work_order::with([
            'booking.user',
            'booking.kendaraan',
            'booking.bengkel',
            'mekanik',
            'logs'
        ])
        ->whereHas('booking', function ($query) use ($user) {
            $query->where(
                'bengkel_id',
                $user->bengkel_id
            );
        })
        ->latest()
        ->get();

        return response()->json([
            'data' => $workOrders
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $workOrder = $this->findWorkOrderForBengkel($id);

        return response()->json([
            'data' => $workOrder
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'mekanik_id' => 'nullable|exists:mekanik,id',
            'estimasiWaktu' => 'nullable|numeric',
            'statusWO' => 'required',
        ]);

        $workOrder = $this->findWorkOrderForBengkel($id);

        $workOrder->update([
            'mekanik_id' => $request->mekanik_id,
            'estimasiWaktu' => $request->estimasiWaktu,
            'statusWO' => $request->statusWO,
        ]);

        WorkOrderLog::create([
            'work_order_id' => $workOrder->id,
            'status' => $request->statusWO,
        ]);

        return response()->json([
            'message' => 'Work order berhasil diupdate',
            'data' => $workOrder
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $workOrder = $this->findWorkOrderForBengkel($id);
        $workOrder->delete();

        return response()->json([
            'message' => 'Work order berhasil dihapus'
        ]);
    }

    protected function findWorkOrderForBengkel(string $id)
    {
        $user = Auth::user();

        return work_order::with([
            'booking.user',
            'booking.kendaraan',
            'booking.bengkel',
            'mekanik',
            'logs'
        ])
        ->where('id', $id)
        ->whereHas('booking', function ($query) use ($user) {
            $query->where('bengkel_id', $user->bengkel_id);
        })
        ->firstOrFail();
    }
}
