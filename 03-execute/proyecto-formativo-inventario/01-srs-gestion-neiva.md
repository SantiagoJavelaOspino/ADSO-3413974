# Especificación de Requisitos de Software (SRS) — Gestión Neiva (Insumo Base)

- **Proyecto:** Gestión Neiva — Sistema POS SaaS Multi-Tenant e Inventario Inteligente para Micro-Negocios de Barrio
- **Origen:** Consolidado de `docs/srs/SRS_MVP_v1.md` y `docs/spec/spec.md` del repositorio del equipo (`https://github.com/Tomasberserk/GESTION_INVENTARIO_INTELIGENTE`).
- **Versión base:** 1.0 (anonimizada para repositorio público).

---

## 1. Planteamiento del problema y propósito

Los micro-negocios y tiendas de barrio en Neiva enfrentan pérdidas recurrentes por control manual de inventarios, caducidad de productos perecederos sin alerta temprana, quiebres de stock en productos de alta rotación, errores de cobro en caja y desconocimiento de la utilidad neta diaria real.

**Objetivo general:** Proveer una plataforma web responsiva (PWA) SaaS multi-tenant de punto de venta (POS) e inventario inteligente que permita administrar existencias, registrar ventas con descuento atómico de stock, recibir alertas de vencimiento y stock mínimo, y consultar la rentabilidad diaria desde dispositivos móviles o de escritorio.

## 2. Actores identificados

| Actor | Tipo | Descripción |
|---|---|---|
| **Administrador de Tienda (Tendero)** | Primario | Gestiona el catálogo de productos, categorías, proveedores, reabastecimientos, usuarios cajeros y consulta el panel financiero y alertas. |
| **Cajero / Ayudante** | Primario | Opera el terminal POS para consultar productos (texto o código de barras) y registrar ventas con distintos medios de pago. |
| **Superadministrador SaaS** | Primario | Registra y administra las tiendas (tenants) suscritas a la plataforma y supervisa el estado de suscripción. |
| **Planificador Automático (Temporizador)** | Primario (Iniciador de sistema) | Dispara periódicamente la verificación de stock mínimo y fechas de vencimiento próximas (≤ 15 días) para generar alertas. |
| **Servicio de Exportación / Notificaciones** | Secundario | Recibe los datos consolidados para generar archivos de hoja de cálculo (cuadre de caja) o despachar avisos de alerta. |

## 3. Requisitos Funcionales (RF)

| ID | Nombre | Descripción funcional |
|---|---|---|
| **RF-01** | Gestión de tiendas (tenants) | Permitir al Superadministrador registrar, consultar y activar/suspender tiendas con NIT único, razón social y estado de suscripción. |
| **RF-02** | Gestión de usuarios y roles | Permitir al Administrador registrar y administrar usuarios de su tienda con roles diferenciados (Administrador, Cajero), credenciales seguras y uno o más teléfonos de contacto. |
| **RF-03** | Gestión de categorías y proveedores | Permitir al Administrador crear y organizar categorías jerárquicas (categoría padre y subcategorías) y gestionar el directorio de proveedores de abastecimiento. |
| **RF-04** | Gestión del catálogo de productos | Permitir al Administrador registrar y actualizar productos con código de barras (EAN/UPC), categoría, precio de costo, precio de venta, unidad de medida (unidad o granel), stock mínimo, stock actual y baja lógica (`is_active`). |
| **RF-05** | Consulta rápida de catálogo en POS | Permitir al Cajero buscar productos activos de su tienda por nombre o escaneo de código de barras, visualizando precio vigente y existencias disponibles. |
| **RF-06** | Registro de venta en punto de venta (POS) | Permitir al Cajero armar un carrito con múltiples productos (unidades o fracciones a granel), seleccionar medio de pago (Efectivo, Nequi, Tarjeta), aplicar política de descuento vigente y confirmar la venta descontando el stock de forma atómica. |
| **RF-07** | Registro histórico inmutable de líneas de venta | Conservar en cada detalle de venta una instantánea (snapshot) del nombre del producto y precio unitario al momento del cobro, calculando el total de la venta de forma derivada. |
| **RF-08** | Registro de reabastecimiento y lotes | Permitir al Administrador registrar compras a proveedores ingresando cantidades, costo unitario y lotes con fecha de vencimiento, incrementando automáticamente el stock disponible. |
| **RF-09** | Generación automática de alertas | Detectar automáticamente productos cuyo stock sea menor o igual al stock mínimo y lotes con fecha de vencimiento a 15 días o menos, registrando alertas consultables por el Administrador. |
| **RF-10** | Panel financiero y exportación de cuadre | Mostrar al Administrador el resumen de ventas, ingresos, utilidad neta estimada y alertas activas por rango de fechas, y permitir exportar el cuadre de caja a hoja de cálculo. |

## 4. Requisitos No Funcionales (RNF)

| ID | Categoría | Descripción y métrica verificable |
|---|---|---|
| **RNF-01** | Seguridad y aislamiento multi-tenant | El 100 % de las operaciones filtra obligatoriamente por `tenant_id` extraído del token JWT; contraseñas almacenadas con hash y sal (Argon2id/bcrypt) y comunicaciones cifradas mediante TLS 1.3 (HTTPS). |
| **RNF-02** | Rendimiento y latencia POS | Las búsquedas por código de barras y la confirmación de ventas responden en ≤ 1.5 segundos con hasta 50 usuarios concurrentes bajo conectividad móvil. |
| **RNF-03** | Integridad transaccional y concurrencia | Cero sobreventas (stock ≥ 0 en todo momento) mediante transacciones ACID y bloqueo de fila ordenado por ID (`SELECT ... FOR UPDATE`) en confirmaciones simultáneas. |
| **RNF-04** | Disponibilidad y respaldo | Disponibilidad operativa ≥ 99.5 % en horario comercial (6:00 a. m. – 10:00 p. m.), con respaldo automático diario de la base de datos y prueba mensual de restauración. |
| **RNF-05** | Usabilidad móvil y mantenibilidad | Interfaz web responsiva (PWA) usable desde celular en redes móviles y arquitectura modular desacoplada por capas para incorporar nuevas reglas sin afectar el núcleo POS. |

## 5. Reglas de negocio principales (RN)

| Código | Regla | Descripción |
|---|---|---|
| **RN-01** | No negatividad de stock | Ninguna venta puede dejar el stock de un producto por debajo de cero. |
| **RN-02** | Inmutabilidad de precios | El precio y nombre guardados en el detalle de venta nunca cambian aunque el producto se edite después. |
| **RN-03** | Aislamiento Multi-Tenant | Ningún usuario puede leer ni modificar registros pertenecientes a otra tienda. |
| **RN-04** | Transaccionalidad atómica | La cabecera de venta, sus detalles y el descuento de stock se confirman o revierten como una sola unidad. |
| **RN-05** | Baja lógica | Productos o usuarios con historial transaccional no se eliminan físicamente; se desactivan (`is_active = false`). |
| **RN-06** | Totales derivados | El total de una venta se calcula como la suma de `cantidad × precio_unitario` de sus líneas de detalle. |
| **RN-07** | Umbral de vencimiento | Un lote genera alerta de vencimiento próximo cuando faltan 15 días calendario o menos para su fecha de caducidad. |
