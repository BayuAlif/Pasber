<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\KendaraanController;
use App\Http\Controllers\BengkelController;
use App\Http\Controllers\WorkOrderController;
use App\Http\Controllers\KelolaBookingController;
use App\Http\Controllers\MekanikController;
use App\Http\Controllers\kelolaWorkOrderController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\NotaController;
use App\Http\Controllers\DetailNotaMaterialController;
use App\Http\Controllers\DetailNotaJasaController;
use App\Http\Controllers\PaymentController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

// User
Route::middleware(['auth:sanctum', 'role:customer'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/update-profile', [AuthController::class, 'updateProfile']);
    Route::get('/dahsboard', [AuthController::class, 'dashboard']);

    Route::get('/my-kendaraan', [KendaraanController::class, 'myVehicle']);
    Route::apiResource('kendaraan', KendaraanController::class);

    Route::apiResource('booking', BookingController::class);
    Route::get('/bengkel', [BengkelController::class, 'index']);
    Route::get('/full-dates', [BookingController::class, 'fullDates']);
    Route::get('/fetch-pantau', [BookingController::class, 'fetch_pantau']);

    Route::apiResource('work-order', WorkOrderController::class);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/active-work-order', [WorkOrderController::class, 'active']);


    Route::post(
        '/payment/create/{notaId}',
        [PaymentController::class, 'createPayment']
    );

    Route::post(
        '/payment/notification',
        [PaymentController::class, 'notificationHandler']
    );
    Route::get(
        '/nota/{id}',
        [NotaController::class, 'show']
    );
});

// Admin
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/admin/user', function (Request $request) {
        return response()->json($request->user());
    });

    Route::apiResource('kelola-booking', KelolaBookingController::class);
    Route::apiResource('kelola-work-order', kelolaWorkOrderController::class);
    Route::apiResource('mekanik', MekanikController::class);

    Route::apiResource('material', MaterialController::class);

    Route::apiResource('nota', NotaController::class);

    Route::get('/nota', [NotaController::class, 'index']);
    Route::apiResource(
        'detail-nota-material',
        DetailNotaMaterialController::class
    );

    Route::apiResource(
        'detail-nota-jasa',
        DetailNotaJasaController::class
    );

    Route::get(
        'nota/{id}/calculate-total',
        [NotaController::class, 'calculateTotal']
    );


    Route::apiResource(
        'payment',
        PaymentController::class
    );
    Route::get('/nota/{id}', [NotaController::class, 'show']);
});

Route::get(
    '/work-order-selesai',
    [kelolaWorkOrderController::class, 'woSelesai']
);


//punya midtrans
Route::post(
    '/payment/notification',
    [PaymentController::class, 'notificationHandler']
);
