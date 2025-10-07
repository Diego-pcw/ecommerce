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
        $productos = Producto::with(['categoria', 'imagenes', 'promociones'])->get();

        $data = $productos->map(function ($producto) {
            return [
                'id' => $producto->id,
                'nombre' => $producto->nombre,
                'descripcion' => $producto->descripcion,
                'categoria' => $producto->categoria?->nombre,
                'precio_original' => $producto->precio,
                'precio_final' => $producto->precio_con_descuento,
                'stock' => $producto->stock,
                'promocion_vigente' => $producto->promocion_vigente,
                'imagenes' => $producto->imagenes
                    ->where('estado', 'activo')
                    ->map(fn($img) => [
                        'id' => $img->id,
                        'url' => $img->url, // ✅ Usa el accesor dinámico
                        'principal' => $img->principal,
                    ])
                    ->values(),
            ];
        });

        return response()->json($data);
    }

    /**
     * 🔹 Mostrar un producto específico (visible para todos)
     */
    public function show($id)
    {
        $producto = Producto::with(['categoria', 'imagenes', 'promociones'])->find($id);

        if (!$producto) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        return response()->json([
            'id' => $producto->id,
            'nombre' => $producto->nombre,
            'descripcion' => $producto->descripcion,
            'categoria' => $producto->categoria?->nombre,
            'precio_original' => $producto->precio,
            'precio_final' => $producto->precio_con_descuento,
            'stock' => $producto->stock,
            'promocion_vigente' => $producto->promocion_vigente,
            'imagenes' => $producto->imagenes
                ->where('estado', 'activo')
                ->map(fn($img) => [
                    'id' => $img->id,
                    'url' => $img->url,
                    'principal' => $img->principal,
                ])
                ->values(),
        ]);
    }

    /**
     * 🔸 Crear un nuevo producto (solo admin)
     */
    public function store(ProductoRequest $request)
    {
        $data = $request->validated();

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

        if (!$producto) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        $data = $request->validated();

        if (isset($data['nombre'])) {
            $data['slug'] = Producto::generarSlug($data['nombre']);
        }

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

        if (!$producto) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        $producto->delete();

        return response()->json(['message' => '🗑️ Producto eliminado correctamente']);
    }

    /**
     * 🔹 Listar solo productos con promociones vigentes
     */
    public function productosConOfertas()
    {
        $hoy = now()->toDateString();

        $productos = Producto::whereHas('promociones', function ($query) use ($hoy) {
            $query->where('estado', 'activo')
                  ->whereDate('fecha_inicio', '<=', $hoy)
                  ->whereDate('fecha_fin', '>=', $hoy);
        })
        ->with(['categoria', 'imagenes', 'promociones'])
        ->get();

        $data = $productos->map(function ($producto) {
            return [
                'id' => $producto->id,
                'nombre' => $producto->nombre,
                'descripcion' => $producto->descripcion,
                'categoria' => $producto->categoria?->nombre,
                'precio_original' => $producto->precio,
                'precio_final' => $producto->precio_con_descuento,
                'stock' => $producto->stock,
                'promocion_vigente' => $producto->promocion_vigente,
                'imagenes' => $producto->imagenes
                    ->where('estado', 'activo')
                    ->map(fn($img) => [
                        'id' => $img->id,
                        'url' => $img->url, // ✅ usa accessor del modelo
                        'principal' => $img->principal,
                    ])
                    ->values(),
            ];
        });

        return response()->json($data);
    }
}
