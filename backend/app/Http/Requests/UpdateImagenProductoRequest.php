<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateImagenProductoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'principal' => filter_var($this->principal ?? null, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE),
            'orden' => isset($this->orden) ? (int) $this->orden : null,
        ]);
    }

    public function rules(): array
    {
        return [
            'imagen' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'alt_text' => 'nullable|string|max:255',
            'principal' => 'nullable|boolean',
            'orden' => 'nullable|integer|min:0',
            'estado' => 'nullable|in:activo,inactivo',
        ];
    }
}
