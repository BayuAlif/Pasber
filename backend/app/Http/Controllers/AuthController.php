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

    public function login(Request $request){
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'debug' => 'EMAIL TIDAK DITEMUKAN'
            ], 401);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'debug' => 'PASSWORD SALAH',
                'input' => $request->password,
                'hash_db' => $user->password
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
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

        $request->validate([
            'name' => 'required|string|max:255',
            'noKontak' => 'required|string|max:20',
            'alamat' => 'required|string',
            'fotoProfil' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('fotoProfil')) {

            if ($user->fotoProfil) {
                Storage::disk('public')->delete($user->fotoProfil);
            }

            $file = $request->file('fotoProfil');

            $path = $file->store('profile', 'public');

            $user->fotoProfil = $path;
            $user->foto_url = Storage::url($path);
        }

        $user->name = $request->name;
        $user->noKontak = $request->noKontak;
        $user->alamat = $request->alamat;

        $user->save();

        return response()->json([
            'message' => 'Profile updated',
            'user' => $user
        ]);
    }
}
