<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
public function register(Request $request)
{
    $request->validate([
        'name' => 'required',
        'email' => 'required|email|unique:users',
        'password' => 'required|min:6',
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'role' => 'customer',
        'status' => 'active'
    ]);

    return response()->json([
        'message' => 'Register berhasil',
        'user' => $user
    ]);
}

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        // cek email
        if (!$user) {
            return response()->json([
                'message' => 'Email tidak ditemukan'
            ], 401);
        }

        // cek password
        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Password salah'
            ], 401);
        }

        // buat token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'token' => $token,
            'role' => $user->role,
            'user' => $user
        ]);
    }

    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil'
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'noKontak' => 'required|string|max:20',
                'alamat' => 'required|string',
                'fotoProfile' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        }

        if ($request->hasFile('fotoProfile')) {

            if ($user->fotoProfile) {
                Storage::disk('public')->delete($user->fotoProfile);
            }

            $file = $request->file('fotoProfile');
            $path = $file->store('profile', 'public');
            $user->fotoProfile = $path;
        }

        $user->name = $request->name;
        $user->noKontak = $request->noKontak;
        $user->alamat = $request->alamat;

        if ($request->noKontak && $request->alamat) {
            $user->is_profile_complete = true;
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated',
            'user' => $user
        ]);
    }
}
