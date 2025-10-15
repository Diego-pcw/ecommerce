<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CarritoDetalle extends Model
{
    protected $table = 'carrito_detalles';

    protected $fillable = [
        'carrito_id',
        'producto_id',
        'cantidad',
        'precio_unitario',
    ];

    protected $casts = [
        'precio_unitario' => 'decimal:2',
    ];

    // 🔗 Relaciones
    public function carrito()
    {
        return $this->belongsTo(Carrito::class, 'carrito_id');
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }

    // 🔹 Subtotal automático
    public function getSubtotalAttribute(): float
    {
        return $this->cantidad * $this->precio_unitario;
    }
}
