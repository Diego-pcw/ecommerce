
# 🧱 E-Commerce Biker Wolf Perú — Backend (v1.0)

> **Versión estable inicial** del sistema backend para la gestión del e-commerce y catálogo digital de Biker Wolf Perú.  
> Desarrollado con **Laravel 11 + Sanctum** para autenticación y protección de rutas API.

---

## 🚀 Descripción General

Este backend provee una **API RESTful** para manejar usuarios, productos, categorías, promociones, carrito de compras, pedidos, reseñas y mensajes de contacto.  
Su diseño modular permite la integración con un frontend (React, Vue, u otro) y está preparado para futuras ampliaciones.

---

## 🧩 Arquitectura y Tecnologías

- **Framework:** Laravel 11  
- **Base de datos:** MySQL
- **Autenticación:** Laravel Sanctum (Tokens API)  
- **Control de acceso:** Middleware `auth:sanctum` y `admin`  
- **Formato de datos:** JSON  
- **Gestión de imágenes:** almacenamiento local/public  
- **Versionamiento:** API v1 (rutas `/api/...`)

---

## ⚙️ Instalación

1. Clonar el repositorio:
   git clone https://github.com/usuario/ecommerce-ferreteria-backend.git
   cd e-commerce-web
Instalar dependencias:

composer install
Copiar y configurar el archivo .env:

cp .env.example .env
Luego actualizar las variables:

env
APP_NAME=FerreteriaSantaCruz
APP_URL=http://127.0.0.1:8000
DB_DATABASE=ferreteria_db
DB_USERNAME=root
DB_PASSWORD=
Generar key y migraciones:

php artisan key:generate
php artisan migrate --seed
Iniciar el servidor:

php artisan serve
🧠 Roles de Usuario
Rol	Descripción
Admin	Control total del sistema (CRUD completo de productos, categorías, promociones, pedidos, reseñas, mensajes, etc.)
Cliente	Puede registrarse, autenticarse, ver productos, realizar pedidos, dejar reseñas y enviar mensajes de contacto

🔐 Autenticación
Laravel Sanctum se utiliza para generar y validar tokens de sesión.
Cada endpoint protegido requiere un header de autorización:

http
Authorization: Bearer {TOKEN_DEL_USUARIO}
📚 Endpoints Principales
🧍 Usuarios
Método	Endpoint	Descripción
POST	/api/register	Registro de usuario
POST	/api/login	Inicio de sesión
POST	/api/logout	Cierre de sesión (token)
GET	/api/profile	Datos del usuario autenticado

🗂️ Categorías
Método	Endpoint	Descripción
GET	/api/categorias	Listar todas las categorías
GET	/api/categorias/{id}	Ver una categoría
POST	/api/categorias	Crear categoría (admin)
PUT	/api/categorias/{id}	Actualizar categoría (admin)
DELETE	/api/categorias/{id}	Eliminar categoría (admin)

🛍️ Productos
Método	Endpoint	Descripción
GET	/api/productos	Listar productos
GET	/api/productos/{id}	Ver producto individual
POST	/api/productos	Crear producto (admin)
PUT	/api/productos/{id}	Actualizar producto (admin)
DELETE	/api/productos/{id}	Eliminar producto (admin)

🖼️ Imágenes
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
POST	/api/promociones/{id}/asignar	Asignar productos (admin)

🛒 Carrito
Método	Endpoint	Descripción
GET	/api/carrito	Ver carrito
POST	/api/carrito/agregar	Agregar producto
PUT	/api/carrito/{id}/actualizar	Actualizar cantidad
DELETE	/api/carrito/{id}/eliminar/{producto_id}	Eliminar producto
DELETE	/api/carrito/{id}/vaciar	Vaciar carrito

📦 Pedidos
Método	Endpoint	Descripción
GET	/api/pedidos	Listar pedidos del usuario
POST	/api/pedidos	Crear pedido (calcula descuentos automáticos)
GET	/api/pedidos/{id}	Ver detalle del pedido
PUT	/api/pedidos/{id}	Actualizar pedido (admin)
DELETE	/api/pedidos/{id}	Eliminar pedido (admin)

🧾 Detalles del Pedido
Método	Endpoint	Descripción
GET	/api/pedidos/{pedido}/detalles	Ver detalles de un pedido
POST	/api/pedidos/{pedido}/detalles	Agregar ítem (admin)
PUT	/api/pedidos/detalles/{id}	Actualizar ítem (admin)
DELETE	/api/pedidos/detalles/{id}	Eliminar ítem (admin)

💬 Contacto y Reseñas
Método	Endpoint	Descripción
GET	/api/contact-messages	Ver mensajes (autenticado o admin)
POST	/api/contact-messages	Enviar mensaje
PUT	/api/contact-messages/{id}	Actualizar estado o responder (admin)
DELETE	/api/contact-messages/{id}	Eliminar (admin)
GET	/api/reseñas	Listar reseñas
POST	/api/reseñas	Crear reseña (usuario autenticado)
PUT	/api/reseñas/{id}	Aprobar/Rechazar (admin)
DELETE	/api/reseñas/{id}	Eliminar (admin)

🧱 Estructura del Proyecto
Copiar código
app/
 ├── Http/
 │   ├── Controllers/
 │   │   ├── AuthController.php
 │   │   ├── CategoriaController.php
 │   │   ├── ProductoController.php
 │   │   ├── PedidoController.php
 │   │   ├── DetallePedidoController.php
 │   │   ├── ...
 │   ├── Middleware/
 │   │   ├── AdminMiddleware.php
 │   └── Requests/
 ├── Models/
 │   ├── User.php
 │   ├── Producto.php
 │   ├── Pedido.php
 │   ├── DetallePedido.php
 │   ├── Promocion.php
 │   └── ...
routes/
 ├── api.php
database/
 ├── migrations/
 ├── seeders/
 └── factories/
 
🧩 Estado del Proyecto
Módulo	Estado	Descripción
Autenticación	✅ Completo - Tokens, roles, protección de rutas
Productos y Categorías	✅ - Completo	CRUD con permisos
Promociones	✅ Completo	- Descuentos automáticos
Carrito	✅ Completo	- Funcional con session_id
Pedidos y Detalles	✅ Completo	- Cálculo de totales con descuento
Contacto y Reseñas	✅ Completo	- Gestión y moderación
Descuento manual	⚙️ Pendiente	- Implementación futura (opcional)

📅 Versión
v1.0 - Octubre 2025
Desarrollado por Gonzalo y Diego [Desarrollador Web e IA]

📜 Licencia
Proyecto privado para Biker Wolf Perú.
Todos los derechos reservados © 2025.