<?php

namespace App\Http\Controllers;
use App\Models\DetailNotaMaterial;

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
        $request->validate([
            'WOID' => 'required|exists:work_order,id',
            'materialID' => 'required|exists:material,id',
            'qty' => 'required|integer|min:1'
        ]);

        $detail = DetailNotaMaterial::create([
            'WOID' => $request->WOID,
            'materialID' => $request->materialID,
            'qty' => $request->qty
        ]);

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
