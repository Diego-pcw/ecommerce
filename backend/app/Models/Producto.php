<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Producto extends Model
{
    use HasFactory;

    protected $fillable = [
        'categoria_id',
        'nombre',
        'slug',
        'descripcion',
        'precio',
        'stock',
        'sku',
        'estado',
    ];

    // 🔹 Relaciones
    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function imagenes()
    {
        return $this->hasMany(ImagenProducto::class);
    }

    /**
     * 🧠 Generar SKU único en formato BWP-CTGXXX-YYYY
     */
    public static function generarSKU($categoriaId)
    {
        $categoria = \App\Models\Categoria::find($categoriaId);
        $prefijoCat = $categoria ? strtoupper(substr($categoria->nombre, 0, 3)) : 'GEN';
        $nextId = (self::max('id') ?? 0) + 1;
        $año = now()->year;

        return sprintf('BWP-%s%03d-%d', $prefijoCat, $nextId, $año);
    }

    /**
     * 🧠 Generar slug único a partir del nombre
     */
    public static function generarSlug($nombre)
    {
        $slugBase = Str::slug($nombre);
        $slug = $slugBase;
        $contador = 2;

        while (self::where('slug', $slug)->exists()) {
            $slug = "{$slugBase}-{$contador}";
            $contador++;
        }

        return $slug;
    }
}
