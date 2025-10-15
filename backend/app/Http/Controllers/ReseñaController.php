<?php

namespace App\Http\Controllers;

use App\Models\Reseña;
use Illuminate\Http\Request;

class ReseñaController extends Controller
{
    // ✅ Listar reseñas (con filtros y visibilidad según rol)
    public function index(Request $request)
    {
        $user = $request->user();

        $reseñas = Reseña::with(['producto', 'user'])
            ->when($request->estado, fn($q) => $q->where('estado', $request->estado))
            ->when($request->producto_id, fn($q) => $q->where('producto_id', $request->producto_id))
            ->when(!$user || !$user->hasRole('admin'), fn($q) => $q->where('estado', 'aprobado'))
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'total' => $reseñas->total(),
            'data' => $reseñas
        ]);
    }

    // ✅ Crear una nueva reseña (el user_id se asigna automáticamente)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'rating' => 'required|integer|min:1|max:5',
            'titulo' => 'nullable|string|max:255',
            'comentario' => 'required|string',
        ]);

        // Asignar automáticamente el usuario autenticado
        $validated['user_id'] = $request->user()->id;

        $reseña = Reseña::create($validated);

        return response()->json([
            'message' => 'Reseña creada correctamente.',
            'data' => $reseña
        ], 201);
    }

    // ✅ Mostrar una reseña específica
    public function show($id)
    {
        $reseña = Reseña::with(['user', 'producto'])->findOrFail($id);

        return response()->json($reseña);
    }

    // ✅ Actualizar una reseña (solo admin/moderador)
    public function update(Request $request, $id)
    {
        $reseña = Reseña::findOrFail($id);

        $validated = $request->validate([
            'estado' => 'nullable|in:pendiente,aprobado,rechazado',
            'titulo' => 'nullable|string|max:255',
            'comentario' => 'nullable|string',
            'rating' => 'nullable|integer|min:1|max:5',
        ]);

        $reseña->update($validated);

        return response()->json([
            'message' => 'Reseña actualizada correctamente.',
            'data' => $reseña
        ]);
    }

    // ✅ Eliminar reseña (solo admin)
    public function destroy($id)
    {
        $reseña = Reseña::findOrFail($id);
        $reseña->delete();

        return response()->json(['message' => 'Reseña eliminada correctamente.']);
    }
}
