<?php

namespace App\Http\Controllers;

use App\Models\Reseña;
use Illuminate\Http\Request;

class ReseñaController extends Controller
{
    // 📋 Listar reseñas (con filtros, paginación y visibilidad por rol)
    public function index(Request $request)
    {
        $user = $request->user();
    
        $reseñas = Reseña::with(['producto', 'user'])
            // 🔹 Filtro por estado, insensible a mayúsculas/minúsculas
            ->when($request->filled('estado'), function ($q) use ($request) {
                $estado = $request->estado;
                $q->whereRaw('UPPER(estado) = ?', [strtoupper($estado)]);
            })
            // 🔹 Filtro por producto
            ->when($request->filled('producto_id'), fn($q) =>
                $q->where('producto_id', $request->producto_id)
            )
            // 🔹 Solo mostrar APROBADO a usuarios no admin si no hay filtro de estado
            ->when((!$user || $user->rol !== 'admin') && !$request->filled('estado'), fn($q) =>
                $q->whereRaw('UPPER(estado) = ?', ['APROBADO'])
            )
            ->orderBy($request->get('sort_by', 'created_at'), $request->get('order', 'desc'))
            ->paginate($request->get('per_page', 10));
        
        return response()->json([
            'total' => $reseñas->total(),
            'current_page' => $reseñas->currentPage(),
            'last_page' => $reseñas->lastPage(),
            'data' => $reseñas->items(),
        ]);
    }

    // 🧾 Crear nueva reseña
    public function store(Request $request)
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Usuario no autenticado.'], 401);
        }

        $validated = $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'rating'      => 'required|integer|min:1|max:5',
            'titulo'      => 'nullable|string|max:255',
            'comentario'  => 'required|string',
        ]);

        $validated['user_id'] = $request->user()->id;

        $reseña = Reseña::create($validated);

        return response()->json([
            'message' => 'Reseña creada correctamente.',
            'data'    => $reseña,
        ], 201);
    }

    // 🔍 Mostrar una reseña
    public function show($id)
    {
        $reseña = Reseña::with(['user', 'producto'])->findOrFail($id);
        return response()->json($reseña);
    }

    // ✏️ Actualizar reseña (solo admin/moderador)
    public function update(Request $request, $id)
    {
        $reseña = Reseña::findOrFail($id);

        $validated = $request->validate([
            'estado'     => 'nullable|in:PENDIENTE,APROBADO,RECHAZADO',
            'titulo'     => 'nullable|string|max:255',
            'comentario' => 'nullable|string',
            'rating'     => 'nullable|integer|min:1|max:5',
        ]);

        $reseña->update($validated);

        return response()->json([
            'message' => 'Reseña actualizada correctamente.',
            'data'    => $reseña,
        ]);
    }

    // 🗑️ Eliminar reseña (solo admin)
    public function destroy($id)
    {
        $reseña = Reseña::findOrFail($id);
        $reseña->delete();

        return response()->json(['message' => 'Reseña eliminada correctamente.']);
    }
}
