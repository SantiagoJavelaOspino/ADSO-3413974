-- ============================================================================
-- B5 · Script SQL de Creación de Esquema — Gestión Neiva (POS SaaS Multi-Tenant)
-- Autor: @SantiagoJavelaOspino | Ficha 3413974 (ADSO - SENA)
-- Estándar: ANSI SQL compatible con PostgreSQL 16 y SQLite 3 (PRAGMA foreign_keys = ON)
-- Tablas: 11 tablas normalizadas en 3FN, 100 % alineadas con 04-diccionario-datos.md
-- ============================================================================

PRAGMA foreign_keys = ON;

-- 1. TIENDA (Multi-Tenant)
CREATE TABLE tienda (
    id_tienda      INTEGER PRIMARY KEY AUTOINCREMENT,
    nit            VARCHAR(20)  NOT NULL UNIQUE,
    nombre         VARCHAR(150) NOT NULL,
    estado_activo  BOOLEAN      NOT NULL DEFAULT 1,
    fecha_registro TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. USUARIO
CREATE TABLE usuario (
    id_usuario     INTEGER PRIMARY KEY AUTOINCREMENT,
    id_tienda      INTEGER      NOT NULL,
    username       VARCHAR(60)  NOT NULL UNIQUE,
    correo         VARCHAR(120) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    rol            VARCHAR(20)  NOT NULL,
    estado_activo  BOOLEAN      NOT NULL DEFAULT 1,
    CONSTRAINT fk_usuario_tienda FOREIGN KEY (id_tienda)
        REFERENCES tienda (id_tienda) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT ck_usuario_rol CHECK (rol IN ('SUPERADMIN', 'ADMIN_TIENDA', 'CAJERO'))
);

-- 3. TELEFONO_USUARIO (1FN: atributo multivaluado)
CREATE TABLE telefono_usuario (
    id_telefono    INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario     INTEGER     NOT NULL,
    numero         VARCHAR(20) NOT NULL,
    tipo_telefono  VARCHAR(20) NOT NULL,
    CONSTRAINT fk_telefono_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuario (id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT ck_tipo_telefono CHECK (tipo_telefono IN ('MOVIL', 'FIJO', 'WHATSAPP'))
);

-- 4. CATEGORIA (relación recursiva)
CREATE TABLE categoria (
    id_categoria       INTEGER PRIMARY KEY AUTOINCREMENT,
    id_tienda          INTEGER      NOT NULL,
    id_categoria_padre INTEGER      NULL,
    nombre             VARCHAR(100) NOT NULL,
    descripcion        VARCHAR(255) NULL,
    CONSTRAINT uq_categoria_tienda_nombre UNIQUE (id_tienda, nombre),
    CONSTRAINT fk_categoria_tienda FOREIGN KEY (id_tienda)
        REFERENCES tienda (id_tienda) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_categoria_padre FOREIGN KEY (id_categoria_padre)
        REFERENCES categoria (id_categoria) ON DELETE SET NULL ON UPDATE CASCADE
);

-- 5. PROVEEDOR
CREATE TABLE proveedor (
    id_proveedor INTEGER PRIMARY KEY AUTOINCREMENT,
    id_tienda    INTEGER      NOT NULL,
    nombre       VARCHAR(150) NOT NULL,
    telefono     VARCHAR(20)  NOT NULL,
    ciudad       VARCHAR(80)  NOT NULL,
    departamento VARCHAR(80)  NOT NULL,
    CONSTRAINT fk_proveedor_tienda FOREIGN KEY (id_tienda)
        REFERENCES tienda (id_tienda) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 6. PRODUCTO
CREATE TABLE producto (
    id_producto   INTEGER PRIMARY KEY AUTOINCREMENT,
    id_tienda     INTEGER       NOT NULL,
    id_categoria  INTEGER       NOT NULL,
    codigo_barras VARCHAR(60)   NOT NULL,
    nombre        VARCHAR(150)  NOT NULL,
    precio_costo  NUMERIC(12,2) NOT NULL,
    precio_venta  NUMERIC(12,2) NOT NULL,
    unidad_medida VARCHAR(15)   NOT NULL,
    stock_actual  NUMERIC(12,3) NOT NULL,
    stock_minimo  NUMERIC(12,3) NOT NULL,
    estado_activo BOOLEAN       NOT NULL DEFAULT 1,
    CONSTRAINT uq_producto_tienda_codigo UNIQUE (id_tienda, codigo_barras),
    CONSTRAINT fk_producto_tienda FOREIGN KEY (id_tienda)
        REFERENCES tienda (id_tienda) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_producto_categoria FOREIGN KEY (id_categoria)
        REFERENCES categoria (id_categoria) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT ck_producto_costo CHECK (precio_costo >= 0),
    CONSTRAINT ck_producto_precio CHECK (precio_venta >= 0),
    CONSTRAINT ck_producto_stock CHECK (stock_actual >= 0),
    CONSTRAINT ck_producto_stock_min CHECK (stock_minimo >= 0),
    CONSTRAINT ck_producto_unidad CHECK (unidad_medida IN ('UNIDAD', 'GRAMO', 'KILOGRAMO', 'LIBRA', 'LITRO'))
);

-- 7. LOTE_PRODUCTO (entidad débil)
CREATE TABLE lote_producto (
    id_lote           INTEGER PRIMARY KEY AUTOINCREMENT,
    id_producto       INTEGER       NOT NULL,
    codigo_lote       VARCHAR(50)   NOT NULL,
    fecha_vencimiento DATE          NOT NULL,
    cantidad_lote     NUMERIC(12,3) NOT NULL,
    CONSTRAINT uq_lote_producto_codigo UNIQUE (id_producto, codigo_lote),
    CONSTRAINT fk_lote_producto FOREIGN KEY (id_producto)
        REFERENCES producto (id_producto) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT ck_lote_cantidad CHECK (cantidad_lote >= 0)
);

-- 8. VENTA (cabecera sin columna estática total — RN-06)
CREATE TABLE venta (
    id_venta             INTEGER PRIMARY KEY AUTOINCREMENT,
    id_tienda            INTEGER      NOT NULL,
    id_usuario           INTEGER      NOT NULL,
    fecha_venta          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    medio_pago           VARCHAR(20)  NOT NULL,
    porcentaje_descuento NUMERIC(5,2) NOT NULL DEFAULT 0,
    CONSTRAINT fk_venta_tienda FOREIGN KEY (id_tienda)
        REFERENCES tienda (id_tienda) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_venta_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuario (id_usuario) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT ck_venta_medio_pago CHECK (medio_pago IN ('EFECTIVO', 'NEQUI', 'TARJETA')),
    CONSTRAINT ck_venta_descuento CHECK (porcentaje_descuento >= 0 AND porcentaje_descuento <= 50)
);

-- 9. DETALLE_VENTA (tabla intermedia N:M con snapshot inmutable — RN-02)
CREATE TABLE detalle_venta (
    id_venta         INTEGER       NOT NULL,
    id_producto      INTEGER       NOT NULL,
    nombre_historico VARCHAR(150)  NOT NULL,
    precio_unitario  NUMERIC(12,2) NOT NULL,
    cantidad         NUMERIC(12,3) NOT NULL,
    CONSTRAINT pk_detalle_venta PRIMARY KEY (id_venta, id_producto),
    CONSTRAINT fk_detalle_venta FOREIGN KEY (id_venta)
        REFERENCES venta (id_venta) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_detalle_producto FOREIGN KEY (id_producto)
        REFERENCES producto (id_producto) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT ck_detalle_precio CHECK (precio_unitario >= 0),
    CONSTRAINT ck_detalle_cantidad CHECK (cantidad > 0)
);

-- 10. COMPRA_REABASTECIMIENTO
CREATE TABLE compra_reabastecimiento (
    id_compra          INTEGER PRIMARY KEY AUTOINCREMENT,
    id_tienda          INTEGER       NOT NULL,
    id_proveedor       INTEGER       NOT NULL,
    id_producto        INTEGER       NOT NULL,
    fecha_compra       DATE          NOT NULL,
    cantidad_ingresada NUMERIC(12,3) NOT NULL,
    costo_unitario     NUMERIC(12,2) NOT NULL,
    CONSTRAINT fk_compra_tienda FOREIGN KEY (id_tienda)
        REFERENCES tienda (id_tienda) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_compra_proveedor FOREIGN KEY (id_proveedor)
        REFERENCES proveedor (id_proveedor) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_compra_producto FOREIGN KEY (id_producto)
        REFERENCES producto (id_producto) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT ck_compra_cantidad CHECK (cantidad_ingresada > 0),
    CONSTRAINT ck_compra_costo CHECK (costo_unitario >= 0)
);

-- 11. ALERTA_INVENTARIO
CREATE TABLE alerta_inventario (
    id_alerta        INTEGER PRIMARY KEY AUTOINCREMENT,
    id_tienda        INTEGER      NOT NULL,
    id_producto      INTEGER      NOT NULL,
    id_lote          INTEGER      NULL,
    tipo_alerta      VARCHAR(20)  NOT NULL,
    prioridad        VARCHAR(15)  NOT NULL,
    mensaje          VARCHAR(255) NOT NULL,
    fecha_generacion TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atendida         BOOLEAN      NOT NULL DEFAULT 0,
    CONSTRAINT fk_alerta_tienda FOREIGN KEY (id_tienda)
        REFERENCES tienda (id_tienda) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_alerta_producto FOREIGN KEY (id_producto)
        REFERENCES producto (id_producto) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_alerta_lote FOREIGN KEY (id_lote)
        REFERENCES lote_producto (id_lote) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT ck_alerta_tipo CHECK (tipo_alerta IN ('STOCK_MINIMO', 'VENCIMIENTO_PROXIMO')),
    CONSTRAINT ck_alerta_prioridad CHECK (prioridad IN ('CRITICA', 'PREVENTIVA'))
);

-- Índices compuestos multi-tenant para RNF-02 (latencia POS <= 1.5 s)
CREATE INDEX idx_producto_tienda_codigo ON producto (id_tienda, codigo_barras);
CREATE INDEX idx_producto_tienda_activo ON producto (id_tienda, estado_activo, nombre);
CREATE INDEX idx_venta_tienda_fecha     ON venta (id_tienda, fecha_venta);
CREATE INDEX idx_alerta_tienda_estado   ON alerta_inventario (id_tienda, atendida);
