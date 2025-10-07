<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',   // 👈 aquí agregas el api.php
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
        'admin' => \App\Http\Middleware\AdminMiddleware::class,
        ]);

        $middleware->group('api', [
        'throttle:api',
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ]);
        // si tenías middleware globales, regístralos aquí también
        // $middleware->prepend(\App\Http\Middleware\SomeGlobalMiddleware::class);
        // $middleware->push(\App\Http\Middleware\AnotherGlobal::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
