<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePromocionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'titulo' => 'sometimes|string|max:255',
            'descripcion' => 'nullable|string',
            'descuento_tipo' => 'sometimes|in:percent,fixed',
            'descuento_valor' => 'sometimes|numeric|min:0.01',
            'fecha_inicio' => 'sometimes|date',
            'fecha_fin' => 'sometimes|date|after_or_equal:fecha_inicio',
            'estado' => 'sometimes|in:activo,inactivo',
        ];
    }
}
