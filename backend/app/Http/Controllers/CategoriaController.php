<?php

namespace App\Http\Controllers;
use App\Models\Categoria; 

use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    // 🔸 Mostrar todas las categorías (admin y clientes pueden ver)
    public function index()
    {
        $categorias = Categoria::where('estado', 'activo')->get();
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

    // 🔸 Helper para verificar rol
    private function authorizeAdmin(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->rol !== 'admin') {
            abort(response()->json(['message' => 'Acceso denegado: solo el administrador puede realizar esta acción'], 403));
        }
    }
}
