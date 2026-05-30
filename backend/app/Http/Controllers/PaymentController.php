<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use Midtrans\Config;
use Midtrans\Snap;
use App\Models\Nota;
use Midtrans\Notification;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $payment = Payment::create([
            'nota_id' => $request->nota_id,
            'transaction_id' => 'TEST-' . time(),
            'payment_type' => 'qris',
            'amount' => 280000
        ]);

        return response()->json([
            'message' => 'Payment berhasil dibuat',
            'data' => $payment
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function createPayment(int $notaId)
    {
        Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = false;
        Config::$isSanitized = true;
        Config::$is3ds = true;

        $nota = Nota::findOrFail($notaId);

        $orderId = 'NOTA-' . $nota->id . '-' . time();

        $params = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => (int) $nota->totalHarga,
            ],
        ];

        $snapToken = Snap::getSnapToken($params);

        Payment::updateOrCreate(
            [
                'nota_id' => $nota->id
            ],
            [
                'transaction_id' => $orderId,
                'payment_type' => 'qris',
                'amount' => $nota->totalHarga,
                'status' => 'pending'
            ]
        );

        return response()->json([
            'snap_token' => $snapToken
        ]);
    }

    public function notificationHandler(Request $request)

    {
        Log::info('MIDTRANS CALLBACK MASUK');
        Log::info($request->all());
        $payload = $request->all();


        $transactionStatus = $payload['transaction_status'] ?? null;
        $orderId = $payload['order_id'] ?? null;

        if (!$orderId) {
            return response()->json([
                'message' => 'Order ID tidak ditemukan'
            ], 400);
        }

        $parts = explode('-', $orderId);

        $notaId = $parts[1] ?? null;

        $nota = Nota::find($notaId);

        if (!$nota) {
            return response()->json([
                'message' => 'Nota tidak ditemukan'
            ], 404);
        }

        if (
            $transactionStatus === 'settlement' ||
            $transactionStatus === 'capture'
        ) {

            $nota->update([
                'status' => 'lunas'
            ]);

            Payment::where(
                'nota_id',
                $notaId
            )->update([
                'status' => 'paid'
            ]);

            $nota->workOrder()->update([
                'statusWO' => 'paid'
            ]);
        }

        return response()->json([
            'message' => 'Notification processed'
        ]);
    }
}
