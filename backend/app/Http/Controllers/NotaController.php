<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Nota;
use App\Models\DetailNotaJasa;
use App\Models\DetailNotaMaterial;
use Illuminate\Support\Facades\Auth;


class NotaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $nota = Nota::with([
            'workOrder.booking.user',
            'workOrder.booking.kendaraan',
            'workOrder.mekanik'
        ])
            ->latest()
            ->get();

        return response()->json([
            'data' => $nota
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'WOID' => 'required|exists:work_order,id'
        ]);

        $nota = Nota::create([
            'WOID' => $request->WOID,
            'tanggal' => now(),
            'totalHarga' => 0,
            'status' => 'belum_lunas'
        ]);

        return response()->json([
            'message' => 'Nota berhasil dibuat',
            'data' => $nota
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $nota = Nota::with([
            'workOrder.booking.user',
            'workOrder.booking.kendaraan'
        ])->findOrFail($id);

        $woid = $nota->WOID;

        $jasa = DetailNotaJasa::where(
            'WOID',
            $woid
        )->get();

        $material = DetailNotaMaterial::with(
            'material'
        )
            ->where(
                'WOID',
                $woid
            )
            ->get();

        return response()->json([
            'nota' => $nota,
            'jasa' => $jasa,
            'material' => $material
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
        //
    }


    public function terbitkanNTA($woid)
    {
        $nota = Nota::where('WOID', $woid)->firstOrFail();

        $totalJasa = DetailNotaJasa::where(
            'WOID',
            $woid
        )->sum('hargaJasa');

        $materials = DetailNotaMaterial::with('material')
            ->where('WOID', $woid)
            ->get();

        $totalMaterial = 0;

        foreach ($materials as $item) {
            if ($item->material) {
                $totalMaterial +=
                    $item->material->harga * $item->qty;
            }
        }

        $totalHarga = $totalJasa + $totalMaterial;

        $nota->update([
            'totalHarga' => $totalHarga,
            'status' => 'belum_lunas'
        ]);

        return response()->json([
            'message' => 'NTA berhasil diterbitkan',
            'totalHarga' => $totalHarga
        ]);
    }

    public function userHistory()
    {
        $user = Auth::user();
        $notas = Nota::with('workOrder.booking.kendaraan')
            ->whereHas('workOrder.booking', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->where('status', 'lunas')
            ->get();
        return response()->json($notas);
    }
}
