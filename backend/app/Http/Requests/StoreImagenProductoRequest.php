<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreImagenProductoRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Solo admin puede crear (si usas admin middleware, aquí puedes retornar true)
        return true;
    }

    protected function prepareForValidation(): void
    {
        // Normalizar booleanos que vienen como "true"/"false" o "1"/"0"
        $this->merge([
            'principal' => filter_var($this->principal ?? false, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE),
            'orden' => isset($this->orden) ? (int) $this->orden : 0,
        ]);
    }

    public function rules(): array
    {
        return [
            'producto_id' => 'required|exists:productos,id',
            'imagen' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'alt_text' => 'nullable|string|max:255',
            'principal' => 'boolean',
            'orden' => 'integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'imagen.required' => 'Debes subir una imagen.',
            'imagen.image'    => 'El archivo debe ser una imagen válida.',
            'imagen.max'      => 'La imagen no puede superar 2MB.',
        ];
    }
}

