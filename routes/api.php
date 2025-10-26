<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware(['App\Http\Middleware\MultiAuthSanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// Authentication routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::middleware(['App\Http\Middleware\MultiAuthSanctum'])->post('/logout', [AuthController::class, 'logout']);

Route::post('/admin/login', [AuthController::class, 'adminLogin']);

// Admin logout route
Route::middleware(['App\Http\Middleware\MultiAuthSanctum', 'role:admin'])->post('/admin/logout', [AuthController::class, 'logout']);

// Product routes
Route::middleware(['App\Http\Middleware\MultiAuthSanctum', 'role:admin'])->group(function () {
    Route::apiResource('v1/products', \App\Http\Controllers\ProductController::class);
});

// Public product routes (for frontend display)
Route::get('/v1/products/public', [\App\Http\Controllers\ProductController::class, 'publicIndex']);

// Order routes
Route::middleware(['App\Http\Middleware\MultiAuthSanctum'])->group(function () {
    // User order routes
    Route::apiResource('v1/orders', \App\Http\Controllers\OrderController::class)->except(['destroy']);
    Route::patch('v1/orders/{id}/cancel', [\App\Http\Controllers\OrderController::class, 'update']);

    // Admin order routes
    Route::middleware(['role:admin'])->group(function () {
        Route::get('v1/admin/orders', [\App\Http\Controllers\OrderController::class, 'adminIndex']);
        Route::patch('v1/admin/orders/{id}/status', [\App\Http\Controllers\OrderController::class, 'adminUpdateStatus']);
        Route::delete('v1/orders/{id}', [\App\Http\Controllers\OrderController::class, 'destroy']);
    });
});

// Print Order routes
Route::middleware(['App\Http\Middleware\MultiAuthSanctum'])->group(function () {
    // User print order routes
    Route::apiResource('v1/print-orders', \App\Http\Controllers\PrintOrderController::class)->except(['destroy']);
    Route::patch('v1/print-orders/{id}/payment', [\App\Http\Controllers\PrintOrderController::class, 'updatePayment']);

    // Admin print order routes
    Route::middleware(['role:admin'])->group(function () {
        Route::get('v1/admin/print-orders', [\App\Http\Controllers\PrintOrderController::class, 'index']);
        Route::patch('v1/admin/print-orders/{id}/status', [\App\Http\Controllers\PrintOrderController::class, 'update']);
        Route::delete('v1/print-orders/{id}', [\App\Http\Controllers\PrintOrderController::class, 'destroy']);
    });
});
