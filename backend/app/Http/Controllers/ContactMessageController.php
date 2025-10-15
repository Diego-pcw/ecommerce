<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    // 📋 Listar mensajes (con filtros, paginación y visibilidad)
    public function index(Request $request)
    {
        $user = $request->user();

        $mensajes = ContactMessage::with('user')
            ->when($user->rol !== 'admin', fn($q) =>
                $q->where('user_id', $user->id)
            )
            ->when($request->filled('estado'), fn($q) =>
                $q->where('estado', strtoupper($request->estado))
            )
            ->orderBy($request->get('sort_by', 'created_at'), $request->get('order', 'desc'))
            ->paginate($request->get('per_page', 10));

        return response()->json([
            'total'        => $mensajes->total(),
            'current_page' => $mensajes->currentPage(),
            'last_page'    => $mensajes->lastPage(),
            'data'         => $mensajes->items(),
        ]);
    }

    // 🧾 Crear nuevo mensaje
    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'mensaje'         => 'required|string',
            'telefono'        => 'nullable|string|max:20',
            'canal_preferido' => 'nullable|in:EMAIL,WHATSAPP,TELEFONO',
        ]);

        $mensaje = ContactMessage::create([
            'user_id'         => $user->id,
            'nombre'          => $user->name,
            'email'           => $user->email,
            'telefono'        => $validated['telefono'] ?? null,
            'mensaje'         => $validated['mensaje'],
            'canal_preferido' => $validated['canal_preferido'] ?? 'EMAIL',
            'estado'          => 'NUEVO',
        ]);

        return response()->json([
            'message' => 'Mensaje enviado correctamente.',
            'data'    => $mensaje,
        ], 201);
    }

    // 🔍 Mostrar un mensaje individual
    public function show(Request $request, $id)
    {
        $mensaje = ContactMessage::with('user')->findOrFail($id);
        $user = $request->user();

        if ($user->rol !== 'admin' && $mensaje->user_id !== $user->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        return response()->json($mensaje);
    }

    // ✏️ Actualizar o responder mensaje (solo admin)
    public function update(Request $request, $id)
    {
        $user = $request->user();

        if ($user->rol !== 'admin') {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'estado'    => 'nullable|in:NUEVO,RESPONDIDO,CERRADO',
            'respuesta' => 'nullable|string',
        ]);

        $mensaje = ContactMessage::findOrFail($id);

        if (isset($validated['respuesta'])) {
            $mensaje->update([
                'respuesta'       => $validated['respuesta'],
                'estado'          => 'RESPONDIDO',
                'fecha_respuesta' => now(),
            ]);
        } elseif (isset($validated['estado'])) {
            $mensaje->update(['estado' => $validated['estado']]);
        }

        return response()->json([
            'message' => 'Mensaje actualizado correctamente.',
            'data'    => $mensaje,
        ]);
    }

    // 🗑️ Eliminar mensaje (solo admin)
    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        if ($user->rol !== 'admin') {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        ContactMessage::findOrFail($id)->delete();

        return response()->json(['message' => 'Mensaje eliminado correctamente.']);
    }
}
