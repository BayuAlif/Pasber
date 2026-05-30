<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Nota;
use App\Models\DetailNotaJasa;
use App\Models\DetailNotaMaterial;


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
        //
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

    public function calculateTotal($id)
    {
        $nota = Nota::findOrFail($id);

        $woid = $nota->WOID;

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

        $totalHarga =
            $totalJasa +
            $totalMaterial;

        $nota->update([
            'totalHarga' => $totalHarga,
            'status' => 'belum_lunas'
        ]);

        return response()->json([
            'nota' => $nota->fresh(),
            'totalJasa' => $totalJasa,
            'totalMaterial' => $totalMaterial,
            'totalHarga' => $totalHarga
        ]);
    }
}
