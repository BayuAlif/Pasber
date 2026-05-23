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

        // =========================
        // UPDATE STATUS BOOKING
        // =========================
        $booking->status = $request->status;
        $booking->save();

        // =========================
        // JIKA APPROVED
        // BUAT WORK ORDER
        // =========================
        if ($request->status === 'approved') {

            $existingWO = work_order::where(
                'booking_id',
                $booking->id
            )->first();

            // supaya tidak duplicate
            if (!$existingWO) {

                $workOrder = work_order::create([
                    'booking_id' => $booking->id,
                    'statusWO' => 'approved',
                ]);

                // =========================
                // CREATE FIRST LOG
                // =========================
                WorkOrderLog::create([
                    'work_order_id' => $workOrder->id,
                    'status' => 'approved',
                ]);
            }
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
