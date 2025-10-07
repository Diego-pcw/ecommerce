<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Http\Requests\ProductoRequest;

class ProductoController extends Controller
{
    /**
     * 🔹 Listar todos los productos (visible para todos)
     */
    public function index()
    {
        $productos = Producto::with(['categoria', 'imagenes'])->get();
        return response()->json($productos);
    }

    /**
     * 🔹 Mostrar un producto específico (visible para todos)
     */
    public function show($id)
    {
        $producto = Producto::with(['categoria', 'imagenes'])->find($id);

        if (! $producto) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        return response()->json($producto);
    }

    /**
     * 🔸 Crear un nuevo producto (solo admin)
     */
    public function store(ProductoRequest $request)
    {
        $data = $request->validated();

        // 🧠 Generar slug y SKU automáticamente desde el modelo
        $data['slug'] = Producto::generarSlug($data['nombre']);
        $data['sku']  = $data['sku'] ?? Producto::generarSKU($data['categoria_id']);
        $data['estado'] = $data['estado'] ?? 'activo';

        $producto = Producto::create($data);

        return response()->json([
            'message' => '✅ Producto creado correctamente',
            'producto' => $producto
        ], 201);
    }

    /**
     * 🔸 Actualizar un producto existente (solo admin)
     */
    public function update(ProductoRequest $request, $id)
    {
        $producto = Producto::find($id);

        if (! $producto) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        $data = $request->validated();

        // 🧠 Regenerar slug si se modifica el nombre
        if (isset($data['nombre'])) {
            $data['slug'] = Producto::generarSlug($data['nombre']);
        }

        // Si cambia la categoría y no hay SKU personalizado
        if (isset($data['categoria_id']) && empty($data['sku'])) {
            $data['sku'] = Producto::generarSKU($data['categoria_id']);
        }

        $producto->update($data);

        return response()->json([
            'message' => '✅ Producto actualizado correctamente',
            'producto' => $producto
        ]);
    }

    /**
     * 🔸 Eliminar un producto (solo admin)
     */
    public function destroy($id)
    {
        $producto = Producto::find($id);

        if (! $producto) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        $producto->delete();

        return response()->json(['message' => '🗑️ Producto eliminado correctamente']);
    }
}
