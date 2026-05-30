<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Kendaraan;

class KendaraanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $kendaraan = Kendaraan::where(
            'user_id',
            Auth::id()
        )->get();

        return response()->json([
            'message' => 'Data kendaraan berhasil diambil',
            'data' => $kendaraan
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nomorPolisi'     => 'required',
            'merek'           => 'required',
            'model'            => 'required',
            'tahun'           => 'required',
            'jenisKendaraan'  => 'required|in:motor,mobil',
        ]);

        $kendaraan = Kendaraan::create([

            'user_id' => Auth::id(),

            'nomorPolisi' => $request->nomorPolisi,

            'merek' => $request->merek,

            'model' => $request->model,

            'tahun' => $request->tahun,

            'jenisKendaraan' => $request->jenisKendaraan,
        ]);

        return response()->json([
            'message' => 'Kendaraan berhasil ditambahkan',
            'data' => $kendaraan
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $kendaraan = Kendaraan::findOrFail($id);

        // keamanan
        if ($kendaraan->user_id !== Auth::id()) {

            return response()->json([
                'message' => 'Akses ditolak'
            ], 403);
        }

        $kendaraan->delete();

        return response()->json([
            'message' => 'Kendaraan berhasil dihapus'
        ]);
    }

    public function myVehicle(Request $request) {
        $user = $request->user();

        $kendaraan = Kendaraan::where('user_id', $user->id)
            ->latest()
            ->get();

        return response()->json($kendaraan); }
}
