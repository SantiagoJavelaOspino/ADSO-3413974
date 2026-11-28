# Matriz de Trazabilidad Requisito → Artefactos de Análisis (Anexo C)

- **Caso de estudio:** Gestión Neiva — Sistema POS SaaS Multi-Tenant e Inventario Inteligente.
- **Autor:** `@SantiagoJavelaOspino`
- **Cobertura de trazabilidad:** **10 / 10 Requisitos Funcionales (100 %)** trazados hasta caso de uso, modelo de dominio y entidad del MER (y hasta actividades, plantilla y pantalla en los casos críticos).

| Requisito | Caso de uso | Diagrama de actividades | Plantilla extendida | Clase(s) de dominio | Entidad(es) del MER | Pantalla del prototipo |
|---|---|---|---|---|---|---|
| **RF-01** | `CU-01 · Gestionar tiendas` | No crítico (CRUD agrupado) | No crítico | `Tienda` | `TIENDA` | No crítico |
| **RF-02** | `CU-02 · Gestionar usuarios y roles` | No crítico (CRUD agrupado) | No crítico | `Usuario`, `Administrador`, `Cajero` | `USUARIO` | No crítico |
| **RF-03** | `CU-03 · Gestionar categorías y proveedores` | No crítico (CRUD agrupado) | No crítico | `Categoria` (recursiva), `Proveedor` | `CATEGORIA`, `PROVEEDOR` | Pantalla 2 (`#cu-07`, selector proveedor) |
| **RF-04** | `CU-04 · Gestionar catálogo de productos` | No crítico (CRUD agrupado) | `CU-07` (referenciado) | `Producto`, `Categoria` | `PRODUCTO`, `CATEGORIA` | Pantalla 1 (`#cu-06`) y Pantalla 2 (`#cu-07`) |
| **RF-05** | `CU-05 · Consultar catálogo en POS` | `01a-actividad-venta-pos` | `CU-06` (pasos 1–2, 2a) | `Producto`, `Cajero` | `PRODUCTO`, `TIENDA` | [Pantalla 1 · Terminal POS](./05-prototipo-inicial.html#cu-06) |
| **RF-06** | `CU-06 · Registrar venta en POS` (`CU-10`, `CU-11`) | `01a-actividad-venta-pos` | `CU-06` | `Venta`, `LineaVenta`, `Producto`, `Cajero` | `VENTA`, `DETALLE_VENTA`, `PRODUCTO` | [Pantalla 1 · Terminal POS](./05-prototipo-inicial.html#cu-06) |
| **RF-07** | `CU-06 · Registrar venta en POS` | `01a-actividad-venta-pos` | `CU-06` (paso 7, RN-02, RN-06) | `LineaVenta`, `Venta` | `DETALLE_VENTA`, `VENTA` | [Pantalla 1 · Terminal POS](./05-prototipo-inicial.html#cu-06) |
| **RF-08** | `CU-07 · Registrar reabastecimiento y lotes` | `01b-actividad-reabastecimiento` | `CU-07` | `CompraReabastecimiento`, `LoteProducto`, `Proveedor`, `Producto` | `COMPRA_REABASTECIMIENTO`, `LOTE_PRODUCTO`, `PROVEEDOR`, `PRODUCTO` | [Pantalla 2 · Reabastecimiento](./05-prototipo-inicial.html#cu-07) |
| **RF-09** | `CU-08 · Generar alertas de inventario` | No requerido (flujo en plantilla) | `CU-08` | `AlertaInventario`, `Producto`, `LoteProducto` | `ALERTA_INVENTARIO`, `PRODUCTO`, `LOTE_PRODUCTO` | [Pantalla 3 · Panel y Alertas](./05-prototipo-inicial.html#cu-09) |
| **RF-10** | `CU-09 · Consultar panel financiero` (`CU-12`) | No crítico | Referenciado en `CU-08` | `Venta`, `LineaVenta`, `AlertaInventario` | `VENTA`, `DETALLE_VENTA`, `ALERTA_INVENTARIO` | [Pantalla 3 · Panel y Alertas](./05-prototipo-inicial.html#cu-09) |
