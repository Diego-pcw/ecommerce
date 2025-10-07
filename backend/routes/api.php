<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ImagenProductoController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Aquí defines todas las rutas de tu API.
| Se agrupan bajo el middleware "api" definido en bootstrap/app.php.
| Usa Sanctum para autenticación con tokens.
|--------------------------------------------------------------------------
*/

Route::middleware('api')->group(function () {

    
    //🔹 Rutas públicas (sin autenticación)
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:5,1'); // límite de intentos de login

    // Categorías públicas    
    Route::get('/categorias', [CategoriaController::class, 'index']);
    Route::get('/categorias/{id}', [CategoriaController::class, 'show']);

    // 🔹 Productos publicos
    Route::get('/productos', [ProductoController::class, 'index']);
    Route::get('/productos/{id}', [ProductoController::class, 'show']);

    // 🔹 Imagen Productos publicos
    // 🔹 Mostrar imágenes de un producto específico
    Route::get('/imagenes/producto/{producto_id}', [ImagenProductoController::class, 'showByProducto']);

    /**
     * 🔹 Rutas protegidas (requieren autenticación con Sanctum)
     */
    Route::middleware('auth:sanctum')->group(function () {

        // Usuario autenticado
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/profile', [AuthController::class, 'profile']);

        
        // 🔸 Rutas solo para administradores
        Route::middleware('admin')->group(function () {
            // Categorías (CRUD)
            Route::post('/categorias', [CategoriaController::class, 'store']);
            Route::put('/categorias/{id}', [CategoriaController::class, 'update']);
            Route::delete('/categorias/{id}', [CategoriaController::class, 'destroy']);

            // Productos (CRUD)
            Route::post('/productos', [ProductoController::class, 'store']);
            Route::put('/productos/{id}', [ProductoController::class, 'update']);
            Route::delete('/productos/{id}', [ProductoController::class, 'destroy']);

            // Imagen Productos (CRUD)
            // 🔹 Listar todas las imágenes (solo para admins, útil si quieres una vista global)
            Route::get('/imagenes', [ImagenProductoController::class, 'index']);
            // 🔹 Subir una imagen
            Route::post('/imagenes', [ImagenProductoController::class, 'store']);
            // 🔹 Actualizar (por ejemplo: cambiar alt_text, principal, orden, etc.)
            Route::put('/imagenes/{id}', [ImagenProductoController::class, 'update']);
            // 🔹 Eliminar una imagen
            Route::delete('/imagenes/{id}', [ImagenProductoController::class, 'destroy']);
        });
    });
});
