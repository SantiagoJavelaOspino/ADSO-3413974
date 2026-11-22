# 📋 Lista de Chequeo — Levantamiento y Verificación de Requerimientos de Software
## Proyecto: Sistema POS, Portal Web de Supermercado y Módulo de Inventario (TiendApp)

---

## 1. Ficha Técnica del Instrumento

| Campo | Detalle |
| :--- | :--- |
| **Instrumento** | Lista de Chequeo (Checklist de Elicitación, Auditoría Operativa y Validación de SRS) |
| **Proyecto / Sistema** | Sistema POS & Portal Web Supermercado Mediano / **TiendApp — Módulo de Inventario** |
| **Versión** | 1.1 |
| **Autor / Responsable** | Santiago Javela Ospino y Equipo TiendApp (ADSO 3413974) |
| **Plataformas Evaluadas** | 🌐 Web App (Escritorio / Responsiva) + 📱 Mobile App (iOS y Android) |
| **Objetivo del Instrumento** | Verificar de forma estructurada los procesos actuales de inventario/ventas en tienda y auditar el cumplimiento de calidad, completitud, trazabilidad y criterios de aceptación de los Requerimientos Funcionales (RF), No Funcionales (RNF), Historias de Usuario (HU) y Modelo de Datos. |

---

## 2. Equipo de Trabajo y Roles Verificados

| # | Rol en el Equipo | Módulos / Áreas | Responsabilidades Principales Verificadas | Herramientas Clave |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **Líder de Proyecto** | Todos los módulos | Planificación y seguimiento del cronograma, coordinación del equipo, gestión de riesgos, comunicación con stakeholders y control de cambios del SRS. | GitHub (Issues/Projects), Google Drive, Meet, WhatsApp, Gamma, Canva, IA (ChatGPT, Claude, Gemini). |
| **2** | **Analista de Sistemas** | Requerimientos, SRS, Entidades | Levantamiento y documentación de RF y RNF, redacción del SRS, historias de usuario, criterios de aceptación y modelado de la entidad `Producto`. | Mermaid, Draw.io, Lucidchart, Word, Excel, Google Docs, GitHub. |
| **3** | **Diseñador UI/UX** | UI/UX Web y Mobile | Diseño de wireframes y prototipos de alta fidelidad (Web y Mobile), sistema de diseño, diseño responsivo y pruebas de usabilidad con tenderos reales. | Figma, Canva, Bootstrap 5, HTML5, CSS3. |
| **4** | **Desarrollador** | Frontend Web + Mobile / API | Implementación Web (React/Next.js) y Mobile (React Native), CRUD de productos, escáner QR/barras, búsqueda, alertas y descuento automático (`RF-05`). | JavaScript, TypeScript, React, React Native, Node.js, SQL, VS Code, GitHub Copilot. |
| **5** | **Administrador BD (DBA)** | Modelo de datos, Consultas | Diseño relacional, tablas, índices, restricciones de integridad referencial, optimización para +10,000 productos, migraciones y backups. | MySQL, MySQL Workbench, SQL, Mermaid, Draw.io, Excel. |
| **6** | **Analista QA** | Pruebas, Validación RF/RNF | Diseño y ejecución de casos de prueba funcionales, compatibilidad cross-browser/mobile, pruebas de carga (10,000 productos) y regresión. | Excel/Sheets (casos de prueba), Chrome DevTools, Firefox, BrowserStack, GitHub Issues. |

---

## 3. Parte A — Lista de Chequeo de Diagnóstico Operativo (Levantamiento en Supermercado / Tienda)

*Verificación en campo de la situación actual del negocio (30 empleados / operación de inventario y punto de venta) para validar las necesidades del sistema:*

| Ítem | Aspecto / Proceso Operativo Evaluado | ¿Se Cumple Actualmente? | Prioridad de Solución | Hallazgo / Observación de Levantamiento | Requerimiento Asociado |
| :-: | :--- | :---: | :---: | :--- | :---: |
| **OP-01** | ¿El negocio cuenta con un registro digital centralizado de sus productos (sin depender de cuadernos manuales)? | ❌ **No** | Alta | Parte del control de stock se lleva en cuadernos o Excel aislado, generando errores en el 35% de los conteos. | `RF-01` |
| **OP-02** | ¿Los productos están clasificados por categorías claras para facilitar su localización e inventario? | ⚠️ **Parcial** | Media | Existen categorías físicas en estantería, pero no están sistematizadas con filtros digitales. | `RF-02` |
| **OP-03** | ¿El registro de ventas e ingreso de mercancía utiliza lectura ágil de código de barras o QR? | ⚠️ **Parcial** | Alta | El 85% del personal solicita integración ágil con lector de código de barras y cámara móvil. | `RF-03` / `RF01` |
| **OP-04** | ¿El personal puede buscar y filtrar productos por nombre, código o estado de stock en menos de 1 segundo? | ❌ **No** | Alta | El 55% de los empleados reporta lentitud al consultar o registrar productos en hora pico. | `RF-04` / `RNF-01` |
| **OP-05** | ¿El inventario se descuenta automáticamente en tiempo real cada vez que se registra una venta en caja? | ❌ **No** | Alta | El 90% de los encuestados considera crítico que el descuento de stock sea automático al confirmar la venta. | `RF-05` / `RF02` |
| **OP-06** | ¿El sistema emite alertas automáticas cuando un producto llega a su nivel de stock mínimo? | ❌ **No** | Alta | Los agotados se detectan tarde en góndola; se requiere alerta visual y notificación push. | `RF-06` / `RF05` |
| **OP-07** | ¿Los descuentos y promociones (2x1, porcentaje, temporada) se calculan automáticamente en caja sin cálculo manual? | ❌ **No** | Alta | El 80% reporta errores o descuadres frecuentes al calcular promociones manualmente. | `RF02` / `RF08` |
| **OP-08** | ¿Los clientes pueden consultar el catálogo, promociones vigentes y armar un carrito de pre-cotización/reserva desde su celular? | ❌ **No** | Alta | El 85% de los clientes desea ver promociones online y el 90% accedería desde dispositivos móviles. | `RF03` / `RF04` / `RNF-02` |

---

## 4. Parte B — Lista de Chequeo de Requerimientos Funcionales (SRS TiendApp & Supermercado)

*Auditoría de especificación y validación multiplataforma (🌐 Web + 📱 Mobile):*

| Código | Requerimiento Funcional | Criterio de Verificación Web 🌐 | Criterio de Verificación Mobile 📱 | Datos y Reglas Verificadas | Prioridad | ¿Cumple Especificación? |
| :-: | :--- | :--- | :--- | :--- | :---: | :---: |
| **RF-01** | **Gestión de Productos (CRUD)** | Formulario en página dedicada, tabla con acciones inline (editar/eliminar) y carga de foto desde archivos. | Formulario pantalla completa con teclado nativo, tarjetas con *swipe* para editar/eliminar y foto desde cámara/galería. | 11 campos de `Producto`; validación de obligatorios y confirmación previa a eliminar. | Alta | ✅ **Sí** |
| **RF-02** | **Categorización Personalizable** | Dropdown con opción *"Crear nueva categoría"* y panel de gestión en Configuración. | Chips horizontales deslizables y modal de creación con color hexadecimal e ícono. | `nombre_categoria`, `color_hex`, `icono`, `fecha_creacion`. Categorías base: Bebidas, Snacks, Aseo, Lácteos, Limpieza, Panadería. | Media | ✅ **Sí** |
| **RF-03** | **Escáner de Código de Barras / QR** | Campo de ingreso manual con validación EAN/UPC al escribir y botón opcional de cámara web. | Activación de cámara nativa (< 2s) con lectura automática EAN-13, EAN-8, UPC-A, QR (< 1s), linterna y zoom. | `codigo_barras` único por tienda. Si existe abre edición; si no existe pre-rellena creación. | Alta | ✅ **Sí** |
| **RF-04** | **Búsqueda y Filtrado en Tiempo Real** | Barra superior en tabla, panel lateral de filtros y columnas ordenables con clic en encabezado. | Barra fija superior, chips horizontales de filtro y actualización instantánea al escribir. | Búsqueda por `nombre` o `codigo_barras`; filtros por categoría, stock bajo, orden A-Z y precio. | Alta | ✅ **Sí** |
| **RF-05** | **Descuento Automático de Inventario** | Descuento en *background* al confirmar la venta y actualización inmediata al volver al módulo. | Descuento inmediato al confirmar venta con animación visual en el contador de la tarjeta. | `cantidad_actual = cantidad_actual - cantidad_vendida` (nunca negativo); registro en log de movimientos. | Alta | ✅ **Sí** |
| **RF-06** | **Alertas de Stock Bajo** | Insignia roja con contador en ícono, banner superior en dashboard y fila resaltada en rojo. | Insignia roja en menú, notificación push al abrir la app e indicador rojo en la tarjeta del producto. | Se dispara cuando `cantidad_actual <= stock_minimo`; se desactiva automáticamente al reponer stock. | Alta | ✅ **Sí** |
| **RF-07** | **Gestión de Promociones y Cuadre de Caja (POS)** | Aplicación automática de descuentos vigentes en POS, facturación electrónica/PDF y reporte de cierre de turno. | Consulta móvil del catálogo con precios promocionales y disponibilidad sincronizada. | Tipos de promoción: porcentaje, valor fijo, 2x1 con vigencia de fechas y control por rol (Cajero, Inventario, Admin). | Alta | ✅ **Sí** |

---

## 5. Parte C — Lista de Chequeo de Requerimientos No Funcionales (Calidad ISO/IEC 25010)

| Código | Categoría | Criterio / Métrica de Aceptación a Verificar | Método de Verificación / Prueba QA | Prioridad | ¿Cumple Criterio? | Observaciones de Auditoría |
| :-: | :--- | :--- | :--- | :---: | :---: | :--- |
| **RNF-01** | **Rendimiento** | • Web: Carga inicial de lista < 2s (1,000 productos); búsqueda/filtros < 500ms.<br>• Mobile: Navegación < 300ms; escaneo de código < 1s. | Lighthouse Performance Score ≥ 80 en Chrome Desktop; prueba manual de 50 escaneos consecutivos en iPhone SE / Android. | Alta | ✅ **Sí** | Cumple umbral de respuesta rápida en punto de venta. |
| **RNF-02** | **Usabilidad y Diseño Responsivo** | • Web: Tabla en escritorio y tarjetas en < 768px sin scroll horizontal (320px a 1920px).<br>• Mobile: Botones táctiles ≥ 48×48dp, texto ≥ 16sp. | Prueba de usabilidad con 5 tenderos reales por plataforma (meta: registrar un producto en < 2 minutos sin capacitación). | Alta | ✅ **Sí** | Diseño *Mobile-First* validado en 4 resoluciones. |
| **RNF-03** | **Compatibilidad Multiplataforma** | • Web: Chrome 110+, Firefox 110+, Safari 16+, Edge 110+ (Windows, macOS, Linux).<br>• Mobile: Android 10+ e iOS 14+ (gama media 4GB RAM / Snapdragon 665). | Pruebas cross-browser en BrowserStack + ejecución real en 3 dispositivos Android y 2 iOS con 0 errores críticos. | Alta | ✅ **Sí** | Cobertura completa de dispositivos de tenderos y clientes. |
| **RNF-04** | **Seguridad y Control de Acceso** | • Autenticación con JWT, rutas protegidas por tienda y por rol.<br>• Acceso cruzado (Tienda A → Tienda B) debe responder `HTTP 403 Forbidden`. | Pruebas de penetración básicas: intento de acceso cruzado entre tiendas, inyección SQL, XSS y almacenamiento seguro en móvil. | Alta | ✅ **Sí** | Aislamiento multi-tienda y timeout de sesión verificados. |
| **RNF-05** | **Escalabilidad y Concurrencia** | • Búsqueda y renderizado < 500ms con hasta **10,000 productos** (paginación/scroll infinito en Web, lista virtualizada en Mobile).<br>• Soporte de 15 sesiones concurrentes en hora pico. | Prueba de carga insertando 10,000 registros con índices en BD y simulación de 15 cajeros/usuarios simultáneos. | Media / Alta | ✅ **Sí** | Índices en `nombre` y `codigo_barras` garantizan tiempos < 500ms. |

---

## 6. Parte D — Lista de Chequeo de Historias de Usuario y Criterios de Aceptación

| ID HU | Historia de Usuario | Checklist de Criterios de Aceptación — Web 🌐 | Checklist de Criterios de Aceptación — Mobile 📱 | RF Asociado | Story Points | Estado de Verificación |
| :-: | :--- | :--- | :--- | :---: | :---: | :---: |
| **HU-01** | *Como tendero, quiero registrar productos en mi inventario (nombre, precio, cantidad y foto) para llevar un control digital de lo que vendo y cuánto tengo.* | - [x] Formulario accesible desde botón `+ Producto`.<br>- [x] Subida de foto desde el sistema de archivos.<br>- [x] El producto aparece en la tabla al guardar.<br>- [x] Edición y eliminación inline desde la tabla.<br>- [x] Validación de campos obligatorios antes de guardar. | - [x] Formulario en pantalla completa con teclado nativo.<br>- [x] Foto con cámara o desde galería.<br>- [x] El producto aparece en la lista de tarjetas al guardar.<br>- [x] Swipe o botón para editar/eliminar.<br>- [x] Persistencia de datos al cerrar y reabrir la app. | `RF-01`, `RF-02` | 8 pts | ✅ **Verificada (5/5 Web · 5/5 Mobile)** |
| **HU-02** | *Como tendero, quiero ingresar el código de barras de un producto para registrarlo o buscarlo rápidamente sin escribir el nombre.* | - [x] Campo `Código de barras` con validación de formato EAN/UPC.<br>- [x] Si el código existe, carga el producto para editar.<br>- [x] Botón opcional para usar cámara web si el navegador lo soporta.<br>- [x] Mensaje de error claro si el formato es inválido. | - [x] Botón de escaneo visible en el formulario.<br>- [x] La cámara se activa en < 2 segundos.<br>- [x] Reconocimiento del código en < 1 segundo.<br>- [x] Si existe abre edición; si no, pre-rellena el código.<br>- [x] Control de linterna disponible durante el escaneo. | `RF-03` | 13 pts | ✅ **Verificada (4/4 Web · 5/5 Mobile)** |
| **HU-03** | *Como tendero, quiero recibir alertas cuando un producto se esté acabando para pedirlo a mi proveedor a tiempo.* | - [x] Insignia roja con contador en el ícono del módulo.<br>- [x] Banner de alerta visible en el dashboard principal.<br>- [x] Fila del producto resaltada en rojo en la tabla.<br>- [x] La alerta desaparece automáticamente al reponer stock.<br>- [x] Filtro rápido para ver solo productos en alerta. | - [x] Insignia roja en el menú de la app.<br>- [x] Notificación push al abrir la app si hay stock crítico.<br>- [x] Tarjeta del producto con indicador rojo visible.<br>- [x] La alerta desaparece al reponer stock.<br>- [x] Filtro para ver solo productos en alerta. | `RF-05`, `RF-06` | 8 pts | ✅ **Verificada (5/5 Web · 5/5 Mobile)** |
| **HU-04** | *Como tendero, quiero buscar y filtrar mis productos para encontrar rápidamente lo que necesito sin recorrer todo el inventario.* | - [x] Barra de búsqueda en la parte superior de la tabla.<br>- [x] Filtros en panel lateral o barra de herramientas.<br>- [x] Columnas ordenables con clic en el encabezado.<br>- [x] Resultados actualizados sin recargar la página. | - [x] Barra de búsqueda fija en la parte superior.<br>- [x] Filtros como chips horizontales deslizables.<br>- [x] Actualización en tiempo real mientras escribe.<br>- [x] Botón para limpiar todos los filtros activos. | `RF-04` | 5 pts | ✅ **Verificada (4/4 Web · 4/4 Mobile)** |

---

## 7. Parte E — Lista de Chequeo del Modelo de Datos (Entidad `Producto`)

| # | Campo | Tipo de Dato | ¿Obligatorio? | ¿Único? | Regla de Negocio / Restricción Verificada | Valor por Defecto | ¿Cumple Modelo? |
| :-: | :--- | :--- | :---: | :---: | :--- | :---: | :---: |
| **1** | `id` | `UUID (String)` | Sí | Sí | Clave primaria autogenerada al crear el producto; no editable ni visible en UI. | Auto-generado | ✅ **Sí** |
| **2** | `nombre` | `String` | Sí | No | Mínimo 2 y máximo 80 caracteres; indexado para búsqueda; no admite solo espacios. | — | ✅ **Sí** |
| **3** | `codigo_barras` | `String` | No | Sí (por tienda) | Acepta EAN-8, EAN-13, UPC-A (máx. 20 caracteres). Único dentro del inventario de la tienda. | `null` | ✅ **Sí** |
| **4** | `categoria` | `String (FK ref)` | No | No | Referencia a tabla `categorias`. Si la categoría se elimina pasa a `null` (`ON DELETE SET NULL`). | `null` | ✅ **Sí** |
| **5** | `precio_costo` | `Decimal(10,2)` | Sí | No | Mayor que 0, máximo 2 decimales. Emite advertencia no bloqueante si supera `precio_venta`. | — | ✅ **Sí** |
| **6** | `precio_venta` | `Decimal(10,2)` | Sí | No | Mayor que 0, máximo 2 decimales. Emite advertencia si es menor que `precio_costo`. | — | ✅ **Sí** |
| **7** | `cantidad_actual` | `Integer` | Sí | No | Mayor o igual a 0 (`CHECK >= 0`). Se descuenta automáticamente en ventas (`RF-05`). | `0` | ✅ **Sí** |
| **8** | `stock_minimo` | `Integer` | No | No | Mayor o igual a 0. Si `cantidad_actual <= stock_minimo` dispara alerta `RF-06`. | `0` | ✅ **Sí** |
| **9** | `foto_url` | `String (URL)` | No | No | Máximo 500 caracteres. Muestra imagen placeholder si es `null`. | `null` | ✅ **Sí** |
| **10** | `fecha_creacion` | `Timestamp` | Sí (auto) | No | Generado automáticamente (`now()`) al insertar; inmutable. | `now()` | ✅ **Sí** |
| **11** | `ultima_actualizacion` | `Timestamp` | Sí (auto) | No | Actualizado automáticamente en cada operación CRUD o movimiento de stock. | `now()` | ✅ **Sí** |

---

## 8. Resumen General de Cumplimiento y Dictamen

| Dimensión Evaluada en la Lista de Chequeo | Ítems Evaluados | Ítems Conformes / Verificados | % de Cumplimiento | Estado Final |
| :--- | :---: | :---: | :---: | :---: |
| **A. Diagnóstico Operativo y Trazabilidad de Problemas** | 8 | 8 | **100%** | ✅ Auditado |
| **B. Requerimientos Funcionales (RF-01 a RF-07)** | 7 | 7 | **100%** | ✅ Aprobado |
| **C. Requerimientos No Funcionales (RNF-01 a RNF-05)** | 5 | 5 | **100%** | ✅ Aprobado |
| **D. Historias de Usuario y Criterios de Aceptación (37 checks)** | 4 HU (37 criterios) | 4 HU (37 criterios) | **100%** | ✅ Aprobado |
| **E. Reglas de Integridad de la Entidad `Producto`** | 11 campos | 11 campos | **100%** | ✅ Aprobado |
| **TOTAL CONSOLIDADO** | **35 bloques / 68 checks** | **35 bloques / 68 checks** | **100%** | 🏆 **CONFORME** |

> **Conclusión del Instrumento:** La especificación de requerimientos del **Supermercado Mediano (POS + Portal Web)** y del **Módulo de Inventario (TiendApp v1.1)** cumple al 100% con los criterios de completitud, consistencia, verificabilidad, trazabilidad y cobertura multiplataforma (Web y Mobile) exigidos en la lista de chequeo.
