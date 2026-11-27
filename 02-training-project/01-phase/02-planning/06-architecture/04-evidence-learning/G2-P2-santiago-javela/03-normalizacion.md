# B3 · Evidencia de Normalización Paso a Paso (0FN → 3FN)

- **Caso de estudio:** Gestión Neiva — Sistema POS SaaS Multi-Tenant e Inventario Inteligente.
- **Autor:** `@SantiagoJavelaOspino`
- **Alcance:** Se normalizan paso a paso **2 tablas propias del modelo** desde 0FN hasta 3FN con dependencias funcionales (DF) explícitas:
  1. **Tabla 1 (llave compuesta + atributo multivaluado → 1FN, 2FN, 3FN):** `venta_detalle_cruda`
  2. **Tabla 2 (dependencia transitiva → 1FN, 2FN, 3FN):** `producto_catalogo_crudo`

---

## Caso 1 · Normalización de `venta_detalle_cruda` (llave compuesta y atributo multivaluado)

### Estado inicial (0FN)
`venta_detalle_cruda(id_venta, id_producto, fecha_venta, medio_pago, id_usuario, username_cajero, telefonos_cajero, codigo_barras, nombre_producto_catalogo, nombre_historico, precio_unitario, cantidad)`

- **Llave primaria compuesta:** `(id_venta, id_producto)`
- **Problemas detectados:**
  - `telefonos_cajero` almacena varios números separados por coma en una sola celda (viola **1FN**).
  - Varios atributos dependen solo de `id_venta` o solo de `id_producto`, no de la llave compuesta completa (viola **2FN**).
  - `username_cajero` depende de `id_usuario`, y este a su vez de `id_venta` (dependencia transitiva, viola **3FN**).

### Paso a paso (0FN → 1FN → 2FN → 3FN)

| Forma | Violación detectada | Dependencias funcionales (DF) escritas | Estado resultante (después) |
|---|---|---|---|
| **1FN** | `telefonos_cajero` no es atómico (contiene múltiples teléfonos en una celda). | `id_usuario →→ telefono` (multivaluado) | Se extrae la tabla **`telefono_usuario(id_telefono PK, id_usuario FK, numero, tipo_telefono)`** y se elimina `telefonos_cajero` de la tabla principal. |
| **2FN** *(dependencia parcial en llave compuesta)* | `fecha_venta`, `medio_pago`, `id_usuario`, `username_cajero` dependen solo de `id_venta`; `codigo_barras` y `nombre_producto_catalogo` dependen solo de `id_producto`. Solo `nombre_historico`, `precio_unitario` y `cantidad` dependen de la llave completa `(id_venta, id_producto)`. | `id_venta → fecha_venta, medio_pago, id_usuario, username_cajero`<br>`id_producto → codigo_barras, nombre_producto_catalogo`<br>`(id_venta, id_producto) → nombre_historico, precio_unitario, cantidad` | Se descompone en 3 tablas:<br>• **`venta(id_venta PK, id_tienda FK, id_usuario FK, username_cajero, fecha_venta, medio_pago, porcentaje_descuento)`**<br>• **`producto(id_producto PK, codigo_barras, nombre, ...)`**<br>• **`detalle_venta(id_venta PK/FK, id_producto PK/FK, nombre_historico, precio_unitario, cantidad)`** |
| **3FN** *(dependencia transitiva)* | En `venta`, `username_cajero` depende de `id_usuario` (no llave), y `id_usuario` depende de `id_venta`. | `id_venta → id_usuario → username_cajero` | Se retira `username_cajero` de `venta` y reside únicamente en **`usuario(id_usuario PK, id_tienda FK, username, correo, password_hash, rol, estado_activo)`**. |

> **Nota de desnormalización justificada (RN-02 · Snapshot):** En `detalle_venta`, las columnas `nombre_historico` y `precio_unitario` **no** violan 2FN ni 3FN porque representan el valor congelado en la fecha de la venta (dependen funcionalmente del par `(id_venta, id_producto)` y no del catálogo actual).

---

## Caso 2 · Normalización de `producto_catalogo_crudo` (dependencia transitiva)

### Estado inicial (0FN / 1FN)
`producto_catalogo_crudo(id_producto, id_tienda, codigo_barras, nombre_producto, precio_costo, precio_venta, stock_actual, id_categoria, nombre_categoria, id_proveedor, nombre_proveedor, ciudad_proveedor, departamento_proveedor)`

- **Llave primaria simple:** `id_producto` (todos los atributos son atómicos → ya está en 1FN y, al tener llave simple de un solo atributo, cumple 2FN).
- **Problema detectado (viola 3FN):** Existen atributos no clave que dependen de otros atributos no clave (`id_categoria` y `id_proveedor`), además de que un proveedor puede suministrar muchos productos.

### Paso a paso (1FN → 2FN → 3FN)

| Forma | Violación detectada | Dependencias funcionales (DF) escritas | Estado resultante (después) |
|---|---|---|---|
| **1FN** | Ninguna: todos los campos son atómicos y sin grupos repetitivos. | `id_producto → todos los atributos` | Cumple 1FN. |
| **2FN** | Ninguna: la llave primaria `id_producto` es simple (no compuesta), por lo que no hay dependencias parciales. | `id_producto → todos los atributos` | Cumple 2FN. |
| **3FN** *(dependencias transitivas)* | 1. `nombre_categoria` depende de `id_categoria`, que a su vez depende de `id_producto`.<br>2. `nombre_proveedor`, `ciudad_proveedor` y `departamento_proveedor` dependen de `id_proveedor`, y `departamento_proveedor` depende de `ciudad_proveedor` (o del registro maestro del proveedor). | `id_producto → id_categoria → nombre_categoria`<br>`id_producto → id_proveedor → nombre_proveedor, ciudad_proveedor, departamento_proveedor` | Se descompone en:<br>• **`categoria(id_categoria PK, id_tienda FK, id_categoria_padre FK, nombre, descripcion)`**<br>• **`proveedor(id_proveedor PK, id_tienda FK, nombre, telefono, ciudad, departamento)`**<br>• **`producto(id_producto PK, id_tienda FK, id_categoria FK, codigo_barras, nombre, precio_costo, precio_venta, unidad_medida, stock_actual, stock_minimo, estado_activo)`**<br>• **`compra_reabastecimiento(id_compra PK, id_tienda FK, id_proveedor FK, id_producto FK, fecha_compra, cantidad_ingresada, costo_unitario)`** |

---

## Verificación final del modelo en 3FN

Las **11 tablas** del modelo lógico (`tienda`, `usuario`, `telefono_usuario`, `categoria`, `proveedor`, `producto`, `lote_producto`, `venta`, `detalle_venta`, `compra_reabastecimiento`, `alerta_inventario`) quedan completamente libres de atributos multivaluados (1FN), dependencias parciales (2FN) y dependencias transitivas (3FN).
