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

    protected $attributes = [
        'estado' => 'PENDIENTE',
    ];

    // 🔹 Mutadores
    public function setTituloAttribute($value)
    {
        $this->attributes['titulo'] = $value ? mb_strtoupper($value, 'UTF-8') : null;
    }

    public function setComentarioAttribute($value)
    {
        $this->attributes['comentario'] = $value ? ucfirst(strtolower($value)) : null;
    }

    public function setEstadoAttribute($value)
    {
        $this->attributes['estado'] = strtoupper($value ?? 'PENDIENTE');
    }

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
