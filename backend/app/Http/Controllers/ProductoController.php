<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Http\Requests\ProductoRequest;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    /**
     * 🔹 Listar productos con paginación, búsqueda y filtros
     */
    public function index(Request $request)
    {
        $query = Producto::with(['categoria', 'imagenes', 'promociones']);

        // Filtro por estado
        if ($request->has('estado')) {
            $query->where('estado', strtolower($request->estado));
        } else {
            $query->where('estado', 'activo');
        }

        // Filtro por categoría
        if ($request->has('categoria_id')) {
            $query->where('categoria_id', $request->categoria_id);
        }

        // Filtro por rango de precios
        if ($request->has(['precio_min', 'precio_max'])) {
            $query->whereBetween('precio', [
                $request->precio_min,
                $request->precio_max
            ]);
        }

        // Búsqueda general por nombre o descripción
        if ($request->has('search')) {
            $search = mb_strtoupper($request->search, 'UTF-8');
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'LIKE', "%$search%")
                  ->orWhere('descripcion', 'LIKE', "%$search%");
            });
        }

        // Orden dinámico
        $sortBy = $request->get('sort_by', 'id');
        $sortDir = $request->get('sort_dir', 'asc');
        $query->orderBy($sortBy, $sortDir);

        // Paginación
        $perPage = $request->get('per_page', 10);
        $productos = $query->paginate($perPage);

        // Transformar datos
        $productos->getCollection()->transform(function ($producto) {
            return [
                'id' => $producto->id,
                'nombre' => $producto->nombre,
                'marca' => $producto->marca, // 👈 agregado
                'descripcion' => $producto->descripcion,
                'categoria' => $producto->categoria?->nombre,
                'precio_original' => $producto->precio,
                'precio_final' => $producto->precio_con_descuento,
                'stock' => $producto->stock,
                'estado' => $producto->estado, // 👈 agregado
                'promocion_vigente' => $producto->promocion_vigente,
                'imagenes' => $producto->imagenes
                    ->where('estado', 'activo')
                    ->map(fn($img) => [
                        'id' => $img->id,
                        'url' => $img->url,
                        'principal' => $img->principal,
                    ])
                    ->values(),
            ];
        });

        return response()->json($productos);
    }

    /**
     * 🔹 Mostrar un producto específico
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
            'marca' => $producto->marca, // 👈 agregado
            'descripcion' => $producto->descripcion,
            'categoria' => $producto->categoria?->nombre,
            'precio_original' => $producto->precio,
            'precio_final' => $producto->precio_con_descuento,
            'stock' => $producto->stock,
            'estado' => $producto->estado, // 👈 agregado
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
     * 🔸 Crear producto
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
     * 🔸 Actualizar producto
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
     * 🔸 Eliminar producto
     */
    public function destroy($id)
    {
        $producto = Producto::with(['imagenes', 'promociones'])->find($id);

        if (!$producto) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        try {
            // 1️⃣ Eliminar imágenes
            foreach ($producto->imagenes as $img) {
                if ($img->url && Storage::exists($img->url)) {
                    Storage::delete($img->url);
                }
                $img->delete();
            }

            // 2️⃣ Quitar promociones
            if ($producto->promociones()->exists()) {
                $producto->promociones()->detach();
            }

            // 3️⃣ Soft Delete
            $producto->delete();

            return response()->json(['message' => '🗑️ Producto eliminado correctamente'], 200);

        } catch (\Throwable $e) {

            Log::error('Error al eliminar producto:', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Error interno al eliminar producto'
            ], 500);
        }
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
                'marca' => $producto->marca, // 👈 agregado
                'descripcion' => $producto->descripcion,
                'categoria' => $producto->categoria?->nombre,
                'precio_original' => $producto->precio,
                'precio_final' => $producto->precio_con_descuento,
                'stock' => $producto->stock,
                'estado' => $producto->estado, // 👈 agregado
                'promocion_vigente' => $producto->promocion_vigente,
                'imagenes' => $producto->imagenes
                    ->where('estado', 'activo')
                    ->map(fn($img) => [
                        'id' => $img->id,
                        'url' => $img->url,
                        'principal' => $img->principal,
                    ])
                    ->values(),
            ];
        });

        return response()->json($data);
    }
}
