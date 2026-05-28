<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\work_order;
use Illuminate\Support\Facades\Auth;
use App\Models\WorkOrderLog;
use Illuminate\Http\Request;

class KelolaBookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        $bookings = Booking::with([
            'user',
            'kendaraan',
            'workOrder'
        ])
        ->where('bengkel_id', $user->bengkel_id)
        ->latest()
        ->get();

        return response()->json([
            'data' => $bookings
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required'
        ]);

        $booking = Booking::findOrFail($id);

        // update booking
        $booking->status = $request->status;
        $booking->save();

        // cari work order terkait
        $workOrder = work_order::where(
            'booking_id',
            $booking->id
        )->first();

        // kalau ada WO, update juga
        if ($workOrder) {

            $workOrder->statusWO = $request->status;
            $workOrder->save();

            // insert log
            WorkOrderLog::create([
                'work_order_id' => $workOrder->id,
                'status' => $request->status,
            ]);
        }

        return response()->json([
            'message' => 'Status booking berhasil diupdate',
            'data' => $booking
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
