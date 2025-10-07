<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Rate limiter para "api" (usado por throttle:api)
        RateLimiter::for('api', function (Request $request) {
            // 60 requests por minuto por usuario (o por IP si no hay usuario)
            return Limit::perMinute(60)->by(optional($request->user())->id ?: $request->ip());
        });

        // Rate limiter específico para login (opcional)
        RateLimiter::for('login', function (Request $request) {
            // 5 intentos por minuto por IP
            return Limit::perMinute(5)->by($request->ip());
        });
    }
}

