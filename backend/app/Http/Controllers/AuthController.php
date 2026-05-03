<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
}
