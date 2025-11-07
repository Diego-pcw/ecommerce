<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\CarritoService;
use App\Models\Carrito;

class CarritoController extends Controller
{
    protected $carritoService;

    public function __construct(CarritoService $carritoService)
    {
        $this->carritoService = $carritoService;
    }

    // 🔹 Obtener carrito activo (usuario o invitado)
    public function obtenerCarrito(Request $request)
    {
        $user = Auth::user(); // Detecta token Bearer si existe
        $sessionId = $request->header('X-Session-Id');

        $carrito = $this->carritoService->getOrCreateCart($user, $sessionId);

        return response()->json([
            'session_id' => $carrito->session_id,
            'carrito' => $carrito->load('detalles.producto'),
        ]);
    }

    // 🔹 Agregar producto al carrito
    public function agregarProducto(Request $request)
    {
        $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'cantidad' => 'nullable|integer|min:1',
        ]);

        $user = Auth::user();
        $sessionId = $request->header('X-Session-Id');

        $carrito = $this->carritoService->getOrCreateCart($user, $sessionId);
        $carrito = $this->carritoService->addOrUpdateItem(
            $carrito,
            $request->producto_id,
            $request->input('cantidad', 1)
        );

        return response()->json([
            'message' => 'Producto agregado correctamente',
            'session_id' => $carrito->session_id,
            'carrito' => $carrito->load('detalles.producto'),
        ]);
    }

    // 🔹 Actualizar cantidad
    public function actualizarCantidad(Request $request, $id)
    {
        $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'cantidad' => 'required|integer|min:0',
        ]);

        $carrito = Carrito::findOrFail($id);
        $detalle = $this->carritoService->setQuantity(
            $carrito,
            $request->producto_id,
            $request->cantidad
        );

        return response()->json([
            'message' => 'Cantidad actualizada correctamente',
            'detalle' => $detalle,
        ]);
    }

    // 🔹 Eliminar producto del carrito
    public function eliminarProducto($id, $producto_id)
    {
        $carrito = Carrito::findOrFail($id);
        $this->carritoService->removeItem($carrito, $producto_id);

        return response()->json(['message' => 'Producto eliminado del carrito']);
    }

    // 🔹 Vaciar carrito
    public function vaciarCarrito($id)
    {
        $carrito = Carrito::findOrFail($id);
        $this->carritoService->clearCart($carrito);

        return response()->json(['message' => 'Carrito vaciado correctamente']);
    }

    // 🔹 Mostrar carrito completo con total
    public function mostrar($id)
    {
        $carrito = Carrito::with(['detalles.producto', 'usuario'])->findOrFail($id);

        return response()->json([
            'carrito' => $carrito,
            'total' => $carrito->total,
            'esta_vacio' => $carrito->esta_vacio,
        ]);
    }

    // 🔹 Listar todos los carritos (solo admin)
    public function index(Request $request)
    {
        $estado = $request->query('estado');
        $sessionId = $request->query('session_id');
        $userId = $request->query('user_id');
        $sort = $request->query('sort', 'updated_at,desc');
        [$sortField, $sortDir] = explode(',', $sort) + [null, 'desc'];

        $query = Carrito::with(['detalles.producto', 'usuario'])
            ->when($estado, fn($q) => $q->where('estado', $estado))
            ->when($sessionId, fn($q) => $q->where('session_id', $sessionId))
            ->when($userId, fn($q) => $q->where('user_id', $userId))
            ->orderBy($sortField, $sortDir === 'asc' ? 'asc' : 'desc');

        $perPage = $request->query('per_page', 10);
        $carritos = $query->paginate($perPage);

        $resumen = [
            'total' => Carrito::count(),
            'activos' => Carrito::where('estado', 'activo')->count(),
            'expirados' => Carrito::where('estado', 'expirado')->count(),
            'fusionados' => Carrito::where('estado', 'fusionado')->count(),
            'vacios' => Carrito::doesntHave('detalles')->count(),
        ];

        return response()->json([
            'filtros' => compact('estado', 'sessionId', 'userId'),
            'resumen' => $resumen,
            'orden' => ['campo' => $sortField, 'direccion' => $sortDir],
            'carritos' => $carritos,
        ]);
    }

    // 🔹 Fusionar carrito invitado con el de usuario autenticado
    public function fusionarCarrito(Request $request)
    {
        $user = $request->user(); // Viene del token Bearer
        $sessionId = $request->input('session_id');

        if (!$user || !$sessionId) {
            return response()->json(['message' => 'No autorizado o sesión inválida'], 401);
        }

        // Buscar carrito de sesión (invitado)
        $carritoSesion = Carrito::where('session_id', $sessionId)
            ->where('estado', 'activo')
            ->first();

        if (!$carritoSesion) {
            return response()->json(['message' => 'No se encontró carrito de sesión'], 404);
        }

        // Buscar o crear carrito del usuario autenticado
        $carritoUsuario = Carrito::firstOrCreate(
            ['user_id' => $user->id, 'estado' => 'activo'],
            ['expires_at' => now()->addDays(7)]
        );

        // Fusionar los detalles del carrito invitado
        foreach ($carritoSesion->detalles as $detalle) {
            $detalleExistente = $carritoUsuario->detalles()
                ->where('producto_id', $detalle->producto_id)
                ->first();

            if ($detalleExistente) {
                $detalleExistente->cantidad += $detalle->cantidad;
                $detalleExistente->save();
            } else {
                $carritoUsuario->detalles()->create([
                    'producto_id' => $detalle->producto_id,
                    'cantidad' => $detalle->cantidad,
                    'precio_unitario' => $detalle->precio_unitario,
                ]);
            }
        }

        // ✅ Marcar el carrito invitado como fusionado
        $carritoSesion->update(['estado' => 'fusionado']);
        $carritoUsuario->update(['expires_at' => now()->addDays(7)]);

        return response()->json([
            'message' => 'Carrito fusionado correctamente',
            'carrito' => $carritoUsuario->load('detalles.producto'),
        ]);
    }
}
