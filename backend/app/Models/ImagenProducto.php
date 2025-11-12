<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImagenProducto extends Model
{
    use HasFactory;

    protected $table = 'imagen_productos';

    protected $fillable = [
        'producto_id',
        'path',
        'alt_text',
        'principal',
        'orden',
        'estado',
    ];

    // 🔹 Agregar automáticamente 'url' en las respuestas JSON
    protected $appends = ['url'];

    protected $casts = [
        'principal' => 'boolean',
        'orden' => 'integer',
    ];

    const ESTADOS = ['activo', 'inactivo'];

    /**
     * 🔗 Relación inversa con Producto
     */
    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }

    /**
     * 🔹 Accesor: URL pública completa de la imagen
     * Se adapta automáticamente a la estructura en Hostinger (public_html/storage/productos)
     */
    public function getUrlAttribute()
    {
        if ($this->path) {
            // ✅ Si la imagen está en storage, devolver ruta pública completa
            // Ejemplo: https://mediumspringgreen-koala-465676.hostingersite.com/storage/productos/imagen.jpg
            return asset('storage/' . ltrim($this->path, '/'));
        }

        // 🔸 Si no hay imagen, mostrar una imagen por defecto
        return asset('images/default-product.jpg');
    }
}
