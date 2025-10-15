<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'descripcion',
        'estado',
    ];

    // 🔹 Convertir automáticamente texto a mayúsculas antes de guardar
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
                $model->estado = mb_strtolower(trim($model->estado)); // activo/inactivo en minúsculas
            }
        });
    }

    // Relación con productos
    public function productos()
    {
        return $this->hasMany(Producto::class);
    }
}
