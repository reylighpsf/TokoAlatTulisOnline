<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class MultiAuthSanctum
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Coba autentikasi dengan guard 'sanctum' (user biasa)
        if (Auth::guard('sanctum')->check()) {
            Auth::shouldUse('sanctum');
            return $next($request);
        }

        // Jika gagal, coba dengan guard 'admin'
        if (Auth::guard('admin')->check()) {
            Auth::shouldUse('admin');
            return $next($request);
        }

        // Jika keduanya gagal, return unauthorized
        return response()->json(['message' => 'Unauthenticated'], 401);
    }
}
