<?php

namespace App\Services;

use App\Models\{Carrito, CarritoDetalle, Producto};
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CarritoService
{
    // Obtener o crear carrito según usuario o session_id
    public function getOrCreateCart($user, ?string $sessionId): Carrito
    {
        if ($user) {
            // Buscar carrito activo por usuario
            $carrito = Carrito::where('user_id', $user->id)
                ->where('estado', 'activo')
                ->first();

            if ($carrito) return $carrito;

            // Fusionar carrito de invitado si existe
            $guestCart = Carrito::where('session_id', $sessionId)
                ->where('estado', 'activo')
                ->first();

            if ($guestCart) {
                $guestCart->user_id = $user->id;
                $guestCart->session_id = null;
                $guestCart->save();
                return $guestCart;
            }

            // Crear nuevo carrito
            return Carrito::create([
                'user_id' => $user->id,
                'estado' => 'activo',
                'expires_at' => now()->addDays(7)
            ]);
        }

        // Invitado (session_id)
        if (!$sessionId) {
            $sessionId = Str::uuid()->toString();
        }

        return Carrito::firstOrCreate(
            ['session_id' => $sessionId, 'estado' => 'activo'],
            ['expires_at' => now()->addDays(7)]
        );
    }

    // Agregar o actualizar un producto en el carrito
    public function addOrUpdateItem(Carrito $cart, int $productoId, int $cantidad = 1)
    {
        return DB::transaction(function () use ($cart, $productoId, $cantidad) {
            $producto = Producto::findOrFail($productoId);
            $precio = $producto->precio;

            $detalle = CarritoDetalle::where('carrito_id', $cart->id)
                ->where('producto_id', $productoId)
                ->lockForUpdate()
                ->first();

            if ($detalle) {
                $detalle->cantidad += $cantidad;
                $detalle->save();
            } else {
                CarritoDetalle::create([
                    'carrito_id' => $cart->id,
                    'producto_id' => $productoId,
                    'cantidad' => $cantidad,
                    'precio_unitario' => $precio
                ]);
            }

            $cart->expires_at = now()->addDays(7);
            $cart->save();

            return $cart->load('detalles.producto');
        });
    }

    public function setQuantity(Carrito $cart, int $productoId, int $cantidad)
    {
        $detalle = CarritoDetalle::where('carrito_id', $cart->id)
            ->where('producto_id', $productoId)
            ->firstOrFail();

        if ($cantidad <= 0) {
            return $detalle->delete();
        }

        $detalle->update(['cantidad' => $cantidad]);
        $cart->touch();

        return $detalle;
    }

    public function removeItem(Carrito $cart, int $productoId)
    {
        return CarritoDetalle::where('carrito_id', $cart->id)
            ->where('producto_id', $productoId)
            ->delete();
    }

    public function clearCart(Carrito $cart)
    {
        $cart->detalles()->delete();
        $cart->touch();
    }
}
