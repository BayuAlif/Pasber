<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\Booking;


class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bookings = Booking::where(
            'user_id',
            Auth::id()
        )->get();

        return response()->json([
            'message' => 'Data booking berhasil diambil',
            'data' => $bookings
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'kendaraan_id' => 'required|exists:kendaraan,id',
            'bengkel_id' => 'required|exists:bengkel,id',
            'Keluhan'       => 'required',
            'jadwalService' => 'required',
        ]);

        $booking = Booking::create([

        'user_id' => Auth::id(),

        'kendaraan_id' => $request->kendaraan_id,

        'bengkel_id' => $request->bengkel_id,

        'tanggalBooking' => now(),

        'Keluhan' => $request->Keluhan,

        'status' => 'pending',

        'jadwalService' => $request->jadwalService,
    ]);

        return response()->json([
            'message' => 'Booking berhasil dibuat',
            'data' => $booking
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
         $booking = Booking::findOrFail($id);

        // keamanan
        if ($booking->user_id !== Auth::id()) {

            return response()->json([
                'message' => 'Akses ditolak'
            ], 403);
        }

        return response()->json([
            'data' => $booking
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
         $booking = Booking::findOrFail($id);

        // keamanan
        if ($booking->user_id !== Auth::id()) {

            return response()->json([
                'message' => 'Akses ditolak'
            ], 403);
        }

        $booking->delete();

        return response()->json([
            'message' => 'Booking berhasil dihapus'
        ]);
    }
}
