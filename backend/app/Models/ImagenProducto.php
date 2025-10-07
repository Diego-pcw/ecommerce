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

    // 🧩 Agregar 'url' automáticamente en las respuestas JSON
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

    // 🔹 URL pública de imagen
    
    public function getUrlAttribute()
    {
        if ($this->path) {
            // Retorna la URL completa a la imagen dentro de storage
            return asset('storage/' . ltrim($this->path, '/'));
        }

        // Imagen por defecto si no existe
        return asset('images/default-product.jpg');
    }
}
