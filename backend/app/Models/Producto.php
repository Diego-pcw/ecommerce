<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\Promocion;

class Producto extends Model
{
    use HasFactory;

    protected $fillable = [
        'categoria_id',
        'nombre',
        'slug',
        'marca', 
        'descripcion',
        'precio',
        'stock',
        'sku',
        'estado',
    ];

    protected $appends = ['promocion_vigente', 'precio_con_descuento'];

    /**
     * 🔹 Normalizar texto automáticamente antes de guardar
     */
    public static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            if (isset($model->nombre)) {
                $model->nombre = mb_strtoupper(trim($model->nombre), 'UTF-8');
            }

            if (isset($model->descripcion)) {
                $model->descripcion = mb_strtoupper(trim($model->descripcion), 'UTF-8');
            }

            if (isset($model->estado)) {
                $model->estado = mb_strtolower(trim($model->estado)); // activo/inactivo
            }

            if (isset($model->sku)) {
                $model->sku = mb_strtoupper(trim($model->sku));
            }
        });
    }

    // 🔸 Relaciones
    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function imagenes()
    {
        return $this->hasMany(ImagenProducto::class);
    }

    public function promociones()
    {
        return $this->belongsToMany(Promocion::class, 'producto_promocion')->withTimestamps();
    }

    /**
     * 🧠 Generar SKU único
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
     * 🧠 Generar slug único
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

    /**
     * 🧮 Obtener promoción vigente
     */
    public function getPromocionVigenteAttribute()
    {
        $hoy = Carbon::today();

        $promocion = $this->promociones()
            ->where('estado', 'activo')
            ->whereDate('fecha_inicio', '<=', $hoy)
            ->whereDate('fecha_fin', '>=', $hoy)
            ->first();

        if (!$promocion) {
            return null;
        }

        return [
            'titulo' => $promocion->titulo,
            'tipo' => $promocion->descuento_tipo,
            'valor' => (float) $promocion->descuento_valor,
            'fecha_inicio' => $promocion->fecha_inicio->toDateString(),
            'fecha_fin' => $promocion->fecha_fin->toDateString(),
        ];
    }

    /**
     * 💰 Calcular precio con descuento
     */
    public function getPrecioConDescuentoAttribute()
    {
        $promocion = $this->promocion_vigente;

        if (!$promocion) {
            return (float) $this->precio;
        }

        $tipo = $promocion['tipo'];
        $valor = $promocion['valor'];
        $precio = (float) $this->precio;

        if ($tipo === 'percent') {
            return round($precio * (1 - $valor / 100), 2);
        }

        if ($tipo === 'fixed') {
            return round(max($precio - $valor, 0), 2);
        }

        return $precio;
    }
}
