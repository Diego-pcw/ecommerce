<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\DetallePedido;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PedidoController extends Controller
{
    // 📋 Listar pedidos (admin ve todos / usuario solo los suyos)
    public function index(Request $request)
    {
        $user = $request->user();

        $pedidos = Pedido::with(['detalles.producto', 'user'])
            ->when($user->rol !== 'admin', fn($q) => $q->where('user_id', $user->id))
            ->orderByDesc('created_at')
            ->paginate(10);

        return response()->json([
            'total' => $pedidos->total(),
            'data' => $pedidos
        ]);
    }

    // 🧾 Crear un nuevo pedido (usuario autenticado)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'shipping_address' => 'required|array',
            'payment_method' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.producto_id' => 'required|exists:productos,id',
            'items.*.cantidad' => 'required|integer|min:1',
            'items.*.precio_unitario' => 'nullable|numeric|min:0',
        ]);

        $user = $request->user();

        return DB::transaction(function () use ($validated, $user) {
            $total = 0;
            $detalles = [];

            foreach ($validated['items'] as $item) {
                $producto = Producto::findOrFail($item['producto_id']);
                $precio_base = $producto->precio;

                // Si hay descuento vigente, úsalo
                $precio_final = $producto->precio_con_descuento ?? $precio_base;

                // Si el asesor define un precio manual, se respeta
                if (isset($item['precio_unitario'])) {
                    $precio_final = $item['precio_unitario'];
                }

                $subtotal = $precio_final * $item['cantidad'];
                $total += $subtotal;

                $detalles[] = [
                    'producto_id' => $producto->id,
                    'cantidad' => $item['cantidad'],
                    'precio_unitario' => $precio_final,
                ];
            }

            $pedido = Pedido::create([
                'user_id' => $user->id,
                'total' => $total,
                'shipping_address' => $validated['shipping_address'],
                'payment_method' => $validated['payment_method'],
                'estado' => 'pendiente',
            ]);

            foreach ($detalles as $detalle) {
                DetallePedido::create([
                    'pedido_id' => $pedido->id,
                    'producto_id' => $detalle['producto_id'],
                    'cantidad' => $detalle['cantidad'],
                    'precio_unitario' => $detalle['precio_unitario'],
                ]);
            }

            return response()->json([
                'message' => 'Pedido creado correctamente.',
                'data' => $pedido->load('detalles.producto')
            ], 201);
        });
    }

    // 🔍 Mostrar pedido individual (solo admin o dueño)
    public function show(Request $request, $id)
    {
        $pedido = Pedido::with(['detalles.producto', 'user'])->findOrFail($id);
        $user = $request->user();

        if ($user->rol !== 'admin' && $pedido->user_id !== $user->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        return response()->json($pedido);
    }

    // ✏️ Actualizar estado del pedido (solo admin)
    public function update(Request $request, $id)
    {
        $user = $request->user();
        if ($user->rol !== 'admin') {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'estado' => 'required|in:pendiente,pagado,enviado,cancelado,entregado'
        ]);

        $pedido = Pedido::findOrFail($id);
        $pedido->update($validated);

        if ($validated['estado'] === 'pagado') {
            $pedido->update(['paid_at' => now()]);
        }

        return response()->json([
            'message' => 'Pedido actualizado correctamente.',
            'data' => $pedido
        ]);
    }

    // 🗑️ Eliminar pedido (solo admin)
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        if ($user->rol !== 'admin') {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        Pedido::findOrFail($id)->delete();

        return response()->json(['message' => 'Pedido eliminado correctamente.']);
    }
}
