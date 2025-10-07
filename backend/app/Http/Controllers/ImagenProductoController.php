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
     * 🔹 Listar todas las imágenes (administrativo)
     */
    public function index()
    {
        $imagenes = ImagenProducto::with('producto')
            ->orderBy('producto_id')
            ->orderBy('orden')
            ->get();

        return response()->json($imagenes);
    }

    /**
     * 🔹 Mostrar imágenes de un producto específico
     */
    public function showByProducto($producto_id)
    {
        $imagenes = ImagenProducto::where('producto_id', $producto_id)
            ->where('estado', 'activo')
            ->orderByDesc('principal')
            ->orderBy('orden')
            ->get();

        if ($imagenes->isEmpty()) {
            return response()->json(['message' => 'No hay imágenes para este producto'], 404);
        }

        // 🧩 Identificar principal y secundarias
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
        $producto = Producto::find($request->producto_id);

        // 🧩 Guardar archivo
        $path = $request->file('imagen')->store('productos', 'public');

        // 🧩 Si se marca como principal, desactivar las demás
        if ($request->boolean('principal')) {
            ImagenProducto::where('producto_id', $producto->id)->update(['principal' => false]);
        }

        $imagen = ImagenProducto::create([
            'producto_id' => $producto->id,
            'path' => $path,
            'alt_text' => $request->alt_text,
            'principal' => $request->boolean('principal'),
            'orden' => $request->orden ?? 0,
            'estado' => 'activo',
        ]);

        return response()->json([
            'message' => 'Imagen subida correctamente',
            'imagen' => $imagen
        ], 201);
    }

    /**
     * 🔸 Actualizar datos de una imagen existente
     */
    public function update(UpdateImagenProductoRequest $request, $id)
    {
        $imagen = ImagenProducto::find($id);

        if (! $imagen) {
            return response()->json(['message' => 'Imagen no encontrada'], 404);
        }

        // 🧩 Reemplazo físico de imagen (si se envía nueva)
        if ($request->hasFile('imagen')) {
            if (Storage::disk('public')->exists($imagen->path)) {
                Storage::disk('public')->delete($imagen->path);
            }

            $imagen->path = $request->file('imagen')->store('productos', 'public');
        }

        // 🧩 Si se marca como principal, desactivar otras
        if ($request->boolean('principal')) {
            ImagenProducto::where('producto_id', $imagen->producto_id)
                ->where('id', '!=', $imagen->id)
                ->update(['principal' => false]);

            $imagen->principal = true;
        } elseif ($request->has('principal')) {
            $imagen->principal = $request->boolean('principal');
        }

        // 🧩 Actualizar demás campos
        $imagen->alt_text = $request->alt_text ?? $imagen->alt_text;
        $imagen->orden = $request->orden ?? $imagen->orden;
        $imagen->estado = $request->estado ?? $imagen->estado;
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

        // 🧩 Borrar archivo físico si existe
        if ($imagen->path && Storage::disk('public')->exists($imagen->path)) {
            Storage::disk('public')->delete($imagen->path);
        }

        $imagen->delete();

        return response()->json(['message' => 'Imagen eliminada correctamente']);
    }
}
