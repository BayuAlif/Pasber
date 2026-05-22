<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\KendaraanController;
use App\Http\Controllers\BengkelController;
use App\Http\Controllers\WorkOrderController;
use App\Http\Controllers\KelolaBookingController;
use App\Http\Controllers\KelolaWorkOrderController;



Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');




Route::middleware(['auth:sanctum', 'role:customer'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/update-profile', [AuthController::class, 'updateProfile']);
    Route::get('/dahsboard', [AuthController::class, 'dashboard']);

    Route::apiResource('kendaraan', KendaraanController::class);

    Route::apiResource('booking', BookingController::class);
    Route::get('/bengkel', [BengkelController::class, 'index']);

    Route::apiResource('work-order', WorkOrderController::class);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

Route::middleware(['auth:sanctum','role:admin'])->group(function () {
    Route::get('/admin/user', function (Request $request) {
            return response()->json($request->user());
        });

    Route::apiResource('kelola-booking', KelolaBookingController::class);
     Route::apiResource('kelola-work-order', KelolaBookingController::class);
});


