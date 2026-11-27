# Modelo de Datos Base (Insumo Inicial del Equipo)

- **Origen:** Extracto de `docs/spec/data-model.md` en `https://github.com/Tomasberserk/GESTION_INVENTARIO_INTELIGENTE`.
- **Motor base:** PostgreSQL 16 (relacional).

## Tablas iniciales del MVP (antes del modelado completo de G1 y G2)

1. **`tenants`**: `id`, `nombre`, `nit` (UNIQUE), `is_active`, `created_at`.
2. **`productos`**: `id`, `tenant_id` (FK), `codigo_barras`, `nombre`, `precio` (>= 0), `costo` (>= 0), `stock` (>= 0), `is_active`, `version`, `created_at`, `updated_at`.
3. **`ventas`**: `id`, `tenant_id` (FK), `usuario_id` (FK), `cliente_id` (FK opcional), `medio_pago`, `fecha_venta`, `created_at`.
4. **`detalles_venta`**: `id`, `tenant_id` (FK), `venta_id` (FK ON DELETE CASCADE), `producto_id` (FK), `nombre_historico`, `precio_unitario` (>= 0), `cantidad` (> 0).

> **Nota para G1 y G2:** Este insumo inicial cubre únicamente 4 tablas del núcleo POS. En las entregas individuales de G1-P2 y G2-P2 se amplía y normaliza el modelo a 9 entidades conceptuales y 11 tablas relacionales en 3FN (incorporando `usuario`, `telefono_usuario`, `categoria` recursiva, `proveedor`, `lote_producto`, `compra_reabastecimiento` y `alerta_inventario`).
