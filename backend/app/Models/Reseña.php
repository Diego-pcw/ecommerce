<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reseña extends Model
{
    use HasFactory;

    protected $table = 'reseñas';

    protected $fillable = [
        'producto_id',
        'user_id',
        'rating',
        'titulo',
        'comentario',
        'estado',
    ];

    // 🔹 Estados posibles: pendiente, aprobado, rechazado
    protected $attributes = [
        'estado' => 'pendiente',
    ];

    // 🔹 Relaciones
    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
