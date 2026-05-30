<?php

namespace App\Http\Controllers;

use App\Models\DetailNotaMaterial;
use App\Models\Material;

use Illuminate\Http\Request;

class DetailNotaMaterialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'data' => DetailNotaMaterial::with('material')->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $material = Material::findOrFail(
            $request->materialID
        );

        if ($material->stok < $request->qty) {
            return response()->json([
                'message' => 'Stok tidak mencukupi'
            ], 400);
        }

        $detail = DetailNotaMaterial::create([
            'WOID' => $request->WOID,
            'materialID' => $request->materialID,
            'qty' => $request->qty
        ]);

        $material->decrement(
            'stok',
            $request->qty
        );

        return response()->json([
            'message' => 'Material berhasil ditambahkan',
            'data' => $detail
        ], 201);
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
