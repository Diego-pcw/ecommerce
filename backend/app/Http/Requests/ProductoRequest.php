<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Se validará rol desde middleware, así que permitimos aquí
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nombre'        => ['required', 'string', 'max:255'],
            'marca'         => ['nullable', 'string', 'max:255'], // 👈 agregado
            'descripcion'   => ['nullable', 'string'],
            'precio'        => ['required', 'numeric', 'min:0'],
            'stock'         => ['required', 'integer', 'min:0'],
            'categoria_id'  => ['required', 'exists:categorias,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre del producto es obligatorio.',
            'precio.required' => 'El precio es obligatorio.',
            'categoria_id.exists' => 'La categoría seleccionada no existe.',
        ];
    }
}
