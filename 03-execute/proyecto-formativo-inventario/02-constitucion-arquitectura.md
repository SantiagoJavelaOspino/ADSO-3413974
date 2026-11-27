# Constitución de Arquitectura y Decisiones Base (Insumo)

- **Origen:** Consolidado de `docs/spec/constitution.md`, `docs/spec/adr/adr-001-aislamiento-multitenant.md` y `docs/spec/adr/adr-002-concurrencia-inventario-pos.md` en `https://github.com/Tomasberserk/GESTION_INVENTARIO_INTELIGENTE`.

## Principios arquitectónicos vigentes

1. **Aislamiento Multi-Tenant Estricto (ADR-001):** Base de datos relacional compartida con columna discriminadora `id_tienda` (`tenant_id`) obligatoria en las tablas de negocio e inyección de contexto desde token JWT verificado. Se descartaron «BD por tienda» (alto costo de migraciones) y «esquema por tienda» (sobrecarga de conexiones).
2. **Pureza de la Lógica de Negocio:** Las reglas de cálculo de ventas, descuentos, stock y alertas residen en servicios de dominio desacoplados del framework HTTP.
3. **Principio del Snapshot:** Cada línea de venta congela nombre y precio unitario del producto en el instante de la transacción.
4. **Cálculo Derivado de Totales:** El total de venta se obtiene agregando sus líneas hijas para evitar desincronizaciones.
5. **Baja Lógica (Soft Delete):** Entidades con historial transaccional se marcan inactivas sin borrado físico.
6. **Control de Concurrencia en POS (ADR-002):** Transacción corta con bloqueo pesimista a nivel de fila (`SELECT ... FOR UPDATE`) ordenado determinísticamente por identificador de producto para prevenir sobreventas y *deadlocks*.
7. **Cero Secretos en Código:** Claves JWT y credenciales de BD/caché se gestionan mediante variables de entorno fuera del repositorio.
