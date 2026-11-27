# A1 · Ficha de Interpretación del Análisis y Plataforma Tecnológica

- **Caso de estudio:** Gestión Neiva — Sistema POS SaaS Multi-Tenant e Inventario Inteligente.
- **Autor:** `@SantiagoJavelaOspino`
- **Insumo base:** [`03-execute/proyecto-formativo-inventario/01-srs-gestion-neiva.md`](../../../../../../03-execute/proyecto-formativo-inventario/01-srs-gestion-neiva.md)

---

## 1. Requisitos interpretados del análisis

### 1.1 Requisitos Funcionales (10 RF)

| ID | Requisito funcional (resumen) |
|---|---|
| **RF-01** | Registrar, consultar y activar/suspender tiendas (tenants) con NIT único y estado de suscripción. |
| **RF-02** | Gestionar usuarios por tienda con roles (Administrador/Cajero), credenciales seguras y múltiples teléfonos. |
| **RF-03** | Gestionar categorías jerárquicas (categoría padre/subcategorías) y proveedores de abastecimiento. |
| **RF-04** | Gestionar catálogo de productos con código de barras (EAN/UPC), precios, unidad/granel, stock mínimo y baja lógica. |
| **RF-05** | Consultar catálogo activo de la tienda en terminal POS por nombre o código de barras. |
| **RF-06** | Registrar ventas en POS con carrito, medio de pago, política de descuento y descuento atómico de inventario. |
| **RF-07** | Guardar snapshot inmutable de nombre y precio unitario en cada línea de venta con total derivado. |
| **RF-08** | Registrar compras/reabastecimientos a proveedores e ingresar lotes con fecha de vencimiento. |
| **RF-09** | Generar alertas automáticas de stock mínimo (`stock <= stock_minimo`) y vencimiento próximo (≤ 15 días). |
| **RF-10** | Consultar panel financiero de ventas/utilidad por rango de fechas y exportar cuadre de caja. |

### 1.2 Requisitos No Funcionales (5 RNF)

| ID | Categoría | Métrica / Restricción verificable |
|---|---|---|
| **RNF-01** | Seguridad / Multi-Tenant | 100 % consultas filtradas por `id_tienda` desde JWT; contraseñas con hash+sal (Argon2id); tráfico TLS 1.3 (HTTPS 443). |
| **RNF-02** | Rendimiento POS | Búsqueda por código de barras y cobro en ≤ 1.5 s con hasta 50 usuarios concurrentes en red móvil. |
| **RNF-03** | Integridad y concurrencia | Cero sobreventas (stock ≥ 0) ante cobros simultáneos mediante transacción ACID y bloqueo de fila (`SELECT ... FOR UPDATE`). |
| **RNF-04** | Disponibilidad y respaldo | Disponibilidad ≥ 99.5 % en horario 6:00 a. m. – 10:00 p. m.; respaldo automático diario y prueba mensual de restauración. |
| **RNF-05** | Usabilidad y mantenibilidad | Interfaz web responsiva (PWA) de bajo consumo de datos y arquitectura modular desacoplada por capas. |

### 1.3 Actores y restricciones del proyecto

- **Actores:** Superadministrador SaaS, Administrador de Tienda (Tendero), Cajero / Ayudante, Planificador Automático (Temporizador) y Servicio de Exportación/Notificaciones.
- **Restricciones:** Equipo pequeño de 3 aprendices; presupuesto acotado de infraestructura en la nube (instancia única multi-tenant); uso principal desde celulares en tiendas con conectividad móvil limitada; cumplimiento de Ley 1581 de 2012 (protección de datos personales en Colombia).

---

## 2. Plataforma tecnológica seleccionada y justificación

| Elemento | Tecnología elegida | Justificación basada en condiciones concretas del caso (≥ 3 condiciones) |
|---|---|---|
| **Lenguaje orientado a objetos (Backend)** | **Python 3.11+ (FastAPI + SQLAlchemy 2.0)** | 1. **Capacidad del equipo:** los 3 aprendices dominan Python y FastAPI dentro del proyecto formativo.<br>2. **Soporte OO y tipado estricto:** clases, interfaces (`Protocol`/`ABC`), herencia y validación con Pydantic permiten aplicar patrones GoF (Estrategia y Fachada) manteniendo el dominio puro.<br>3. **Concurrencia asíncrona (`RNF-02`):** el modelo async de FastAPI y SQLAlchemy 2.0 atiende 50 usuarios concurrentes en un servidor liviano con baja latencia.<br>4. **Ecosistema maduro:** soporte nativo para Argon2id (`RNF-01`), migraciones Alembic y exportación a Excel (`RF-10`). |
| **Tipo de base de datos** | **Relacional (PostgreSQL 16)** | 1. **Integridad transaccional ACID (`RNF-03`):** indispensable para ejecutar venta + snapshot + descuento de stock de forma atómica con bloqueo de fila (`SELECT ... FOR UPDATE`).<br>2. **Estructura relacional fija y rica:** entidades fuertemente relacionadas (`tienda`, `producto`, `venta`, `detalle_venta`, `lote_producto`, `categoria` recursiva) con llaves foráneas y restricciones `CHECK`.<br>3. **Aislamiento multi-tenant eficiente (`RNF-01`):** índices compuestos `(id_tienda, codigo_barras)` garantizan búsquedas en milisegundos sin multiplicar instancias de BD.<br>4. **Respaldo y auditoría (`RNF-04`):** herramientas nativas (`pg_dump`/WAL) permiten respaldos diarios confiables. |
| **Frontend y Caché** | **React 19 (PWA) + Redis 7** | React como PWA evita instalar apps nativas pesadas en celulares de tenderos (`RNF-05`); Redis acelera sesiones JWT y caché de catálogo por tienda (`RNF-02`). |

---

## 3. Lista de entregables de diseño (Guía 2)

- **P1 (Artefactos de diseño):** A1 Ficha y plataforma, A2 Diagrama de clases UML, A3 Aplicación de 2 patrones GoF (Estrategia y Fachada), A4 Arquitectura y tabla de RNF, A5 Vista de componentes, A6 Vista de despliegue, A7 Matriz de trazabilidad.
- **P2 (Modelo de datos y verificación):** B1 Modelo conceptual ajustado, B2 Modelo lógico relacional y cuadro de reglas, B3 Normalización paso a paso (0FN→3FN), B4 Diccionario de datos, B5 Script SQL ejecutado con evidencia, B6 Políticas de seguridad y matriz de roles, B7 Lista de chequeo diligenciada sobre P1 y P2.
