<?php

namespace App\Http\Controllers;
use \App\Models\Bengkel;

use Illuminate\Http\Request;

class BengkelController extends Controller
{
     public function index()
    {
        $bengkel = Bengkel::all();

        return response()->json([
            'message' => 'Data bengkel berhasil diambil',
            'data' => $bengkel
        ]);
    }
}
