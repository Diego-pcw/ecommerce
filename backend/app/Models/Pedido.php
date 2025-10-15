<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'fecha_pedido',
        'estado',
        'total',
        'shipping_address',
        'payment_method',
        'transaction_id',
        'paid_at',
    ];

    protected $casts = [
        'shipping_address' => 'array',
        'fecha_pedido' => 'datetime',
        'paid_at' => 'datetime',
    ];

    // 🔹 Relaciones
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function detalles()
    {
        return $this->hasMany(DetallePedido::class);
    }
}
