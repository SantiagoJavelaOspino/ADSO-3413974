# A7 · Matriz de Trazabilidad (Análisis → Diseño)

- **Caso de estudio:** Gestión Neiva — Sistema POS SaaS Multi-Tenant e Inventario Inteligente.
- **Autor:** `@SantiagoJavelaOspino`
- **Cobertura:** **10 / 10 RF (100 %)** y **5 / 5 RNF (100 %)** trazados hacia adelante y hacia atrás (ninguna clase ni tabla queda sin requisito).

| Requisito | Clase(s) del diagrama (A2) | Tabla(s) relacional(es) (B2) | Componente(s) (A5) | Decisión / Patrón (A3, A4, A6) |
|---|---|---|---|---|
| **RF-01** | `Tienda` | `tienda` | `CompAutenticacionRBAC`, `CompPersistenciaBD` | Aislamiento por `id_tienda` (ADR-001) |
| **RF-02** | `Usuario`, `Administrador`, `Cajero` | `usuario`, `telefono_usuario` | `CompAutenticacionRBAC`, `CompPersistenciaBD` | Herencia OO + tabla aparte para teléfonos multivaluados |
| **RF-03** | `Categoria`, `Proveedor` | `categoria`, `proveedor` | `CompCatalogoInventario`, `CompPersistenciaBD` | Relación recursiva `id_categoria_padre` |
| **RF-04** | `Producto`, `Categoria` | `producto`, `categoria` | `CompCatalogoInventario`, `CompPersistenciaBD` | Baja lógica (`estado_activo`) + índice `(id_tienda, codigo_barras)` |
| **RF-05** | `Producto`, `Cajero` | `producto`, `tienda` | `InterfazWebPWA`, `CompCatalogoInventario` | Caché Redis por tienda (`RNF-02`) |
| **RF-06** | `PosVentaFacade`, `Venta`, `DetalleVenta`, `Producto`, `IPoliticaDescuento`, `DescuentoSinPromo`, `DescuentoPorVolumen` | `venta`, `detalle_venta`, `producto` | `InterfazWebPWA`, `CompVentasPOS`, `CompCatalogoInventario` | **Patrón Estrategia** + **Patrón Fachada** + bloqueo `FOR UPDATE` |
| **RF-07** | `Venta`, `DetalleVenta` | `venta`, `detalle_venta` | `CompVentasPOS`, `CompPersistenciaBD` | Composición `Venta ◆── DetalleVenta` + snapshot inmutable |
| **RF-08** | `CompraReabastecimiento`, `LoteProducto`, `Proveedor`, `Producto` | `compra_reabastecimiento`, `lote_producto`, `proveedor`, `producto` | `InterfazWebPWA`, `CompCatalogoInventario`, `CompPersistenciaBD` | Entidad débil `lote_producto` con `CHECK` de vencimiento |
| **RF-09** | `AlertaInventario`, `Producto`, `LoteProducto` | `alerta_inventario`, `producto`, `lote_producto` | `CompAlertasReportes`, `CompPersistenciaBD` | Planificador diario + verificación en cierre de venta |
| **RF-10** | `Venta`, `DetalleVenta`, `AlertaInventario` | `venta`, `detalle_venta`, `alerta_inventario` | `InterfazWebPWA`, `CompAlertasReportes` | Consultas agregadas filtradas por `(id_tienda, fecha_venta)` |
| **RNF-01** | `Tienda`, `Usuario` | Todas (`id_tienda` FK), `usuario.password_hash` | `CompAutenticacionRBAC`, `CompPersistenciaBD` | JWT + `id_tienda` + Argon2id (hash+sal) + HTTPS TLS 1.3 |
| **RNF-02** | `Producto` | `producto` (índices compuestos) | `CompCatalogoInventario`, `CompPersistenciaBD` | Índices compuestos + `NodoCacheRedis` (TCP 6379) |
| **RNF-03** | `PosVentaFacade`, `Venta`, `Producto` | `producto`, `venta`, `detalle_venta` | `CompVentasPOS`, `CompPersistenciaBD` | Transacción ACID + `SELECT ... FOR UPDATE` + `CHECK (stock >= 0)` |
| **RNF-04** | n/a (infraestructura) | Todas | `CompPersistenciaBD`, `CompAlertasReportes` | Respaldo diario `pg_dump` + prueba mensual + `/health` |
| **RNF-05** | Todas (separación de capas) | n/a | `InterfazWebPWA` + Monolito Modular | PWA responsiva + 4 capas sin saltos |

### Verificación en sentido inverso (hacia atrás)
- **Clases (13/13):** `Tienda` (RF-01), `Usuario`/`Administrador`/`Cajero` (RF-02), `Categoria`/`Proveedor` (RF-03), `Producto` (RF-04/05), `LoteProducto`/`CompraReabastecimiento` (RF-08), `Venta`/`DetalleVenta` (RF-06/07), `IPoliticaDescuento`/`DescuentoSinPromo`/`DescuentoPorVolumen`/`PosVentaFacade` (RF-06), `AlertaInventario` (RF-09). **0 clases huérfanas.**
- **Tablas (11/11):** `tienda`, `usuario`, `telefono_usuario`, `categoria`, `proveedor`, `producto`, `lote_producto`, `venta`, `detalle_venta`, `compra_reabastecimiento`, `alerta_inventario`. **0 tablas huérfanas.**
