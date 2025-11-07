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
| Rutas agrupadas bajo el middleware "api"
| Se usa Sanctum para autenticación con tokens.
|--------------------------------------------------------------------------
*/

Route::middleware('api')->group(function () {
    
    /** 🔹 RUTAS PÚBLICAS (sin autenticación) */
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

    // 🗂️ Categorías públicas
    Route::get('/categorias', [CategoriaController::class, 'index']);
    Route::get('/categorias/{id}', [CategoriaController::class, 'show']);

    // 🛍️ Productos públicos
    Route::get('/productos', [ProductoController::class, 'index']);
    Route::get('/productos/{id}', [ProductoController::class, 'show']);

    // 🖼️ Imágenes públicas (por producto)
    Route::get('/imagenes/producto/{producto_id}', [ImagenProductoController::class, 'showByProducto']);

    // 🎯 Promociones públicas
    Route::get('/promociones', [PromocionController::class, 'index']);
    Route::get('/promociones/{id}', [PromocionController::class, 'show']);

    // 💬 Reseñas públicas
    Route::get('/resenas', [ReseñaController::class, 'index']);
    Route::get('/resenas/{id}', [ReseñaController::class, 'show']);


    /* -----------------------------------------------------------------
    | 🛒 CARRITO DE INVITADO (sin autenticación - usa header X-Session-Id)
    ------------------------------------------------------------------ */
    Route::prefix('carrito')->group(function () {
        Route::get('/', [CarritoController::class, 'obtenerCarrito']); // Obtener carrito actual
        Route::post('/agregar', [CarritoController::class, 'agregarProducto']); // Agregar producto
        Route::put('/{id}/actualizar', [CarritoController::class, 'actualizarCantidad']); // Cambiar cantidad
        Route::delete('/{id}/eliminar/{producto_id}', [CarritoController::class, 'eliminarProducto']); // Eliminar producto
        Route::delete('/{id}/vaciar', [CarritoController::class, 'vaciarCarrito']); // Vaciar carrito
        Route::get('/{id}', [CarritoController::class, 'mostrar']); // Mostrar carrito completo
    });

    /** 🔹 RUTAS PROTEGIDAS (usuarios autenticados con Sanctum) */
    Route::middleware('auth:sanctum')->group(function () {

        // 👤 Usuario autenticado
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/profile', [AuthController::class, 'profile']);
        Route::put('/profile/actualizar', [AuthController::class, 'actualizarPerfil']);

        // 💬 Contactos
        Route::get('/contact-messages', [ContactMessageController::class, 'index']);
        Route::get('/contact-messages/{id}', [ContactMessageController::class, 'show']);
        Route::post('/contact-messages', [ContactMessageController::class, 'store']);

        // ⭐ Reseñas autenticadas
        Route::post('/resenas', [ReseñaController::class, 'store']);

        // 📦 Pedidos (solo propios)
        Route::get('/pedidos', [PedidoController::class, 'index']);
        Route::post('/pedidos', [PedidoController::class, 'store']);
        Route::get('/pedidos/{id}', [PedidoController::class, 'show']);
        Route::get('/pedidos/{pedido}/detalles', [DetallePedidoController::class, 'index']);

        /* -----------------------------------------------------------------
        | 🛒 CARRITO AUTENTICADO (usuario con token Bearer)
        | Usa el mismo controlador, pero permite fusión y persistencia en DB
        ------------------------------------------------------------------ */
        Route::prefix('user/carrito')->group(function () {
            Route::get('/', [CarritoController::class, 'obtenerCarrito']); // Obtener carrito del usuario
            Route::post('/agregar', [CarritoController::class, 'agregarProducto']); // Agregar producto
            Route::put('/{id}/actualizar', [CarritoController::class, 'actualizarCantidad']); // Cambiar cantidad
            Route::delete('/{id}/eliminar/{producto_id}', [CarritoController::class, 'eliminarProducto']); // Eliminar producto
            Route::delete('/{id}/vaciar', [CarritoController::class, 'vaciarCarrito']); // Vaciar carrito
            Route::get('/{id}', [CarritoController::class, 'mostrar']); // Mostrar carrito completo
        });

        Route::middleware('auth:sanctum')->post('/carrito/fusionar', [CarritoController::class, 'fusionarCarrito']);


        /** 🔸 RUTAS ADMINISTRATIVAS (solo admin) */
        Route::middleware('admin')->group(function () {

            // 🧍 Usuarios
            Route::get('/usuarios', [AuthController::class, 'index']);
            Route::put('/usuarios/{id}/estado', [AuthController::class, 'cambiarEstado']); 

            // 🗂️ Categorías CRUD
            Route::post('/categorias', [CategoriaController::class, 'store']);
            Route::put('/categorias/{id}', [CategoriaController::class, 'update']);
            Route::delete('/categorias/{id}', [CategoriaController::class, 'destroy']);

            // 🛒 Productos CRUD
            Route::post('/productos', [ProductoController::class, 'store']);
            Route::put('/productos/{id}', [ProductoController::class, 'update']);
            Route::delete('/productos/{id}', [ProductoController::class, 'destroy']);

            // 🖼️ Imágenes
            Route::get('/imagenes', [ImagenProductoController::class, 'index']);
            Route::post('/imagenes', [ImagenProductoController::class, 'store']);
            Route::put('/imagenes/{id}', [ImagenProductoController::class, 'update']);
            Route::delete('/imagenes/{id}', [ImagenProductoController::class, 'destroy']);

            // 🎯 Promociones
            Route::post('/promociones', [PromocionController::class, 'store']);
            Route::put('/promociones/{id}', [PromocionController::class, 'update']);
            Route::delete('/promociones/{id}', [PromocionController::class, 'destroy']);
            Route::post('/promociones/{id}/asignar', [PromocionController::class, 'asignarProductos']);
            Route::get('/ofertas', [ProductoController::class, 'productosConOfertas']);

            // 🛒 Carritos (solo admin/debug)
            Route::get('/carritos', [CarritoController::class, 'index']);

            // 📦 Reseñas (gestión total)
            Route::put('/resenas/{id}', [ReseñaController::class, 'update']); 
            Route::delete('/resenas/{id}', [ReseñaController::class, 'destroy']);

            // 💬 Mensajes (admin responde/elimina)
            Route::put('/contact-messages/{id}', [ContactMessageController::class, 'update']); 
            Route::delete('/contact-messages/{id}', [ContactMessageController::class, 'destroy']);

            // 📦 Pedidos (admin gestiona todos)
            Route::put('/pedidos/{id}', [PedidoController::class, 'update']);
            Route::delete('/pedidos/{id}', [PedidoController::class, 'destroy']);

            // 🧾 Detalles de pedidos (admin puede modificar ítems)
            Route::post('/pedidos/{pedido}/detalles', [DetallePedidoController::class, 'store']);
            Route::put('/pedidos/detalles/{id}', [DetallePedidoController::class, 'update']);
            Route::delete('/pedidos/detalles/{id}', [DetallePedidoController::class, 'destroy']);
        });
    });
});
