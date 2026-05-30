<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Mekanik;
use App\Models\Bengkel;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class MekanikController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        $mekanik = Mekanik::with('bengkel')
            ->where('bengkel_id', $user->bengkel_id)
            ->get();

        return response()->json([
            'data' => $mekanik
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $bengkel = Bengkel::findOrFail(
            $user->bengkel_id
        );

        $validated = $request->validate([
            'nama' => [
                'required',
                'string',
                'min:3',
                'max:100',
                'regex:/^[A-Za-z\s]+$/'
            ],

            'email' => [
                'required',
                'email',
                'max:255',
                'unique:mekanik,email'
            ],

            'telepon' => [
                'nullable',
                'regex:/^(\+62|62|08)[0-9]{8,13}$/'
            ],

            'spesialisasi' => [
                'nullable',
                'string',
                'max:100'
            ],

            'foto' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png',
                'max:2048'
            ]
        ]);

        // =========================
        // GENERATE KODE MEKANIK
        // =========================

        $jumlahMekanik = Mekanik::where(
            'bengkel_id',
            $user->bengkel_id
        )->count();

        $nomor = $jumlahMekanik + 1;

        $kodeBengkel = strtoupper(
            substr($bengkel->alamat, 0, 3)
        );

        $validated['kodeMekanik'] =
            'MEC-' .
            str_pad($nomor, 3, '0', STR_PAD_LEFT) .
            '-' .
            $kodeBengkel;

        $validated['bengkel_id'] =
            $user->bengkel_id;

        $validated['status'] =
            'available';

        // =========================
        // UPLOAD FOTO
        // =========================

        if ($request->hasFile('foto')) {

            $validated['foto'] = $request
                ->file('foto')
                ->store('mekanik', 'public');
        }

        $mekanik = Mekanik::create($validated);

        return response()->json([
            'message' => 'Mekanik berhasil ditambahkan',
            'data' => $mekanik
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = Auth::user();

        $mekanik = Mekanik::where(
            'bengkel_id',
            $user->bengkel_id
        )->findOrFail($id);

        return response()->json([
            'data' => $mekanik
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = Auth::user();

        $mekanik = Mekanik::where(
            'bengkel_id',
            $user->bengkel_id
        )->findOrFail($id);

        $validated = $request->validate([
            'nama' => [
                'required',
                'string',
                'min:3',
                'max:100',
                'regex:/^[A-Za-z\s]+$/'
            ],

            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('mekanik', 'email')
                    ->ignore($id)
            ],

            'telepon' => [
                'nullable',
                'regex:/^(\+62|62|08)[0-9]{8,13}$/'
            ],

            'spesialisasi' => [
                'nullable',
                'string',
                'max:100'
            ],

            'status' => [
                'required',
                Rule::in([
                    'available',
                    'unavailable'
                ])
            ],

            'foto' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png',
                'max:2048'
            ]
        ]);

        // =========================
        // UPDATE FOTO
        // =========================

        if ($request->hasFile('foto')) {

            if ($mekanik->foto) {

                Storage::disk('public')
                    ->delete($mekanik->foto);
            }

            $validated['foto'] = $request
                ->file('foto')
                ->store('mekanik', 'public');
        }

        $mekanik->update($validated);

        return response()->json([
            'message' => 'Mekanik berhasil diupdate',
            'data' => $mekanik
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = Auth::user();

        $mekanik = Mekanik::where(
            'bengkel_id',
            $user->bengkel_id
        )->findOrFail($id);

        if ($mekanik->foto) {

            Storage::disk('public')
                ->delete($mekanik->foto);
        }

        $mekanik->delete();

        return response()->json([
            'message' => 'Mekanik berhasil dihapus'
        ]);
    }
}
