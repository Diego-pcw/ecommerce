<?php

namespace App\Http\Controllers;

use App\Models\DetallePedido;
use App\Models\Pedido;
use Illuminate\Http\Request;

class DetallePedidoController extends Controller
{
    // 📦 Listar los detalles de un pedido específico
    public function index(Request $request, $pedido_id)
    {
        $pedido = Pedido::with('detalles.producto')->findOrFail($pedido_id);
        $user = $request->user();

        if ($user->rol !== 'admin' && $pedido->user_id !== $user->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        return response()->json($pedido->detalles);
    }

    // ➕ Agregar un producto al pedido (solo admin)
    public function store(Request $request, $pedido_id)
    {
        $user = $request->user();
        if ($user->rol !== 'admin') {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'cantidad' => 'required|integer|min:1',
            'precio_unitario' => 'required|numeric|min:0',
        ]);

        $detalle = DetallePedido::create([
            'pedido_id' => $pedido_id,
            'producto_id' => $validated['producto_id'],
            'cantidad' => $validated['cantidad'],
            'precio_unitario' => $validated['precio_unitario'],
        ]);

        return response()->json([
            'message' => 'Producto agregado al pedido correctamente.',
            'data' => $detalle
        ], 201);
    }

    // ✏️ Actualizar un detalle del pedido (solo admin)
    public function update(Request $request, $id)
    {
        $user = $request->user();
        if ($user->rol !== 'admin') {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $detalle = DetallePedido::findOrFail($id);

        $validated = $request->validate([
            'cantidad' => 'sometimes|integer|min:1',
            'precio_unitario' => 'sometimes|numeric|min:0',
        ]);

        $detalle->update($validated);

        return response()->json([
            'message' => 'Detalle de pedido actualizado correctamente.',
            'data' => $detalle
        ]);
    }

    // ❌ Eliminar un detalle del pedido (solo admin)
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        if ($user->rol !== 'admin') {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $detalle = DetallePedido::findOrFail($id);
        $detalle->delete();

        return response()->json(['message' => 'Detalle de pedido eliminado correctamente.']);
    }
}
