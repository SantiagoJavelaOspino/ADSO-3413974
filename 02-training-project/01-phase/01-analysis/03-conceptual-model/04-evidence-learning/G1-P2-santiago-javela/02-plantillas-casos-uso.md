# Plantillas Extendidas de Casos de Uso (Anexo A) · Gestión Neiva

- **Autor:** `@SantiagoJavelaOspino`
- **Casos de uso críticos especificados:** `CU-06`, `CU-07` y `CU-08` (redactados como intención de negocio, sin detalles de implementación técnica ni SQL).

---

## Plantilla 1 · `CU-06 · Registrar venta en POS`

| Campo | Contenido |
|---|---|
| **Identificador y nombre** | `CU-06 · Registrar venta en POS` |
| **Requisitos que atiende** | `RF-05`, `RF-06`, `RF-07` |
| **Actor primario / secundarios** | Primario: Cajero (o Administrador de Tienda). Secundario: Ninguno. |
| **Objetivo del actor** | Cobrar rápidamente los productos seleccionados por un comprador y descontar de forma exacta las existencias del inventario de su tienda. |
| **Precondiciones** | El usuario inició sesión en su tienda y tiene un turno activo con productos vigentes en el catálogo. |
| **Disparador** | El Cajero abre el terminal de punto de venta e inicia un nuevo carrito de cobro. |
| **Flujo principal** | 1. El Cajero busca o escanea el código de barras de un producto activo de la tienda.<br>2. El Sistema localiza el producto en el catálogo de la tienda y muestra su nombre, precio vigente y existencias disponibles.<br>3. El Cajero indica la cantidad (unidades enteras o fracción a granel) y agrega el producto al carrito.<br>4. El Sistema calcula el subtotal de la línea y el total acumulado del carrito aplicando la política de descuento vigente.<br>5. El Cajero selecciona el medio de pago (Efectivo, Nequi o Tarjeta) y solicita confirmar la venta.<br>6. El Sistema verifica que las existencias actuales cubran todas las cantidades solicitadas del carrito.<br>7. El Sistema descuenta las cantidades del inventario, registra la venta conservando el nombre y precio unitario históricos de cada producto y muestra el comprobante de cobro. |
| **Flujos alternos** | **2a. Producto no encontrado por código de barras:** Si el escaneo no coincide con un producto activo, el Sistema informa que no se encontró coincidencia y permite al Cajero buscar manualmente por nombre para continuar en el paso 2.<br>**4a. Aplicación de descuento por volumen (`CU-11`):** Si la tienda tiene una promoción activa y la cantidad del producto supera el umbral configurado, el Sistema aplica el porcentaje de descuento correspondiente antes de mostrar el total acumulado y continúa en el paso 5. |
| **Excepciones** | **6a. Existencias insuficientes:** Si algún producto del carrito supera las existencias disponibles en el instante de confirmación, el Sistema cancela toda la operación sin modificar el inventario, indica qué producto se agotó y cuántas unidades quedan disponibles, y retorna al carrito.<br>**6b. Pago rechazado o cancelado:** Si el medio de pago no es validado o el Cajero cancela el cobro, el Sistema no registra la venta ni descuenta inventario. |
| **Postcondiciones** | La venta queda registrada con sus líneas históricas inmutables, el inventario refleja el descuento exacto de cada producto y el total de la venta corresponde a la suma de sus líneas. |
| **Reglas de negocio** | `RN-01` (No negatividad de stock), `RN-02` (Inmutabilidad de precio y nombre histórico), `RN-03` (Aislamiento por tienda), `RN-04` (Atomicidad venta + descuento), `RN-06` (Total derivado). |
| **Pantalla del prototipo** | [Pantalla 1 — Terminal POS (CU-06)](./05-prototipo-inicial.html#cu-06) |

---

## Plantilla 2 · `CU-07 · Registrar reabastecimiento y lotes`

| Campo | Contenido |
|---|---|
| **Identificador y nombre** | `CU-07 · Registrar reabastecimiento y lotes` |
| **Requisitos que atiende** | `RF-08`, `RF-03`, `RF-04` |
| **Actor primario / secundarios** | Primario: Administrador de Tienda. Secundario: Ninguno. |
| **Objetivo del actor** | Ingresar nueva mercancía adquirida a un proveedor, actualizando las existencias y registrando las fechas de vencimiento de cada lote perecedero. |
| **Precondiciones** | El Administrador inició sesión en su tienda y los productos a reabastecer existen activos en el catálogo. |
| **Disparador** | El Administrador selecciona la opción de registrar compra o entrada de mercancía. |
| **Flujo principal** | 1. El Administrador selecciona el proveedor que suministra la mercancía e indica la fecha de compra.<br>2. El Sistema valida que el proveedor pertenezca al directorio de la tienda y habilita el ingreso de productos.<br>3. El Administrador selecciona un producto del catálogo, ingresa la cantidad recibida y el costo unitario de adquisición.<br>4. El Sistema verifica si el producto es perecedero y solicita el código de lote y la fecha de vencimiento.<br>5. El Administrador ingresa los datos del lote y confirma el registro del reabastecimiento.<br>6. El Sistema valida que la cantidad sea mayor que cero y que la fecha de vencimiento sea posterior a la fecha actual.<br>7. El Sistema registra la compra, crea el lote asociado al producto, incrementa las existencias disponibles y muestra el resumen actualizado del inventario. |
| **Flujos alternos** | **1a. Proveedor nuevo:** Si el proveedor no existe en el directorio de la tienda, el Administrador registra su nombre y datos de contacto básicos desde la misma pantalla; el Sistema lo vincula a la tienda y continúa en el paso 2.<br>**4a. Producto no perecedero:** Si el producto no maneja caducidad, el Sistema omite la solicitud de fecha de vencimiento y continúa directamente en el paso 5. |
| **Excepciones** | **6a. Fecha de vencimiento vencida o cantidad inválida:** Si la fecha de vencimiento ingresada es igual o anterior a la fecha actual, o la cantidad/costo es menor o igual a cero, el Sistema rechaza el registro, indica el error específico y no modifica las existencias. |
| **Postcondiciones** | La compra queda registrada, el lote perecedero queda bajo seguimiento de caducidad y las existencias del producto aumentan exactamente en la cantidad ingresada. |
| **Reglas de negocio** | `RN-03` (Aislamiento por tienda), `RN-07` (Seguimiento de lotes con umbral de 15 días). |
| **Pantalla del prototipo** | [Pantalla 2 — Reabastecimiento y Lotes (CU-07)](./05-prototipo-inicial.html#cu-07) |

---

## Plantilla 3 · `CU-08 · Generar alertas de inventario`

| Campo | Contenido |
|---|---|
| **Identificador y nombre** | `CU-08 · Generar alertas de inventario` |
| **Requisitos que atiende** | `RF-09` |
| **Actor primario / secundarios** | Primario (Iniciador): Planificador Automático (Temporizador). Secundario: Servicio de Notificaciones. |
| **Objetivo del actor** | Identificar de manera oportuna productos con existencias en nivel crítico y lotes próximos a vencer para evitar quiebres de stock y pérdidas por merma. |
| **Precondiciones** | Existen tiendas activas con productos configurados (stock mínimo definido) y/o lotes perecederos registrados. |
| **Disparador** | El Planificador Automático alcanza la hora programada de verificación diaria (o recibe el evento de cierre de venta). |
| **Flujo principal** | 1. El Planificador Automático inicia el ciclo de evaluación de inventario para cada tienda activa.<br>2. El Sistema revisa los productos activos cuyo nivel de existencias actual es menor o igual a su stock mínimo configurado.<br>3. El Sistema revisa los lotes activos con existencias cuya fecha de vencimiento se encuentra a 15 días calendario o menos.<br>4. El Sistema verifica que no exista ya una alerta pendiente del mismo tipo para el mismo producto o lote.<br>5. El Sistema registra las nuevas alertas clasificadas por prioridad (crítica o preventiva) dentro del espacio de cada tienda.<br>6. El Sistema envía el resumen de alertas nuevas al Servicio de Notificaciones y las deja visibles en el panel financiero del Administrador. |
| **Flujos alternos** | **4a. Alerta previa aún abierta:** Si ya existe una alerta sin atender para el mismo producto o lote, el Sistema omite crear un duplicado, actualiza la fecha de última verificación y continúa con el siguiente elemento.<br>**5a. Sin novedades en la tienda:** Si todos los productos superan el stock mínimo y ningún lote está próximo a vencer, el Sistema finaliza la verificación sin generar alertas nuevas. |
| **Excepciones** | **6a. Servicio de Notificaciones no disponible:** Si el canal externo de avisos no responde, el Sistema conserva las alertas registradas en el panel interno de la tienda y registra la incidencia para reintento posterior, sin perder las alertas detectadas. |
| **Postcondiciones** | Todas las condiciones críticas de stock bajo o vencimiento próximo quedan registradas como alertas únicas y consultables por el Administrador de cada tienda. |
| **Reglas de negocio** | `RN-03` (Aislamiento por tienda), `RN-07` (Umbral de vencimiento ≤ 15 días). |
| **Pantalla del prototipo** | [Pantalla 3 — Panel Financiero y Alertas (CU-09 / CU-08)](./05-prototipo-inicial.html#cu-09) |
