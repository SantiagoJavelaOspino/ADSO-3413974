# B6 · Políticas de Seguridad de los Datos y Matriz de Roles

- **Caso de estudio:** Gestión Neiva — Sistema POS SaaS Multi-Tenant e Inventario Inteligente.
- **Autor:** `@SantiagoJavelaOspino`
- **Cobertura:** 9 políticas concretas (3 por cada principio: Integridad, Confidencialidad, Disponibilidad), tratamiento de datos personales (Ley 1581 de 2012) y matriz de 4 roles contra las 11 tablas del esquema.

---

## 1. Políticas de seguridad sobre el caso (9 políticas — 3 por principio)

| # | Principio | Política concreta aplicada sobre Gestión Neiva | Tablas / componentes protegidos |
|---|---|---|---|
| **P-01** | **Integridad** | Restricciones declarativas `CHECK` en BD (`stock_actual >= 0`, `precio_venta >= 0`, `cantidad > 0`, `porcentaje_descuento BETWEEN 0 AND 50`) y llaves foráneas con `ON DELETE RESTRICT` sobre `producto`, `usuario`, `venta` y `tienda` para impedir borrados huérfanos. | `producto`, `venta`, `detalle_venta`, `compra_reabastecimiento` |
| **P-02** | **Integridad** | Transacciones ACID con bloqueo de fila ordenado (`SELECT ... FOR UPDATE`) en `PosVentaFacade` y baja lógica (`estado_activo = FALSE`) para preservar la inmutabilidad del historial contable y el snapshot de `detalle_venta`. | `producto`, `venta`, `detalle_venta` |
| **P-03** | **Integridad** | Validación estricta del `id_tienda` extraído del token JWT en toda consulta SQL (nunca confiado al parámetro enviado por el cliente) para evitar escritura cruzada entre tiendas. | Todas las tablas con `id_tienda` |
| **P-04** | **Confidencialidad** | Contraseñas almacenadas exclusivamente mediante **hash criptográfico con sal única por usuario (Argon2id)** en `usuario.password_hash` — **nunca** en texto plano ni cifradas de forma reversible. | `usuario` |
| **P-05** | **Confidencialidad** | Todo el tráfico cliente-servidor viaja cifrado mediante **TLS 1.3 (HTTPS puerto 443)** y la base de datos PostgreSQL + caché Redis operan en red privada sin exposición a internet; datos de contacto sensibles (`usuario.correo`, `telefono_usuario.numero`) se cifran en reposo a nivel de volumen/columna y solo se exponen a roles autorizados de la misma tienda. | `usuario`, `telefono_usuario`, `NodoBaseDatosPostgreSQL`, `NodoCacheRedis` |
| **P-06** | **Confidencialidad (Datos personales)** | Cumplimiento de la **Ley 1581 de 2012**: finalidad informada (gestión operativa de cuenta y alertas de tienda), autorización previa y expresa del titular al registrarse, y derecho a actualización o supresión/anonimización de `correo` y `telefono_usuario` conservando la integridad contable. | `usuario`, `telefono_usuario`, `proveedor` |
| **P-07** | **Disponibilidad** | Respaldo automático diario (`pg_dump` cifrado en horario valle 2:00 a. m.) con copia replicada en almacenamiento externo independiente del nodo de base de datos y retención mínima de 30 días. | Esquema completo (11 tablas) |
| **P-08** | **Disponibilidad** | **Prueba mensual de restauración** en entorno aislado de pruebas con acta verificando integridad de filas, llaves foráneas y tiempo objetivo de recuperación (RTO ≤ 30 min, RPO ≤ 24 h). | `NodoBaseDatosPostgreSQL` |
| **P-09** | **Disponibilidad** | Monitoreo continuo mediante endpoint `/health`, política de reinicio automático de contenedores y limitación de tasa (*rate limiting*) en autenticación para sostener disponibilidad ≥ 99.5 % en horario comercial (6:00 a. m. – 10:00 p. m.). | `NodoServidorAplicacion`, `CompAutenticacionRBAC` |

---

## 2. Matriz de roles contra tablas (4 roles × 11 tablas)

> **Alcance de fila:** Para `AdministradorTienda`, `Cajero` y `ServicioAlertas`, todos los permisos aplican **únicamente sobre filas donde `id_tienda` coincide con su contexto autorizado**.

| Tabla | `Superadministrador` | `AdministradorTienda` | `Cajero` | `ServicioAlertas` *(proceso interno)* |
|---|---|---|---|---|
| **`tienda`** | `SELECT, INSERT, UPDATE` | `SELECT` (solo su tienda) | `SELECT` (solo su tienda) | `SELECT` (solo `id_tienda`, `estado_activo`) |
| **`usuario`** | `SELECT, INSERT, UPDATE` | `SELECT, INSERT, UPDATE` (su tienda) | `SELECT` (solo su fila, sin `password_hash`) | Sin acceso |
| **`telefono_usuario`** | `SELECT` | `SELECT, INSERT, UPDATE, DELETE` (su tienda) | `SELECT, UPDATE` (solo suyos) | Sin acceso |
| **`categoria`** | `SELECT` | `SELECT, INSERT, UPDATE` | `SELECT` | Sin acceso |
| **`proveedor`** | `SELECT` | `SELECT, INSERT, UPDATE` | Sin acceso | Sin acceso |
| **`producto`** | `SELECT` | `SELECT, INSERT, UPDATE` | `SELECT, UPDATE` *(solo `stock_actual` vía venta)* | `SELECT` |
| **`lote_producto`** | `SELECT` | `SELECT, INSERT, UPDATE` | `SELECT` | `SELECT` |
| **`venta`** | `SELECT` | `SELECT, INSERT` | `SELECT, INSERT` (propias/turno) | `SELECT` |
| **`detalle_venta`** | `SELECT` | `SELECT, INSERT` | `SELECT, INSERT` | Sin acceso |
| **`compra_reabastecimiento`** | `SELECT` | `SELECT, INSERT` | Sin acceso | Sin acceso |
| **`alerta_inventario`** | `SELECT` | `SELECT, UPDATE` *(marcar atendida)* | `SELECT` | `SELECT, INSERT` |
