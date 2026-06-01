<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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
    public function show()
    {
        $user = auth()->user();

        return response()->json([
            'data' => [
                'firstName' => explode(' ', $user->name)[0] ?? '',
                'lastName' => implode(' ', array_slice(explode(' ', $user->name), 1)) ?? '',
                'phoneNumber' => $user->noKontak ?? '',
                'emailAddress' => $user->email ?? '',
                'primaryAddress' => $user->alamat ?? '',
                'accountId' => $user->id ?? '',
                'avatarUrl' => $user->fotoProfile ?? null,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $user = auth()->user();

        try {
            $validated = $request->validate([
                'firstName' => 'required|string|max:100',
                'lastName' => 'nullable|string|max:100',
                'phoneNumber' => ['required', 'regex:/^08[0-9]{8,11}$/'],
                'emailAddress' => 'required|email|max:255|unique:users,email,' . $user->id,
                'primaryAddress' => 'required|string|max:500',
                'currentPassword' => 'nullable|string',
                'newPassword' => 'nullable|string|min:8|regex:/[A-Z]/|regex:/[a-z]/|regex:/[0-9]/|regex:/[@$!%*#?&.]/',
            ], [
                'phoneNumber.regex' => 'Nomor harus format Indonesia (08xxxxxxxxxx).',
                'newPassword.regex' => 'Password harus mengandung huruf besar, huruf kecil, angka, dan simbol.',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $e->errors(),
            ], 422);
        }

        // Update fullName
        $user->name = trim($request->firstName . ' ' . ($request->lastName ?? ''));

        // Update contact and address
        $user->noKontak = $request->phoneNumber;
        $user->email = $request->emailAddress;
        $user->alamat = $request->primaryAddress;

        // Handle password update
        if ($request->currentPassword && $request->newPassword) {
            if (!Hash::check($request->currentPassword, $user->password)) {
                return response()->json([
                    'message' => 'Password saat ini tidak sesuai',
                ], 422);
            }
            $user->password = Hash::make($request->newPassword);
        }

        // Mark profile as complete if required fields are filled
        if ($user->noKontak && $user->alamat) {
            $user->is_profile_complete = true;
        }

        $user->save();

        return response()->json([
            'message' => 'Profil berhasil diperbarui',
            'data' => [
                'firstName' => explode(' ', $user->name)[0] ?? '',
                'lastName' => implode(' ', array_slice(explode(' ', $user->name), 1)) ?? '',
                'phoneNumber' => $user->noKontak,
                'emailAddress' => $user->email,
                'primaryAddress' => $user->alamat,
                'accountId' => $user->id,
                'avatarUrl' => $user->fotoProfile,
            ],
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy()
    {
        $user = auth()->user();

        try {
            // Delete user's avatar if exists
            if ($user->fotoProfile) {
                Storage::disk('public')->delete($user->fotoProfile);
            }

            // Delete all tokens
            $user->tokens()->delete();

            // Delete the user
            $user->delete();

            return response()->json([
                'message' => 'Akun berhasil dihapus',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menghapus akun',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
