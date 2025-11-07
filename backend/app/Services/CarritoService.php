<?php

namespace App\Services;

use App\Models\{Carrito, CarritoDetalle, Producto};
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CarritoService
{
    /** 🔹 Obtener o crear carrito (usuario autenticado o invitado) */
    public function getOrCreateCart($user, ?string $sessionId): Carrito
    {
        if ($user) {
            // ✅ Buscar carrito del usuario (activo o pendiente)
            $carrito = Carrito::where('user_id', $user->id)
                ->whereIn('estado', ['activo', 'pendiente'])
                ->latest('updated_at')
                ->first();

            // 🔁 Fusionar carrito de invitado si existe
            if ($sessionId) {
                $guestCart = Carrito::where('session_id', $sessionId)
                    ->whereNull('user_id')
                    ->where('estado', 'activo')
                    ->first();

                if ($guestCart) {
                    if ($carrito) {
                        $this->mergeGuestCart($carrito, $guestCart);
                        $guestCart->delete();
                        return $carrito->fresh();
                    } else {
                        $guestCart->update([
                            'user_id' => $user->id,
                            'session_id' => null,
                        ]);
                        return $guestCart;
                    }
                }
            }

            // ✅ Si ya existía el carrito, renovar expiración
            if ($carrito) {
                $carrito->update(['expires_at' => now()->addDays(7)]);
                return $carrito;
            }

            // ✅ Crear nuevo carrito si no existe
            return Carrito::create([
                'user_id' => $user->id,
                'estado' => 'activo',
                'expires_at' => now()->addDays(7),
            ]);
        }

        // 🧑‍💻 Usuario invitado
        if (!$sessionId) {
            $sessionId = Str::uuid()->toString();
        }

        // ✅ Crear o devolver carrito invitado
        return Carrito::firstOrCreate(
            ['session_id' => $sessionId, 'estado' => 'activo'],
            ['expires_at' => now()->addDays(7)]
        );
    }

    /** 🔹 Fusionar carrito invitado con el del usuario autenticado */
    protected function mergeGuestCart(Carrito $userCart, Carrito $guestCart)
    {
        foreach ($guestCart->detalles as $detalle) {
            $existing = $userCart->detalles()
                ->where('producto_id', $detalle->producto_id)
                ->first();

            if ($existing) {
                $existing->update([
                    'cantidad' => $existing->cantidad + $detalle->cantidad,
                ]);
            } else {
                $detalle->replicate()
                    ->fill(['carrito_id' => $userCart->id])
                    ->save();
            }
        }

        $guestCart->delete();
    }

    /** 🔹 Agregar o actualizar producto */
    public function addOrUpdateItem(Carrito $cart, int $productoId, int $cantidad = 1)
    {
        return DB::transaction(function () use ($cart, $productoId, $cantidad) {
            $producto = Producto::findOrFail($productoId);
            $precio = $producto->precio_con_descuento ?? $producto->precio;

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
                    'precio_unitario' => $precio,
                ]);
            }

            $cart->update(['expires_at' => now()->addDays(7)]);
            return $cart->fresh()->load('detalles.producto');
        });
    }

    /** 🔹 Cambiar cantidad */
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

    /** 🔹 Eliminar producto */
    public function removeItem(Carrito $cart, int $productoId)
    {
        return CarritoDetalle::where('carrito_id', $cart->id)
            ->where('producto_id', $productoId)
            ->delete();
    }

    /** 🔹 Vaciar carrito */
    public function clearCart(Carrito $cart)
    {
        $cart->detalles()->delete();
        $cart->touch();
    }
}
