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

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// Authentication routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

// Admin authentication routes
Route::post('/admin/login', [AuthController::class, 'adminLogin']);

// Admin product management routes
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::apiResource('products', \App\Http\Controllers\ProductController::class);
});

// Admin logout route
Route::middleware(['auth:sanctum', 'role:admin'])->post('/admin/logout', [AuthController::class, 'logout']);

// Public product routes (for frontend display)
Route::get('/products/public', [\App\Http\Controllers\ProductController::class, 'publicIndex']);
