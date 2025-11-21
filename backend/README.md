# 🧱 E-Commerce Biker Wolf Perú — Backend (v1.2)

> **Versión mejorada y optimizada** del sistema backend para la gestión del e-commerce y catálogo digital de **Biker Wolf Perú**.  
> Desarrollado con **Laravel 12 + Sanctum** para autenticación segura y control de acceso basado en roles.

---

## 🚀 Descripción General

El backend provee una **API RESTful** robusta y escalable que permite manejar usuarios, productos, categorías, promociones, carrito de compras, pedidos, reseñas y mensajes de contacto.  
Incluye **paginación, validaciones uniformes y normalización de datos (mayúsculas automáticas)** para asegurar consistencia en la base de datos.

El diseño está optimizado para integrarse con frontends en **React, Vue, Next.js** u otros frameworks modernos.

---

## 🧩 Arquitectura y Tecnologías

| Componente | Tecnología / Descripción |
|-------------|--------------------------|
| **Framework** | Laravel 12 |
| **Base de datos** | MySQL |
| **Autenticación** | Laravel Sanctum (Tokens API) |
| **Control de acceso** | Middleware `auth:sanctum` y `admin` |
| **Formato de datos** | JSON |
| **Gestión de imágenes** | Almacenamiento local/public |
| **Paginación estándar** | Laravel Paginator (`?page=` y `?per_page=`) |
| **Versionamiento API** | v1 — rutas base `/api/...` |
| **Normalización de datos** | Conversión automática a **mayúsculas** en modelos clave |

---

## ⚙️ Instalación

```bash
# 1️⃣ Clonar el repositorio
git clone https://github.com/Diego-pcw/ecommerce.git
cd e-commerce_web/backend

# 2️⃣ Instalar dependencias
composer install

# 3️⃣ Copiar y configurar el archivo .env
cp .env.example .env

Actualizar variables principales:

APP_NAME=BikerWolf
APP_URL=http://127.0.0.1:8000
DB_DATABASE=ecommerce
DB_USERNAME=root
DB_PASSWORD=

# 4️⃣ Generar clave y migraciones
php artisan key:generate
php artisan migrate --seed

# 5️⃣ Iniciar el servidor local
php artisan serve

🧠 Roles de Usuario
Rol	Descripción

Admin	- Control total del sistema (CRUD de productos, categorías, promociones, pedidos, reseñas, mensajes, etc.)
Cliente	- Puede registrarse, autenticarse, ver productos, realizar pedidos, dejar reseñas y enviar mensajes de contacto

🔐 Autenticación

La autenticación se maneja con Laravel Sanctum.
Cada endpoint protegido requiere un token de usuario enviado en los headers:

Authorization: Bearer {TOKEN_DEL_USUARIO}

📚 Endpoints Principales
🧍 Usuarios
Método	Endpoint	Descripción
POST	/api/register	Registro de usuario
POST	/api/login	Inicio de sesión
POST	/api/logout	Cierre de sesión
GET	/api/profile	Perfil del usuario autenticado
PUT /api/profile/actualizar permite actualizar nombre o contraseña del usuario autenticado
GET /api/usuarios lista usuarios con filtros y paginación (admin)
PUT /api/usuarios/{id}/estado alterna entre activo/inactivo (admin)

🗂️ Categorías
Método	Endpoint	Descripción
GET	/api/categorias	Listar categorías (con paginación)
GET	/api/categorias/{id}	Ver una categoría
POST	/api/categorias	Crear categoría (admin)
PUT	/api/categorias/{id}	Actualizar categoría (admin)
DELETE	/api/categorias/{id}	Eliminar categoría (admin)

🧠 Nota: Los nombres de categorías se almacenan automáticamente en mayúsculas.

🛍️ Productos
Método	Endpoint	Descripción
GET	/api/productos	Listar productos (con paginación y filtros)
GET	/api/productos/{id}	Ver un producto
POST	/api/productos	Crear producto (admin)
PUT	/api/productos/{id}	Actualizar producto (admin)
DELETE	/api/productos/{id}	Eliminar producto (admin)

📦 Datos en mayúsculas y con relación automática a su categoría.
Incluye soporte de búsqueda (?search=) y filtrado por categoría (?categoria_id=).

🖼️ Imágenes de Productos
Método	Endpoint	Descripción
GET	/api/imagenes/producto/{producto_id}	Ver imágenes de un producto
POST	/api/imagenes	Subir imagen (admin)
PUT	/api/imagenes/{id}	Actualizar imagen (admin)
DELETE	/api/imagenes/{id}	Eliminar imagen (admin)

🎯 Promociones
Método	Endpoint	Descripción
GET	/api/promociones	Ver promociones activas
POST	/api/promociones	Crear promoción (admin)
PUT	/api/promociones/{id}	Actualizar promoción (admin)
DELETE	/api/promociones/{id}	Eliminar promoción (admin)
POST	/api/promociones/{id}/asignar	Asignar productos a promoción (admin)

📌 Descuentos automáticos aplicados en pedidos.

🛒 Carrito
Método	Endpoint	Descripción
GET	/api/carrito	Ver carrito actual
POST	/api/carrito/agregar	Agregar producto al carrito
PUT	/api/carrito/{id}/actualizar	Actualizar cantidad
DELETE	/api/carrito/{id}/eliminar/{producto_id}	Eliminar producto
DELETE	/api/carrito/{id}/vaciar	Vaciar carrito

🧮 Calcula subtotales y aplica descuentos si corresponden.

📦 Pedidos
Método	Endpoint	Descripción
GET	/api/pedidos	Listar pedidos del usuario autenticado (con paginación)
POST	/api/pedidos	Crear pedido desde el carrito (con descuento automático)
GET	/api/pedidos/{id}	Ver detalle de un pedido
PUT	/api/pedidos/{id}	Actualizar pedido (admin o asesor)
DELETE	/api/pedidos/{id}	Eliminar pedido (admin)

🧠 Los datos de dirección y método de pago se almacenan como JSON (shipping_address, payment_method).

🧾 Detalles del Pedido
Método	Endpoint	Descripción
GET	/api/pedidos/{pedido}/detalles	Ver detalles de un pedido
POST	/api/pedidos/{pedido}/detalles	Agregar ítem (admin)
PUT	/api/pedidos/detalles/{id}	Actualizar ítem (admin)
DELETE	/api/pedidos/detalles/{id}	Eliminar ítem (admin)

💬 Contacto y Reseñas
Método	Endpoint	Descripción
GET	/api/contact-messages	Ver mensajes de contacto (admin)
POST	/api/contact-messages	Enviar mensaje desde formulario
PUT	/api/contact-messages/{id}	Actualizar estado o responder (admin)
DELETE	/api/contact-messages/{id}	Eliminar mensaje (admin)

GET	/api/reseñas	Listar reseñas (paginadas)
POST	/api/reseñas	Crear reseña (usuario autenticado)
PUT	/api/reseñas/{id}	Aprobar/Rechazar (admin)
DELETE	/api/reseñas/{id}	Eliminar reseña (admin)

Estructura del Proyecto

app/
 ├── Http/
 │   ├── Controllers/
 │   │   ├── AuthController.php
 │   │   ├── CategoriaController.php
 │   │   ├── ProductoController.php
 │   │   ├── PedidoController.php
 │   │   ├── CarritoController.php
 │   │   ├── PromocionController.php
 │   │   ├── ContactMessageController.php
 │   │   └── ReseñaController.php
 │   ├── Middleware/
 │   │   ├── AdminMiddleware.php
 │   └── Requests/
 ├── Models/
 │   ├── User.php
 │   ├── Categoria.php
 │   ├── Producto.php
 │   ├── Pedido.php
 │   ├── DetallePedido.php
 │   ├── Promocion.php
 │   ├── Carrito.php
 │   ├── ContactMessage.php
 │   └── Reseña.php
routes/
 ├── api.php
database/
 ├── migrations/
 ├── seeders/
 └── factories/

🧩 Estado del Proyecto
Módulo	Estado	Descripción
Autenticación	✅ Completo	- Tokens, roles, middleware
Productos y Categorías	✅ Completo	- CRUD + mayúsculas + paginación
Promociones	✅ Completo	- Descuentos automáticos
Carrito	✅ Completo	- Funcional por usuario o sesión
Pedidos	✅ Completo	- Cálculo de totales + normalización
Detalles de Pedido	✅ Completo	- Relación y edición controlada
Contacto y Reseñas	✅ Completo	- Moderación y respuesta
Normalización de Datos	✅ - Implementada	Guardado en mayúsculas
Descuento Manual	⚙️ Pendiente	- Para futuras versiones

📅 Versión

v1.2 — Octubre 2025
Autores: Gonzalo & Diego (Desarrolladores Web)

📜 Licencia

Proyecto privado para Biker Wolf Perú.
Todos los derechos reservados © 2025.
Desarrollado en Laravel.