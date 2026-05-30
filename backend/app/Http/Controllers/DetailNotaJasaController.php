<?php

namespace App\Http\Controllers;
use App\Models\DetailNotaJasa;

use Illuminate\Http\Request;

class DetailNotaJasaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'data' => DetailNotaJasa::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'WOID' => 'required|exists:work_order,id',
            'namaJasa' => 'required|string|max:255',
            'hargaJasa' => 'required|numeric|min:0'
        ]);

        $jasa = DetailNotaJasa::create([
            'WOID' => $request->WOID,
            'namaJasa' => $request->namaJasa,
            'hargaJasa' => $request->hargaJasa
        ]);

        return response()->json([
            'message' => 'Jasa berhasil ditambahkan',
            'data' => $jasa
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $jasa = DetailNotaJasa::findOrFail($id);

        return response()->json([
            'data' => $jasa
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $jasa = DetailNotaJasa::findOrFail($id);

        $jasa->update($request->only([
            'namaJasa',
            'hargaJasa'
        ]));

        return response()->json([
            'message' => 'Jasa berhasil diupdate',
            'data' => $jasa
        ]);
    }

    public function destroy(string $id)
    {
        $jasa = DetailNotaJasa::findOrFail($id);

        $jasa->delete();

        return response()->json([
            'message' => 'Jasa berhasil dihapus'
        ]);
    }

}
