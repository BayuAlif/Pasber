<?php

namespace App\Http\Controllers;
use App\Models\Booking;
use App\Models\work_order;




use Illuminate\Http\Request;

class KelolaBookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bookings = Booking::with([
        'user',
        'kendaraan'
        ])->latest()->get();

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

        $booking->status = $request->status;
        $booking->save();

        if ($request->status === 'approved') {

            work_order::create([
                'booking_id' => $booking->id,
                'statusWO' => 'approved',
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
