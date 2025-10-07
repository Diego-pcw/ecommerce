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
        return $this->path
            ? asset('storage/' . $this->path)
            : asset('images/default-product.jpg');
    }
}
