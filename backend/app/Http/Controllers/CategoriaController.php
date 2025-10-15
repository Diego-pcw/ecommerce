<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    // 🔸 Mostrar todas las categorías (con paginación, filtros y orden)
    public function index(Request $request)
    {
        $query = Categoria::query();

        // Filtro por estado (activo/inactivo)
        if ($request->has('estado')) {
            $query->where('estado', strtolower($request->estado));
        } else {
            $query->where('estado', 'activo');
        }

        // Filtro por búsqueda en nombre o descripción
        if ($request->has('search')) {
            $search = mb_strtoupper($request->search, 'UTF-8');
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'LIKE', "%$search%")
                ->orWhere('descripcion', 'LIKE', "%$search%");
            });
        }

        // Ordenamiento dinámico
        $sortBy = $request->get('sort_by', 'id');
        $sortDir = $request->get('sort_dir', 'asc');
        $query->orderBy($sortBy, $sortDir);

        // Paginación
        $perPage = $request->get('per_page', 10);
        $categorias = $query->paginate($perPage);

        return response()->json($categorias);
    }

    // 🔸 Mostrar una categoría específica (solo lectura)
    public function show($id)
    {
        $categoria = Categoria::find($id);

        if (!$categoria) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }

        return response()->json($categoria);
    }

    // 🔸 Crear nueva categoría (solo admin)
    public function store(Request $request)
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'nombre'      => 'required|string|max:255|unique:categorias,nombre',
            'descripcion' => 'nullable|string',
            'estado'      => 'in:activo,inactivo',
        ]);

        $categoria = Categoria::create($validated);

        return response()->json([
            'message' => 'Categoría creada correctamente',
            'data'    => $categoria
        ], 201);
    }

    // 🔸 Actualizar categoría (solo admin)
    public function update(Request $request, $id)
    {
        $this->authorizeAdmin($request);

        $categoria = Categoria::find($id);
        if (!$categoria) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }

        $validated = $request->validate([
            'nombre'      => 'sometimes|string|max:255|unique:categorias,nombre,' . $categoria->id,
            'descripcion' => 'nullable|string',
            'estado'      => 'in:activo,inactivo',
        ]);

        $categoria->update($validated);

        return response()->json([
            'message' => 'Categoría actualizada correctamente',
            'data'    => $categoria
        ]);
    }

    // 🔸 Eliminar categoría (solo admin)
    public function destroy(Request $request, $id)
    {
        $this->authorizeAdmin($request);

        $categoria = Categoria::find($id);
        if (!$categoria) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }

        $categoria->delete();

        return response()->json(['message' => 'Categoría eliminada correctamente']);
    }

    // 🔸 Helper para verificar rol admin
    private function authorizeAdmin(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->rol !== 'admin') {
            abort(response()->json(['message' => 'Acceso denegado: solo el administrador puede realizar esta acción'], 403));
        }
    }
}
