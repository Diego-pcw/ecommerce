<?php

namespace App\Http\Controllers;

use App\Models\Promocion;
use App\Http\Requests\StorePromocionRequest;
use App\Http\Requests\UpdatePromocionRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PromocionController extends Controller
{
    /**
     * 🔹 Listar todas las promociones (públicas o admin)
     */
    public function index()
    {
        $promociones = Promocion::with('productos:id,nombre,precio')
            ->orderByDesc('fecha_inicio')
            ->get();

        return response()->json($promociones);
    }

    /**
     * 🔹 Mostrar una promoción específica
     */
    public function show($id)
    {
        $promocion = Promocion::with('productos:id,nombre,precio')->find($id);

        if (!$promocion) {
            return response()->json(['message' => 'Promoción no encontrada'], 404);
        }

        return response()->json($promocion);
    }

    /**
     * 🔸 Crear nueva promoción
     */
    public function store(StorePromocionRequest $request)
    {
        $data = $request->validated();

        // 🚦 Validación lógica: fecha_fin debe ser >= fecha_inicio
        if (strtotime($data['fecha_fin']) < strtotime($data['fecha_inicio'])) {
            return response()->json(['message' => 'La fecha de fin debe ser posterior o igual a la fecha de inicio.'], 422);
        }

        $promocion = Promocion::create($data);

        return response()->json([
            'message' => 'Promoción creada correctamente',
            'promocion' => $promocion
        ], 201);
    }

    /**
     * 🔸 Actualizar promoción
     */
    public function update(UpdatePromocionRequest $request, $id)
    {
        $promocion = Promocion::find($id);

        if (!$promocion) {
            return response()->json(['message' => 'Promoción no encontrada'], 404);
        }

        $data = $request->validated();

        if (isset($data['fecha_inicio'], $data['fecha_fin']) && strtotime($data['fecha_fin']) < strtotime($data['fecha_inicio'])) {
            return response()->json(['message' => 'La fecha de fin debe ser posterior o igual a la fecha de inicio.'], 422);
        }

        $promocion->update($data);

        return response()->json([
            'message' => 'Promoción actualizada correctamente',
            'promocion' => $promocion
        ]);
    }

    /**
     * 🔸 Eliminar promoción
     */
    public function destroy($id)
    {
        $promocion = Promocion::find($id);

        if (!$promocion) {
            return response()->json(['message' => 'Promoción no encontrada'], 404);
        }

        DB::transaction(function () use ($promocion) {
            $promocion->productos()->detach();
            $promocion->delete();
        });

        return response()->json(['message' => 'Promoción eliminada correctamente']);
    }

    /**
     * 🔸 Asociar productos a una promoción
     */
    public function asignarProductos(Request $request, $id)
    {
        $promocion = Promocion::findOrFail($id);

        $validated = $request->validate([
            'productos' => 'required|array',
            'productos.*' => 'exists:productos,id'
        ]);

        $promocion->productos()->sync($validated['productos']);

        return response()->json([
            'message' => 'Productos asignados correctamente a la promoción',
            'promocion' => $promocion->load('productos:id,nombre,precio')
        ]);
    }
}
