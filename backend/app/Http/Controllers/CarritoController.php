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
        $user = Auth::user();
        $sessionId = $request->header('X-Session-Id');

        $carrito = $this->carritoService->getOrCreateCart($user, $sessionId);

        return response()->json([
            'session_id' => $carrito->session_id,
            'carrito' => $carrito->load('detalles.producto')
        ]);
    }

    // 🔹 Agregar producto
    public function agregarProducto(Request $request)
    {
        $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'cantidad' => 'nullable|integer|min:1'
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
            'message' => 'Producto agregado al carrito correctamente',
            'session_id' => $carrito->session_id,
            'carrito' => $carrito->load('detalles.producto')
        ]);
    }

    // 🔹 Actualizar cantidad
    public function actualizarCantidad(Request $request, $id)
    {
        $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'cantidad' => 'required|integer|min:0'
        ]);

        $carrito = Carrito::findOrFail($id);
        $detalle = $this->carritoService->setQuantity(
            $carrito,
            $request->producto_id,
            $request->cantidad
        );

        return response()->json(['message' => 'Cantidad actualizada correctamente', 'detalle' => $detalle]);
    }

    // 🔹 Eliminar producto
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

    // 🔹 Mostrar carrito con total
    public function mostrar($id)
    {
        $carrito = Carrito::with('detalles.producto')->findOrFail($id);

        return response()->json([
            'carrito' => $carrito,
            'total' => $carrito->total,
            'esta_vacio' => $carrito->esta_vacio,
        ]);
    }

    // 🔹 Listar carritos (admin dashboard)
    public function index(Request $request)
    {
        $estado = $request->query('estado');
        $sessionId = $request->query('session_id');
        $userId = $request->query('user_id');
        $sort = $request->query('sort', 'updated_at,desc');
        [$sortField, $sortDir] = explode(',', $sort) + [null, 'desc'];

        $query = Carrito::with(['detalles.producto'])
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
            'vacios' => Carrito::doesntHave('detalles')->count(),
        ];

        return response()->json([
            'filtros' => compact('estado', 'sessionId', 'userId'),
            'resumen' => $resumen,
            'orden' => ['campo' => $sortField, 'direccion' => $sortDir],
            'carritos' => $carritos
        ]);
    }
}
