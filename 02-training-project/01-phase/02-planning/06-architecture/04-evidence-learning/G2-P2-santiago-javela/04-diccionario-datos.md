# B4 · Diccionario de Datos

- **Caso de estudio:** Gestión Neiva — Sistema POS SaaS Multi-Tenant e Inventario Inteligente.
- **Autor:** `@SantiagoJavelaOspino`
- **Estándar de nombrado declarado:** Tablas en **singular y `snake_case`**, columnas en **`snake_case`**, llaves primarias con prefijo **`id_<tabla>`**, restricciones nombradas (`pk_`, `fk_`, `uq_`, `ck_`).
- **Consistencia:** 100 % idéntico al modelo lógico (`01-modelo-conceptual-y-logico.md`) y al script DDL (`05-script-creacion.sql`) — **11 tablas, 70 columnas**.

---

## 1. Tabla `tienda`

| Columna | Tipo | Tamaño | Restricciones | Dominio / regla de negocio |
|---|---|---|---|---|
| `id_tienda` | `INTEGER` | n/a | `PK`, autoincremental | Entero positivo único |
| `nit` | `VARCHAR` | 20 | `NOT NULL`, `UNIQUE` | Identificación tributaria única (ej. `900123456-1`) |
| `nombre` | `VARCHAR` | 150 | `NOT NULL` | Razón social o nombre comercial |
| `estado_activo` | `BOOLEAN` | n/a | `NOT NULL`, `DEFAULT TRUE` | `TRUE` = activa, `FALSE` = suspendida |
| `fecha_registro` | `TIMESTAMP` | n/a | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP` | Fecha y hora UTC de alta |

## 2. Tabla `usuario`

| Columna | Tipo | Tamaño | Restricciones | Dominio / regla de negocio |
|---|---|---|---|---|
| `id_usuario` | `INTEGER` | n/a | `PK`, autoincremental | Entero positivo único |
| `id_tienda` | `INTEGER` | n/a | `NOT NULL`, `FK → tienda(id_tienda)`, `ON DELETE RESTRICT`, `ON UPDATE CASCADE` | Tienda a la que pertenece el usuario |
| `username` | `VARCHAR` | 60 | `NOT NULL`, `UNIQUE` | Identificador único de acceso |
| `correo` | `VARCHAR` | 120 | `NOT NULL`, `UNIQUE` | Correo electrónico válido |
| `password_hash` | `VARCHAR` | 255 | `NOT NULL` | Hash Argon2id con sal (nunca texto plano ni cifrado reversible) |
| `rol` | `VARCHAR` | 20 | `NOT NULL`, `CHECK (rol IN ('SUPERADMIN', 'ADMIN_TIENDA', 'CAJERO'))` | Rol RBAC autorizado |
| `estado_activo` | `BOOLEAN` | n/a | `NOT NULL`, `DEFAULT TRUE` | Baja lógica (`RN-05`) |

## 3. Tabla `telefono_usuario`

| Columna | Tipo | Tamaño | Restricciones | Dominio / regla de negocio |
|---|---|---|---|---|
| `id_telefono` | `INTEGER` | n/a | `PK`, autoincremental | Entero positivo único |
| `id_usuario` | `INTEGER` | n/a | `NOT NULL`, `FK → usuario(id_usuario)`, `ON DELETE CASCADE`, `ON UPDATE CASCADE` | Usuario propietario del número |
| `numero` | `VARCHAR` | 20 | `NOT NULL` | Dígitos de contacto (7 a 15 caracteres) |
| `tipo_telefono` | `VARCHAR` | 20 | `NOT NULL`, `CHECK (tipo_telefono IN ('MOVIL', 'FIJO', 'WHATSAPP'))` | Tipo de línea |

## 4. Tabla `categoria`

| Columna | Tipo | Tamaño | Restricciones | Dominio / regla de negocio |
|---|---|---|---|---|
| `id_categoria` | `INTEGER` | n/a | `PK`, autoincremental | Entero positivo único |
| `id_tienda` | `INTEGER` | n/a | `NOT NULL`, `FK → tienda(id_tienda)`, `ON DELETE RESTRICT`, `ON UPDATE CASCADE` | Aislamiento multi-tenant |
| `id_categoria_padre` | `INTEGER` | n/a | `NULL`, `FK → categoria(id_categoria)`, `ON DELETE SET NULL`, `ON UPDATE CASCADE` | Relación recursiva (NULL si es categoría raíz) |
| `nombre` | `VARCHAR` | 100 | `NOT NULL`, `UNIQUE (id_tienda, nombre)` | Nombre único dentro de la tienda |
| `descripcion` | `VARCHAR` | 255 | `NULL` | Descripción opcional |

## 5. Tabla `proveedor`

| Columna | Tipo | Tamaño | Restricciones | Dominio / regla de negocio |
|---|---|---|---|---|
| `id_proveedor` | `INTEGER` | n/a | `PK`, autoincremental | Entero positivo único |
| `id_tienda` | `INTEGER` | n/a | `NOT NULL`, `FK → tienda(id_tienda)`, `ON DELETE RESTRICT`, `ON UPDATE CASCADE` | Aislamiento multi-tenant |
| `nombre` | `VARCHAR` | 150 | `NOT NULL` | Nombre comercial del proveedor |
| `telefono` | `VARCHAR` | 20 | `NOT NULL` | Número de contacto |
| `ciudad` | `VARCHAR` | 80 | `NOT NULL` | Ciudad de operación (ej. Neiva) |
| `departamento` | `VARCHAR` | 80 | `NOT NULL` | Departamento (ej. Huila) |

## 6. Tabla `producto`

| Columna | Tipo | Tamaño | Restricciones | Dominio / regla de negocio |
|---|---|---|---|---|
| `id_producto` | `INTEGER` | n/a | `PK`, autoincremental | Entero positivo único |
| `id_tienda` | `INTEGER` | n/a | `NOT NULL`, `FK → tienda(id_tienda)`, `ON DELETE RESTRICT`, `ON UPDATE CASCADE` | Aislamiento multi-tenant |
| `id_categoria` | `INTEGER` | n/a | `NOT NULL`, `FK → categoria(id_categoria)`, `ON DELETE RESTRICT`, `ON UPDATE CASCADE` | Categoría del producto |
| `codigo_barras` | `VARCHAR` | 60 | `NOT NULL`, `UNIQUE (id_tienda, codigo_barras)` | Código EAN/UPC o SKU único por tienda |
| `nombre` | `VARCHAR` | 150 | `NOT NULL` | Nombre descriptivo |
| `precio_costo` | `NUMERIC` | (12, 2) | `NOT NULL`, `CHECK (precio_costo >= 0)` | Costo de adquisición en COP |
| `precio_venta` | `NUMERIC` | (12, 2) | `NOT NULL`, `CHECK (precio_venta >= 0)` | Precio vigente de venta en COP |
| `unidad_medida` | `VARCHAR` | 15 | `NOT NULL`, `CHECK (unidad_medida IN ('UNIDAD', 'GRAMO', 'KILOGRAMO', 'LIBRA', 'LITRO'))` | Soporte unidad o granel |
| `stock_actual` | `NUMERIC` | (12, 3) | `NOT NULL`, `CHECK (stock_actual >= 0)` | Existencias actuales (`RN-01`) |
| `stock_minimo` | `NUMERIC` | (12, 3) | `NOT NULL`, `CHECK (stock_minimo >= 0)` | Umbral de alerta de stock bajo |
| `estado_activo` | `BOOLEAN` | n/a | `NOT NULL`, `DEFAULT TRUE` | Baja lógica (`RN-05`) |

## 7. Tabla `lote_producto`

| Columna | Tipo | Tamaño | Restricciones | Dominio / regla de negocio |
|---|---|---|---|---|
| `id_lote` | `INTEGER` | n/a | `PK`, autoincremental | Entero positivo único |
| `id_producto` | `INTEGER` | n/a | `NOT NULL`, `FK → producto(id_producto)`, `ON DELETE RESTRICT`, `ON UPDATE CASCADE` | Producto perecedero dueño del lote |
| `codigo_lote` | `VARCHAR` | 50 | `NOT NULL`, `UNIQUE (id_producto, codigo_lote)` | Identificador parcial de entidad débil |
| `fecha_vencimiento` | `DATE` | n/a | `NOT NULL` | Fecha de caducidad (`YYYY-MM-DD`) |
| `cantidad_lote` | `NUMERIC` | (12, 3) | `NOT NULL`, `CHECK (cantidad_lote >= 0)` | Unidades o peso disponible del lote |

## 8. Tabla `venta`

| Columna | Tipo | Tamaño | Restricciones | Dominio / regla de negocio |
|---|---|---|---|---|
| `id_venta` | `INTEGER` | n/a | `PK`, autoincremental | Entero positivo único |
| `id_tienda` | `INTEGER` | n/a | `NOT NULL`, `FK → tienda(id_tienda)`, `ON DELETE RESTRICT`, `ON UPDATE CASCADE` | Aislamiento multi-tenant |
| `id_usuario` | `INTEGER` | n/a | `NOT NULL`, `FK → usuario(id_usuario)`, `ON DELETE RESTRICT`, `ON UPDATE CASCADE` | Cajero/Admin que registró la venta |
| `fecha_venta` | `TIMESTAMP` | n/a | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP` | Instante exacto de confirmación |
| `medio_pago` | `VARCHAR` | 20 | `NOT NULL`, `CHECK (medio_pago IN ('EFECTIVO', 'NEQUI', 'TARJETA'))` | Medio de pago aceptado |
| `porcentaje_descuento` | `NUMERIC` | (5, 2) | `NOT NULL`, `DEFAULT 0`, `CHECK (porcentaje_descuento >= 0 AND porcentaje_descuento <= 50)` | Descuento aplicado por política (`IPoliticaDescuento`) |

## 9. Tabla `detalle_venta`

| Columna | Tipo | Tamaño | Restricciones | Dominio / regla de negocio |
|---|---|---|---|---|
| `id_venta` | `INTEGER` | n/a | `PK`, `FK → venta(id_venta)`, `ON DELETE CASCADE`, `ON UPDATE CASCADE` | Venta cabecera (composición) |
| `id_producto` | `INTEGER` | n/a | `PK`, `FK → producto(id_producto)`, `ON DELETE RESTRICT`, `ON UPDATE CASCADE` | Producto vendido |
| `nombre_historico` | `VARCHAR` | 150 | `NOT NULL` | Snapshot inmutable del nombre (`RN-02`) |
| `precio_unitario` | `NUMERIC` | (12, 2) | `NOT NULL`, `CHECK (precio_unitario >= 0)` | Snapshot inmutable del precio (`RN-02`) |
| `cantidad` | `NUMERIC` | (12, 3) | `NOT NULL`, `CHECK (cantidad > 0)` | Cantidad vendida (> 0) |

## 10. Tabla `compra_reabastecimiento`

| Columna | Tipo | Tamaño | Restricciones | Dominio / regla de negocio |
|---|---|---|---|---|
| `id_compra` | `INTEGER` | n/a | `PK`, autoincremental | Entero positivo único |
| `id_tienda` | `INTEGER` | n/a | `NOT NULL`, `FK → tienda(id_tienda)`, `ON DELETE RESTRICT`, `ON UPDATE CASCADE` | Aislamiento multi-tenant |
| `id_proveedor` | `INTEGER` | n/a | `NOT NULL`, `FK → proveedor(id_proveedor)`, `ON DELETE RESTRICT`, `ON UPDATE CASCADE` | Proveedor que suministró la compra |
| `id_producto` | `INTEGER` | n/a | `NOT NULL`, `FK → producto(id_producto)`, `ON DELETE RESTRICT`, `ON UPDATE CASCADE` | Producto reabastecido |
| `fecha_compra` | `DATE` | n/a | `NOT NULL` | Fecha de recepción de mercancía |
| `cantidad_ingresada` | `NUMERIC` | (12, 3) | `NOT NULL`, `CHECK (cantidad_ingresada > 0)` | Cantidad recibida (> 0) |
| `costo_unitario` | `NUMERIC` | (12, 2) | `NOT NULL`, `CHECK (costo_unitario >= 0)` | Costo unitario de compra en COP |

## 11. Tabla `alerta_inventario`

| Columna | Tipo | Tamaño | Restricciones | Dominio / regla de negocio |
|---|---|---|---|---|
| `id_alerta` | `INTEGER` | n/a | `PK`, autoincremental | Entero positivo único |
| `id_tienda` | `INTEGER` | n/a | `NOT NULL`, `FK → tienda(id_tienda)`, `ON DELETE RESTRICT`, `ON UPDATE CASCADE` | Aislamiento multi-tenant |
| `id_producto` | `INTEGER` | n/a | `NOT NULL`, `FK → producto(id_producto)`, `ON DELETE RESTRICT`, `ON UPDATE CASCADE` | Producto afectado por la alerta |
| `id_lote` | `INTEGER` | n/a | `NULL`, `FK → lote_producto(id_lote)`, `ON DELETE SET NULL`, `ON UPDATE CASCADE` | Lote afectado (cuando es alerta de vencimiento) |
| `tipo_alerta` | `VARCHAR` | 20 | `NOT NULL`, `CHECK (tipo_alerta IN ('STOCK_MINIMO', 'VENCIMIENTO_PROXIMO'))` | Tipo de evento detectado |
| `prioridad` | `VARCHAR` | 15 | `NOT NULL`, `CHECK (prioridad IN ('CRITICA', 'PREVENTIVA'))` | Nivel de prioridad |
| `mensaje` | `VARCHAR` | 255 | `NOT NULL` | Descripción legible para el tendero |
| `fecha_generacion` | `TIMESTAMP` | n/a | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP` | Fecha/hora de creación |
| `atendida` | `BOOLEAN` | n/a | `NOT NULL`, `DEFAULT FALSE` | `FALSE` = pendiente, `TRUE` = atendida |
