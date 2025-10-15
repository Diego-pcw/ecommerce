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

    protected $attributes = [
        'estado' => 'PENDIENTE',
        'canal_preferido' => 'EMAIL',
    ];

    protected $casts = [
        'fecha_respuesta' => 'datetime',
    ];

    // 🔹 Mutadores
    public function setNombreAttribute($value)
    {
        $this->attributes['nombre'] = mb_strtoupper($value, 'UTF-8');
    }

    public function setMensajeAttribute($value)
    {
        $this->attributes['mensaje'] = ucfirst(strtolower($value));
    }

    public function setRespuestaAttribute($value)
    {
        $this->attributes['respuesta'] = $value ? ucfirst(strtolower($value)) : null;
    }

    public function setEstadoAttribute($value)
    {
        $this->attributes['estado'] = strtoupper($value ?? 'PENDIENTE');
    }

    public function setCanalPreferidoAttribute($value)
    {
        $this->attributes['canal_preferido'] = strtoupper($value ?? 'EMAIL');
    }

    // 🔹 Relaciones
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
