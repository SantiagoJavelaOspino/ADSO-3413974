# Matriz Requisito → Caso de Uso y Justificación de Relaciones UML

- **Caso de estudio:** Gestión Neiva — Sistema POS SaaS Multi-Tenant e Inventario Inteligente.
- **Autor:** `@SantiagoJavelaOspino`
- **Cobertura de Requisitos Funcionales:** **10 / 10 (100 %)** — supera el mínimo exigible de 90 %.

---

## 1. Matriz Requisito Funcional (RF) → Caso de Uso (CU)

| ID RF | Requisito funcional (resumen) | Caso(s) de uso que lo atienden | Actor iniciador | Estado de cobertura |
|---|---|---|---|---|
| **RF-01** | Registrar y administrar tiendas (tenants) con NIT único y estado de suscripción | `CU-01 · Gestionar tiendas` | Superadministrador SaaS | Cubierto |
| **RF-02** | Gestionar usuarios de la tienda con roles (Administrador/Cajero) y teléfonos | `CU-02 · Gestionar usuarios y roles` | Administrador de Tienda | Cubierto |
| **RF-03** | Gestionar categorías jerárquicas y directorio de proveedores | `CU-03 · Gestionar categorías y proveedores` | Administrador de Tienda | Cubierto |
| **RF-04** | Gestionar catálogo de productos (EAN, precios, granel, stock mínimo, baja lógica) | `CU-04 · Gestionar catálogo de productos` | Administrador de Tienda | Cubierto |
| **RF-05** | Consultar catálogo en POS por texto o escaneo de código de barras | `CU-05 · Consultar catálogo en POS` | Cajero | Cubierto |
| **RF-06** | Registrar venta POS con carrito, medio de pago, descuento y descuento atómico de stock | `CU-06 · Registrar venta en POS` *(incluye `CU-10 · Validar disponibilidad y descontar stock`; extendido por `CU-11 · Aplicar descuento por volumen`)* | Cajero | Cubierto |
| **RF-07** | Conservar snapshot histórico de nombre/precio en líneas de venta y total derivado | `CU-06 · Registrar venta en POS` | Cajero | Cubierto |
| **RF-08** | Registrar compras/reabastecimientos a proveedores e ingresar lotes con fecha de vencimiento | `CU-07 · Registrar reabastecimiento y lotes` | Administrador de Tienda | Cubierto |
| **RF-09** | Generar alertas automáticas de stock mínimo y vencimiento próximo (≤ 15 días) | `CU-08 · Generar alertas de inventario` | Planificador Automático (Temporizador) | Cubierto |
| **RF-10** | Consultar panel financiero de ventas/utilidad y exportar cuadre de caja a hoja de cálculo | `CU-09 · Consultar panel financiero` *(extendido por `CU-12 · Exportar cuadre de caja`)* | Administrador de Tienda | Cubierto |

> **Nota sobre agrupación CRUD (Regla de arbitraje 1):** Las operaciones de creación, consulta, actualización y baja lógica sobre una misma entidad sin flujos independientes se agrupan en un único caso de uso de objetivo de negocio (`CU-01` a `CU-04`). Se separa `CU-05 · Consultar catálogo en POS` porque atiende a un actor distinto (Cajero) con flujo optimizado de escaneo rápido en caja.

---

## 2. Distinción de Requisitos No Funcionales (RNF)

Los siguientes requisitos **no** se modelan como casos de uso independientes porque representan atributos de calidad transversales del sistema (se verifican en arquitectura, seguridad y diseño de G2):

| ID RNF | Categoría | Restricción transversal |
|---|---|---|
| **RNF-01** | Seguridad / Multi-Tenant | Aislamiento por `tenant_id` en el 100 % de las operaciones, hash+sal en contraseñas y cifrado TLS 1.3. |
| **RNF-02** | Rendimiento | Latencia ≤ 1.5 s en búsqueda por código de barras y cobro POS con 50 usuarios concurrentes. |
| **RNF-03** | Concurrencia e integridad | Cero sobreventas (stock ≥ 0) ante cobros simultáneos mediante transacción atómica y bloqueo de fila. |
| **RNF-04** | Disponibilidad | Disponibilidad ≥ 99.5 % en horario comercial y respaldos diarios con prueba mensual de restauración. |
| **RNF-05** | Usabilidad y mantenibilidad | Interfaz PWA móvil de bajo consumo de datos y arquitectura modular por capas. |

---

## 3. Justificación de relaciones `«include»`, `«extend»` y generalización

| Relación | Origen → Destino | Tipo | Justificación (una línea) |
|---|---|---|---|
| **R-01** | `CU-06 · Registrar venta en POS` `..>` `CU-10 · Validar disponibilidad y descontar stock` | `«include»` | Toda venta confirmada **siempre** obliga a verificar existencias suficientes y descontar atómicamente el inventario antes de cerrar la transacción. |
| **R-02** | `CU-06 · Registrar venta en POS` `..>` `CU-05 · Consultar catálogo en POS` | `«include»` | Para armar cualquier carrito en caja el cajero **siempre** consulta e identifica los productos activos del catálogo de la tienda. |
| **R-03** | `CU-11 · Aplicar descuento por volumen` `..>` `CU-06 · Registrar venta en POS` | `«extend»` | Es una variante **opcional/condicional** (punto de extensión: *antes de calcular total*) que solo se activa si la tienda tiene una promoción activa y la cantidad cumple el umbral. |
| **R-04** | `CU-12 · Exportar cuadre de caja` `..>` `CU-09 · Consultar panel financiero` | `«extend»` | Es una acción **opcional** (punto de extensión: *al visualizar resumen financiero*) que el Administrador solicita únicamente cuando necesita descargar la hoja de cálculo. |
| **R-05** | `Administrador de Tienda` `—▷` `Cajero` *(o herencia de permisos operativos)* | Generalización de actores | El Administrador de Tienda hereda las capacidades operativas de consulta y registro de ventas en caja del Cajero además de sus funciones administrativas propias. |
