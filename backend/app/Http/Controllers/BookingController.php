<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\work_order;
use App\Models\Booking;
use App\Models\WorkOrderLog;


class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $bookings = Booking::with([
            'kendaraan',
            'booking.bengkel',
            'workOrder'
        ])
        ->where('user_id', $request->user()->id)
        ->whereHas('workOrder', function ($query) {
            $query->where('statusWO', '!=', 'paid');
        })
        ->latest()
        ->get();

        return response()->json([
            'data' => $bookings
        ]);
    }

    public function fullDates(Request $request)
    {
        $request->validate([
            'bulan' => 'required|integer|min:1|max:12',
            'tahun' => 'required|integer',
            'bengkel_id' => 'required|exists:bengkel,id',
        ]);

        $MAX_BOOKING = 5;

        $bookings = Booking::where('bengkel_id', $request->bengkel_id)

            ->whereYear('jadwalService', $request->tahun)

            ->whereMonth('jadwalService', $request->bulan)

            ->get()

            ->groupBy(function ($booking) {

                return \Carbon\Carbon::parse(
                    $booking->jadwalService
                )->format('Y-m-d');
            });

        $fullDates = [];

        $quotaInfo = [];

        foreach ($bookings as $date => $items) {

            $count = $items->count();

            $remaining = max(
                0,
                $MAX_BOOKING - $count
            );

            $day =
                \Carbon\Carbon::parse($date)->day;

            // kalau full
            if ($count >= $MAX_BOOKING) {

                $fullDates[] = $day;
            }

            // info quota
            $quotaInfo[] = [
                'date' => $date,
                'day' => $day,
                'booked' => $count,
                'remaining' => $remaining,
                'isFull' => $count >= $MAX_BOOKING,
            ];
        }

        return response()->json([
            'maxBooking' => $MAX_BOOKING,
            'fullDates' => $fullDates,
            'quotaInfo' => $quotaInfo,
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
            'jadwalService' => [
                'required',
                'after_or_equal:today'
                ],
        ]);

        // insert ke booking
        $booking = Booking::create([
            'user_id' => Auth::id(),
            'kendaraan_id' => $request->kendaraan_id,
            'bengkel_id' => $request->bengkel_id,
            'tanggalBooking' => now(),
            'Keluhan' => $request->Keluhan,
            'status' => 'pending',
            'jadwalService' => $request->jadwalService,
        ]);

        $prefix = strtoupper(
            substr($booking->bengkel->nama, 0, 3)
        );
        $kodeWO =
            'WO-' .
            $prefix .
            '-' .
            str_pad($booking->id, 5, '0', STR_PAD_LEFT);

        // inih create work_order nya disini
        $workOrder = work_order::create([
            'booking_id' => $booking->id,
            'statusWO' => 'pending',
            'kodeWO' => $kodeWO,
        ]);

        // add logs
        WorkOrderLog::create([
            'work_order_id' => $workOrder->id,
            'status' => 'pending',
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
