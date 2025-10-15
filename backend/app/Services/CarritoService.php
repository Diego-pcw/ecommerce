<?php

namespace App\Services;

use App\Models\{Carrito, CarritoDetalle, Producto};
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CarritoService
{
    // 🔹 Obtener o crear carrito (usuario o invitado)
    public function getOrCreateCart($user, ?string $sessionId): Carrito
    {
        if ($user) {
            $carrito = Carrito::where('user_id', $user->id)
                ->where('estado', 'activo')
                ->first();

            if ($carrito) return $carrito;

            $guestCart = Carrito::where('session_id', $sessionId)
                ->where('estado', 'activo')
                ->first();

            if ($guestCart) {
                $guestCart->update(['user_id' => $user->id, 'session_id' => null]);
                return $guestCart;
            }

            return Carrito::create([
                'user_id' => $user->id,
                'estado' => 'activo',
                'expires_at' => now()->addDays(7)
            ]);
        }

        if (!$sessionId) {
            $sessionId = Str::uuid()->toString();
        }

        return Carrito::firstOrCreate(
            ['session_id' => $sessionId, 'estado' => 'activo'],
            ['expires_at' => now()->addDays(7)]
        );
    }

    // 🔹 Agregar o actualizar producto
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

            $cart->update(['expires_at' => now()->addDays(7)]);
            return $cart->fresh()->load('detalles.producto');
        });
    }

    // 🔹 Cambiar cantidad
    public function setQuantity(Carrito $cart, int $productoId, int $cantidad)
    {
        $detalle = CarritoDetalle::where('carrito_id', $cart->id)
            ->where('producto_id', $productoId)
            ->firstOrFail();

        if ($cantidad <= 0) {
            $detalle->delete();
            return null;
        }

        $detalle->update(['cantidad' => $cantidad]);
        $cart->touch();

        return $detalle->refresh();
    }

    // 🔹 Eliminar producto
    public function removeItem(Carrito $cart, int $productoId)
    {
        return CarritoDetalle::where('carrito_id', $cart->id)
            ->where('producto_id', $productoId)
            ->delete();
    }

    // 🔹 Vaciar carrito
    public function clearCart(Carrito $cart)
    {
        $cart->detalles()->delete();
        $cart->touch();
    }
}
