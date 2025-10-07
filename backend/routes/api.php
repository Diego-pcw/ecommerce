<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ImagenProductoController;
use App\Http\Controllers\PromocionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Rutas agrupadas bajo el middleware "api" (definido en bootstrap/app.php)
| Se usa Sanctum para autenticación con tokens.
|--------------------------------------------------------------------------
*/

Route::middleware('api')->group(function () {
    
    /** 🔹 Rutas públicas (sin autenticación) */
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

    // 🔸 Categorías públicas
    Route::get('/categorias', [CategoriaController::class, 'index']);
    Route::get('/categorias/{id}', [CategoriaController::class, 'show']);

    // 🔸 Productos públicos
    Route::get('/productos', [ProductoController::class, 'index']);
    Route::get('/productos/{id}', [ProductoController::class, 'show']);

    // 🔸 Imágenes públicas (por producto)
    Route::get('/imagenes/producto/{producto_id}', [ImagenProductoController::class, 'showByProducto']);

    // 🔸 Promociones públicas
    Route::get('/promociones', [PromocionController::class, 'index']);
    Route::get('/promociones/{id}', [PromocionController::class, 'show']);

    /** 🔹 Rutas protegidas (requieren autenticación con Sanctum) */
    Route::middleware('auth:sanctum')->group(function () {

        // 🔸 Usuario autenticado
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/profile', [AuthController::class, 'profile']);

        /** 🔸 Rutas exclusivas para administradores */
        Route::middleware('admin')->group(function () {

            /** 📦 Categorías (CRUD) */
            Route::post('/categorias', [CategoriaController::class, 'store']);
            Route::put('/categorias/{id}', [CategoriaController::class, 'update']);
            Route::delete('/categorias/{id}', [CategoriaController::class, 'destroy']);

            /** 🛒 Productos (CRUD) */
            Route::post('/productos', [ProductoController::class, 'store']);
            Route::put('/productos/{id}', [ProductoController::class, 'update']);
            Route::delete('/productos/{id}', [ProductoController::class, 'destroy']);

            /** 🖼️ Imágenes (CRUD) */
            Route::get('/imagenes', [ImagenProductoController::class, 'index']);
            Route::post('/imagenes', [ImagenProductoController::class, 'store']);
            Route::put('/imagenes/{id}', [ImagenProductoController::class, 'update']);
            Route::delete('/imagenes/{id}', [ImagenProductoController::class, 'destroy']);

            /** 🎯 Promociones (CRUD + asignar productos) */
            Route::post('/promociones', [PromocionController::class, 'store']);
            Route::put('/promociones/{id}', [PromocionController::class, 'update']);
            Route::delete('/promociones/{id}', [PromocionController::class, 'destroy']);
            Route::post('/promociones/{id}/asignar', [PromocionController::class, 'asignarProductos']);
            Route::get('/ofertas', [ProductoController::class, 'productosConOfertas']);

        });
    });
});
