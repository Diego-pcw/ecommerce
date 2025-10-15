<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Carrito extends Model
{
    protected $table = 'carritos';

    protected $fillable = [
        'user_id',
        'session_id',
        'estado',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    // 🔹 Relaciones
    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function detalles()
    {
        return $this->hasMany(CarritoDetalle::class, 'carrito_id');
    }

    // 🔸 Accesor: mostrar estado legible y cálculo automático de expiración
    public function getEstadoAttribute($value)
    {
        if ($this->expires_at && Carbon::now()->greaterThan($this->expires_at)) {
            return 'expirado';
        }
        return $value ?? 'activo';
    }

    // 🔹 Verificar si el carrito está vacío
    public function getEstaVacioAttribute(): bool
    {
        return $this->detalles()->count() === 0;
    }

    // 🔹 Total del carrito calculado
    public function getTotalAttribute(): float
    {
        return $this->detalles->sum(fn($detalle) => $detalle->cantidad * $detalle->precio_unitario);
    }
}
