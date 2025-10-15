<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    // ✅ Listar mensajes con filtros
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user && $user->rol === 'admin') {
            // 🔹 Admin ve todos los mensajes (con opción de filtrar por estado)
            $mensajes = ContactMessage::with('user')
                ->when($request->estado, fn($q) => $q->where('estado', $request->estado))
                ->orderBy('created_at', 'desc')
                ->paginate(10);
        } else {
            // 🔹 Usuario autenticado solo ve sus propios mensajes
            $mensajes = ContactMessage::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->paginate(10);
        }

        return response()->json([
            'total' => $mensajes->total(),
            'data' => $mensajes
        ]);
    }

    // ✅ Enviar un nuevo mensaje de contacto
    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'mensaje' => 'required|string',
            'telefono' => 'nullable|string|max:20',
            'canal_preferido' => 'nullable|in:email,whatsapp,telefono',
        ]);

        $mensaje = ContactMessage::create([
            'user_id' => $user->id,
            'nombre' => $user->name,
            'email' => $user->email,
            'telefono' => $validated['telefono'] ?? null,
            'mensaje' => $validated['mensaje'],
            'canal_preferido' => $validated['canal_preferido'] ?? 'email',
            'estado' => 'nuevo',
        ]);

        return response()->json([
            'message' => 'Mensaje enviado correctamente.',
            'data' => $mensaje
        ], 201);
    }

    // ✅ Mostrar mensaje individual (solo admin o dueño)
    public function show(Request $request, $id)
    {
        $mensaje = ContactMessage::with('user')->findOrFail($id);
        $user = $request->user();

        if ($user->rol !== 'admin' && $mensaje->user_id !== $user->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        return response()->json($mensaje);
    }

    // ✅ Actualizar o responder mensaje (solo admin)
    public function update(Request $request, $id)
    {
        $user = $request->user();

        if ($user->rol !== 'admin') {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'estado' => 'nullable|in:nuevo,respondido,cerrado',
            'respuesta' => 'nullable|string',
        ]);

        $mensaje = ContactMessage::findOrFail($id);

        if (isset($validated['respuesta'])) {
            $mensaje->update([
                'respuesta' => $validated['respuesta'],
                'estado' => 'respondido',
                'fecha_respuesta' => now(),
            ]);
        } elseif (isset($validated['estado'])) {
            $mensaje->update(['estado' => $validated['estado']]);
        }

        return response()->json([
            'message' => 'Mensaje actualizado correctamente.',
            'data' => $mensaje
        ]);
    }

    // ✅ Eliminar mensaje (solo admin)
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
