<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    use HasFactory;

    protected $table = 'contact_messages';

    protected $fillable = [
        'user_id',
        'nombre',
        'email',
        'telefono',
        'mensaje',
        'canal_preferido',
        'estado',
        'respuesta',
        'fecha_respuesta',
    ];

    // 🔹 Estados posibles
    protected $attributes = [
        'estado' => 'pendiente',
        'canal_preferido' => 'email',
    ];

    protected $casts = [
        'fecha_respuesta' => 'datetime',
    ];

    // 🔹 Relaciones
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
