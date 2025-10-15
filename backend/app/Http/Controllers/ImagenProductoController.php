<?php

namespace App\Http\Controllers;

use App\Models\ImagenProducto;
use App\Models\Producto;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\StoreImagenProductoRequest;
use App\Http\Requests\UpdateImagenProductoRequest;

class ImagenProductoController extends Controller
{
    /**
     * 🔹 Listar imágenes (con paginación y búsqueda opcional)
     */
    public function index()
    {
        $imagenes = ImagenProducto::with('producto')
            ->when(request('estado'), fn($q) => $q->where('estado', strtoupper(request('estado'))))
            ->orderBy('producto_id')
            ->orderBy('orden')
            ->paginate(10); // ✅ Paginación

        return response()->json([
            'total' => $imagenes->total(),
            'data' => $imagenes->items(),
        ]);
    }

    /**
     * 🔹 Mostrar imágenes activas de un producto específico
     */
    public function showByProducto($producto_id)
    {
        $imagenes = ImagenProducto::where('producto_id', $producto_id)
            ->where('estado', 'ACTIVO')
            ->orderByDesc('principal')
            ->orderBy('orden')
            ->get();

        if ($imagenes->isEmpty()) {
            return response()->json(['message' => 'No hay imágenes para este producto'], 404);
        }

        $principal = $imagenes->firstWhere('principal', true);
        $secundarias = $imagenes->where('principal', false)->values();

        return response()->json([
            'producto_id' => (int) $producto_id,
            'principal' => $principal ? [
                'id' => $principal->id,
                'url' => $principal->url,
                'alt_text' => $principal->alt_text,
            ] : null,
            'secundarias' => $secundarias->map(fn($img) => [
                'id' => $img->id,
                'url' => $img->url,
                'alt_text' => $img->alt_text,
            ])->values(),
        ]);
    }

    /**
     * 🔸 Subir nueva imagen
     */
    public function store(StoreImagenProductoRequest $request)
    {
        $producto = Producto::findOrFail($request->producto_id);

        // 🧩 Guardar archivo físico
        $path = $request->file('imagen')->store('productos', 'public');

        // 🧩 Desactivar otras principales si se marca una nueva
        if ($request->boolean('principal')) {
            ImagenProducto::where('producto_id', $producto->id)->update(['principal' => false]);
        }

        // 🧩 Guardar imagen normalizando datos
        $imagen = ImagenProducto::create([
            'producto_id' => $producto->id,
            'path' => $path,
            'alt_text' => strtoupper($request->alt_text ?? ''),
            'principal' => $request->boolean('principal'),
            'orden' => $request->orden ?? 0,
            'estado' => 'ACTIVO',
        ]);

        return response()->json([
            'message' => 'Imagen subida correctamente',
            'imagen' => $imagen
        ], 201);
    }

    /**
     * 🔸 Actualizar una imagen existente
     */
    public function update(UpdateImagenProductoRequest $request, $id)
    {
        $imagen = ImagenProducto::find($id);

        if (! $imagen) {
            return response()->json(['message' => 'Imagen no encontrada'], 404);
        }

        // 🧩 Reemplazar imagen física si se envía nueva
        if ($request->hasFile('imagen')) {
            if (Storage::disk('public')->exists($imagen->path)) {
                Storage::disk('public')->delete($imagen->path);
            }
            $imagen->path = $request->file('imagen')->store('productos', 'public');
        }

        // 🧩 Desactivar otras si esta es principal
        if ($request->boolean('principal')) {
            ImagenProducto::where('producto_id', $imagen->producto_id)
                ->where('id', '!=', $imagen->id)
                ->update(['principal' => false]);

            $imagen->principal = true;
        } elseif ($request->has('principal')) {
            $imagen->principal = $request->boolean('principal');
        }

        // 🧩 Actualizar otros campos (normalizados)
        $imagen->alt_text = strtoupper($request->alt_text ?? $imagen->alt_text);
        $imagen->orden = $request->orden ?? $imagen->orden;
        $imagen->estado = strtoupper($request->estado ?? $imagen->estado);
        $imagen->save();

        return response()->json([
            'message' => 'Imagen actualizada correctamente',
            'imagen' => $imagen
        ]);
    }

    /**
     * 🔸 Eliminar imagen
     */
    public function destroy($id)
    {
        $imagen = ImagenProducto::find($id);

        if (! $imagen) {
            return response()->json(['message' => 'Imagen no encontrada'], 404);
        }

        if ($imagen->path && Storage::disk('public')->exists($imagen->path)) {
            Storage::disk('public')->delete($imagen->path);
        }

        $imagen->delete();

        return response()->json(['message' => 'Imagen eliminada correctamente']);
    }
}
