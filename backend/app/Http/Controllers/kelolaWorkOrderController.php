<?php

namespace App\Http\Controllers;

use App\Models\work_order;
use App\Models\WorkOrderLog;
use App\Models\Mekanik;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Nota;

class kelolaWorkOrderController extends Controller
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
            ->where('statusWO', '!=', 'pending')
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $workOrder = work_order::findOrFail($id);

        $oldMekanikId = $workOrder->mekanik_id;
        $oldStatus = $workOrder->statusWO;

        // =========================
        // UPDATE DATA
        // =========================
        $workOrder->update([
            'mekanik_id' => $request->mekanik_id
                ?? $workOrder->mekanik_id,

            'estimasiWaktu' => $request->estimasiWaktu
                ?? $workOrder->estimasiWaktu,

            'statusWO' => $request->statusWO
                ?? $workOrder->statusWO,
        ]);

        $newMekanikId = $workOrder->mekanik_id;
        $newStatus = $workOrder->statusWO;

        if ($request->statusWO === 'paid' && $workOrder->booking) {
            $workOrder->booking->update(['status' => 'paid']);
        }

        // =========================
        // UPDATE STATUS MEKANIK (AVAILABLE/UNAVAILABLE)
        // =========================
        // Jika mekanik berubah
        if ($oldMekanikId != $newMekanikId) {
            if ($oldMekanikId) {
                $oldMek =Mekanik::find($oldMekanikId);
                if ($oldMek && $oldMek->status !== 'available') {
                    $oldMek->update(['status' => 'available']);
                }
            }
            if ($newMekanikId && in_array($newStatus, ['assigned', 'running'])) {
                $newMek = Mekanik::find($newMekanikId);
                if ($newMek && $newMek->status !== 'unavailable') {
                    $newMek->update(['status' => 'unavailable']);
                }
            }
        } else {
            if ($newMekanikId) {
                if (in_array($newStatus, ['done', 'paid', 'rejected'])) {
                    $mek = Mekanik::find($newMekanikId);
                    if ($mek && $mek->status !== 'available') {
                        $mek->update(['status' => 'available']);
                    }
                } elseif (in_array($newStatus, ['assigned', 'running']) && $oldStatus !== $newStatus) {
                    $mek = Mekanik::find($newMekanikId);
                    if ($mek && $mek->status !== 'unavailable') {
                        $mek->update(['status' => 'unavailable']);
                    }
                }
            }
        }

        // =========================
        // BUAT NOTA JIKA STATUS = DONE
        // =========================
        if ($request->statusWO === 'done') {
            Nota::firstOrCreate(
                ['WOID' => $workOrder->id],
                [
                    'tanggal' => now(),
                    'totalHarga' => 0,
                    'status' => 'pending'
                ]
            );
        }

        // =========================
        // CREATE LOG
        // =========================
        if ($request->statusWO) {
            WorkOrderLog::create([
                'work_order_id' => $workOrder->id,
                'status' => $request->statusWO,
            ]);
        }

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
        //
    }

    public function woSelesai()
    {
        $wo = work_order::with([
            'booking.user',
            'booking.kendaraan',
            'mekanik',
            'nota'
        ])
            ->where('statusWO', 'done')
            ->whereHas('nota', function ($q) {
                $q->where('status', 'pending');
            })
            ->get();

        return response()->json($wo);
    }
}
