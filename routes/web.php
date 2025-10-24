<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/produk', function () {
    return view('welcome');
});

Route::get('/percetakan', function () {
    return view('welcome');
});

Route::get('/login', function () {
    return view('welcome');
});

Route::get('/register', function () {
    return view('welcome');
});

Route::get('/profil', function () {
    return view('welcome');
});

Route::get('/admin', function () {
    return view('welcome');
});

Route::get('/admin/{any}', function () {
    return view('welcome');
})->where('any', '.*');

// Fallback route for SPA
Route::fallback(function () {
    return view('welcome');
});
