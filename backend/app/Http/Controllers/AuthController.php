<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * 🔹 Registro de usuario
     */
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'name'     => strtoupper($request->name),
            'email'    => strtolower($request->email),
            'password' => Hash::make($request->password),
            'rol'      => 'cliente',
            'estado'   => 'activo',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Usuario registrado correctamente',
            'user'    => $user,
            'token'   => $token
        ], 201);
    }

    /**
     * 🔹 Login
     */
    public function login(LoginRequest $request)
    {
        $user = User::where('email', strtolower($request->email))->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        if ($user->estado !== 'activo') {
            return response()->json(['message' => 'Cuenta inactiva, contacte al administrador'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'user'    => $user,
            'token'   => $token
        ]);
    }

    /**
     * 🔹 Cerrar sesión
     */
    public function logout()
    {
        auth()->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }

    /**
     * 🔹 Perfil del usuario autenticado
     */
    public function profile()
    {
        return response()->json(['user' => auth()->user()]);
    }

    /**
     * 🔹 Listar usuarios con filtros, orden y paginación (solo admin)
     */
    public function index(Request $request)
    {
        $this->authorizeAdmin($request);

        $estado = $request->query('estado');
        $rol = $request->query('rol');
        $buscar = $request->query('buscar');
        $orden = $request->query('orden', 'desc');
        $perPage = $request->query('per_page', 10);

        $query = User::query()
            ->when($estado, fn($q) => $q->where('estado', $estado))
            ->when($rol, fn($q) => $q->where('rol', $rol))
            ->when($buscar, fn($q) => 
                $q->where(function ($q) use ($buscar) {
                    $q->where('name', 'like', "%$buscar%")
                      ->orWhere('email', 'like', "%$buscar%");
                })
            )
            ->orderBy('created_at', $orden);

        $usuarios = $query->paginate($perPage);

        return response()->json([
            'message' => 'Lista de usuarios',
            'total' => $usuarios->total(),
            'usuarios' => $usuarios
        ]);
    }

    /**
     * 🔹 Activar o desactivar usuario
     */
    public function cambiarEstado(Request $request, $id)
    {
        $this->authorizeAdmin($request);

        $user = User::findOrFail($id);
        $user->estado = $user->estado === 'activo' ? 'inactivo' : 'activo';
        $user->save();

        return response()->json([
            'message' => "Estado del usuario cambiado a {$user->estado}",
            'user' => $user
        ]);
    }

    /**
     * 🔹 Actualizar perfil (nombre, contraseña)
     */
    public function actualizarPerfil(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'password' => 'sometimes|string|min:8|confirmed',
        ]);

        if ($request->filled('name')) {
            $user->name = strtoupper($request->name);
        }

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'message' => 'Perfil actualizado correctamente',
            'user' => $user
        ]);
    }

    /**
     * 🔹 Verificación de rol admin
     */
    private function authorizeAdmin(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->rol !== 'admin') {
            abort(response()->json(['message' => 'Acceso denegado: solo el administrador puede realizar esta acción'], 403));
        }
    }
}
