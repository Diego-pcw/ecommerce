<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'message' => 'No autenticado. Por favor inicia sesión.'
            ], 401);
        }

        if ($user->rol !== 'admin') {
            return response()->json([
                'message' => 'Acceso denegado: se requiere rol de administrador.'
            ], 403);
        }

        return $next($request);
    }
}

