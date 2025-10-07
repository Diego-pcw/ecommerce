<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Promocion extends Model
{
    use HasFactory;

    protected $table = 'promocions';

    protected $fillable = [
        'titulo',
        'descripcion',
        'descuento_tipo',
        'descuento_valor',
        'fecha_inicio',
        'fecha_fin',
        'estado',
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
        'descuento_valor' => 'decimal:2',
    ];

    const ESTADOS = ['activo', 'inactivo'];

    /**
     * 🔗 Relación muchos a muchos con productos
     */
    public function productos()
    {
        return $this->belongsToMany(Producto::class, 'producto_promocion')
            ->withTimestamps();
    }

    /**
     * 🔹 Determina si la promoción está actualmente vigente
     */
    public function getEstaVigenteAttribute(): bool
    {
        $hoy = Carbon::today();
        return $this->estado === 'activo'
            && $this->fecha_inicio <= $hoy
            && $this->fecha_fin >= $hoy;
    }
}
