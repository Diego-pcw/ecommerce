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

    // 🔹 Mutadores automáticos (para guardar en mayúsculas)
    public function setEstadoAttribute($value)
    {
        $this->attributes['estado'] = strtoupper($value);
    }

    public function setPaymentMethodAttribute($value)
    {
        $this->attributes['payment_method'] = strtoupper($value);
    }

    public function setTransactionIdAttribute($value)
    {
        $this->attributes['transaction_id'] = $value ? strtoupper($value) : null;
    }

    public function setShippingAddressAttribute($value)
    {
        // Si es un array, convertimos cada valor a mayúsculas antes de guardarlo como JSON
        if (is_array($value)) {
            $this->attributes['shipping_address'] = json_encode(
                array_map(fn($v) => strtoupper($v), $value)
            );
        } else {
            $this->attributes['shipping_address'] = $value;
        }
    }
}
