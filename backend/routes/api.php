<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ImagenProductoController;
use App\Http\Controllers\PromocionController;
use App\Http\Controllers\CarritoController;
use App\Http\Controllers\ReseñaController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\DetallePedidoController;

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

    // 🔸 Carrito (API pública, usa session_id en header)
    Route::get('/carrito', [CarritoController::class, 'obtenerCarrito']);
    Route::post('/carrito/agregar', [CarritoController::class, 'agregarProducto']);
    Route::put('/carrito/{id}/actualizar', [CarritoController::class, 'actualizarCantidad']);
    Route::delete('/carrito/{id}/eliminar/{producto_id}', [CarritoController::class, 'eliminarProducto']);
    Route::delete('/carrito/{id}/vaciar', [CarritoController::class, 'vaciarCarrito']);
    Route::get('/carrito/{id}', [CarritoController::class, 'mostrar']);

    /** 🔸 📦 Reseñas públicas (ver reseñas de productos) */
    Route::get('/resenas', [ReseñaController::class, 'index']);
    Route::get('/resenas/{id}', [ReseñaController::class, 'show']);

    /** 🔹 Rutas protegidas (requieren autenticación con Sanctum) */
    Route::middleware('auth:sanctum')->group(function () {

        // 🔸 Usuario autenticado
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/profile', [AuthController::class, 'profile']);
        Route::put('/profile/actualizar', [AuthController::class, 'actualizarPerfil']);

        /** 🔸 💬 Mensajes de contacto (Autenticados puede enviar) */
        Route::get('/contact-messages', [ContactMessageController::class, 'index']);
        Route::get('/contact-messages/{id}', [ContactMessageController::class, 'show']);
        Route::post('/contact-messages', [ContactMessageController::class, 'store']);

        /** 🔸 📦 Reseñas (usuarios autenticados pueden crear) */
        Route::post('/resenas', [ReseñaController::class, 'store']);

        /** 📦 Pedidos (Autenticados pueden crear y ver los suyos) */
        Route::get('/pedidos', [PedidoController::class, 'index']);
        Route::post('/pedidos', [PedidoController::class, 'store']);
        Route::get('/pedidos/{id}', [PedidoController::class, 'show']);

        /** 🧾 Detalles de pedidos (Autenticados pueden consultar sus pedidos) */
        Route::get('/pedidos/{pedido}/detalles', [DetallePedidoController::class, 'index']);

        /** 🔸 Rutas exclusivas para administradores */
        Route::middleware('admin')->group(function () {

            /** 🧍‍♂️ Usuarios (solo admin) */
            Route::get('/usuarios', [AuthController::class, 'index']);
            Route::put('/usuarios/{id}/estado', [AuthController::class, 'cambiarEstado']); 

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

            /** 🛒 Carritos (solo debug o administración) */
            Route::get('/carritos', [CarritoController::class, 'index']);

            /** 📦 Reseñas (admin puede gestionar todas) */
            Route::put('/resenas/{id}', [ReseñaController::class, 'update']); // aprobar/rechazar
            Route::delete('/resenas/{id}', [ReseñaController::class, 'destroy']);

            /** 💬 Mensajes de contacto (admin puede ver y responder) */
            Route::put('/contact-messages/{id}', [ContactMessageController::class, 'update']); // Responder / cambiar estado
            Route::delete('/contact-messages/{id}', [ContactMessageController::class, 'destroy']);

            /** 📦 Pedidos (admin puede gestionar todos) */
            Route::put('/pedidos/{id}', [PedidoController::class, 'update']);
            Route::delete('/pedidos/{id}', [PedidoController::class, 'destroy']);

            /** 🧾 Detalles de pedidos (admin puede administrar ítems) */
            Route::post('/pedidos/{pedido}/detalles', [DetallePedidoController::class, 'store']);
            Route::put('/pedidos/detalles/{id}', [DetallePedidoController::class, 'update']);
            Route::delete('/pedidos/detalles/{id}', [DetallePedidoController::class, 'destroy']);
        });
    });
});
