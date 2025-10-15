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

    // Obtener carrito activo
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

    // Agregar producto
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
            'message' => 'Producto agregado al carrito',
            'session_id' => $carrito->session_id,
            'carrito' => $carrito
        ]);
    }

    // Actualizar cantidad
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

        return response()->json(['message' => 'Cantidad actualizada', 'detalle' => $detalle]);
    }

    // Eliminar producto
    public function eliminarProducto($id, $producto_id)
    {
        $carrito = Carrito::findOrFail($id);
        $this->carritoService->removeItem($carrito, $producto_id);

        return response()->json(['message' => 'Producto eliminado del carrito']);
    }

    // Vaciar carrito
    public function vaciarCarrito($id)
    {
        $carrito = Carrito::findOrFail($id);
        $this->carritoService->clearCart($carrito);

        return response()->json(['message' => 'Carrito vaciado']);
    }

    // Mostrar carrito
    public function mostrar($id)
    {
        $carrito = Carrito::with('detalles.producto')->findOrFail($id);
        return response()->json($carrito);
    }

    // Listar carritos (con filtros y paginación)
    public function index(Request $request)
    {
        // Filtros opcionales
        $estado = $request->query('estado');        // activo, expirado, completado, etc.
        $sessionId = $request->query('session_id');
        $userId = $request->query('user_id');
    
        // Construcción dinámica de la query
        $query = Carrito::with(['detalles.producto'])
            ->when($estado, fn($q) => $q->where('estado', $estado))
            ->when($sessionId, fn($q) => $q->where('session_id', $sessionId))
            ->when($userId, fn($q) => $q->where('user_id', $userId))
            ->orderByDesc('updated_at');
    
        // Paginación (10 por defecto)
        $perPage = $request->query('per_page', 10);
        $carritos = $query->paginate($perPage);
    
        // Resumen general (para dashboard o estadísticas)
        $resumen = [
            'total' => Carrito::count(),
            'activos' => Carrito::where('estado', 'activo')->count(),
            'expirados' => Carrito::where('estado', 'expirado')->count(),
            'vacios' => Carrito::doesntHave('detalles')->count(),
        ];
    
        return response()->json([
            'filtros' => [
                'estado' => $estado,
                'session_id' => $sessionId,
                'user_id' => $userId,
            ],
            'resumen' => $resumen,
            'carritos' => $carritos
        ]);
    }

}
