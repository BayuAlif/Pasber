<?php

namespace App\Http\Controllers;

use App\Models\Material;
use Illuminate\Http\Request;

class MaterialController extends Controller
{
    // GET /api/material
    public function index()
    {
        return response()->json(Material::all());
    }

    // POST /api/material
    public function store(Request $request)
    {
        $validated = $request->validate([
            'namaMaterial' => 'required|string',
            'merekMaterial' => 'required|string',
            'satuan' => 'required|in:pcs,box,liter,set,roll,unit',
            'harga' => 'required|integer',
            'stok' => 'required|integer',
        ]);

        $prefix = strtoupper(substr($request->namaMaterial, 0, 3));

        $lastMaterial = Material::where('kodeMaterial', 'like', $prefix . '-%')
            ->latest('id')
            ->first();

        $number = $lastMaterial
            ? ((int) substr($lastMaterial->kodeMaterial, 4)) + 1
            : 1;

        $validated['kodeMaterial'] =
            $prefix . '-' . str_pad($number, 3, '0', STR_PAD_LEFT);

        $material = Material::create($validated);

        return response()->json([
            'message' => 'Material berhasil ditambahkan',
            'data' => $material
        ], 201);
    }

    // GET /api/material/{id}
    public function show(string $id)
    {
        $material = Material::findOrFail($id);

        return response()->json($material);
    }

    // PUT /api/material/{id}
    public function update(Request $request, string $id)
    {
        $material = Material::findOrFail($id);

        $validated = $request->validate([
            'namaMaterial' => 'required|string',
            'merekMaterial' => 'required|string',

            'satuan' => 'required|in:pcs,box,liter,set,roll,unit',

            'harga' => 'required|integer',
            'stok' => 'required|integer',
        ]);

        $material->update($validated);

        return response()->json([
            'message' => 'Material berhasil diupdate',
            'data' => $material
        ]);
    }

    // DELETE /api/material/{id}
    public function destroy(string $id)
    {
        $material = Material::findOrFail($id);

        $material->delete();

        return response()->json([
            'message' => 'Material berhasil dihapus'
        ]);
    }
}
