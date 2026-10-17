# PREGUNTAS DE ACLARACIÓN DE ALCANCE Y VACÍOS DE ESPECIFICACIÓN — ORDERFLOW ENGINE

> **Rol:** Senior Business Analyst & Software Architect  
> **Fecha:** 17 de octubre de 2026  
> **Alcance del análisis:** Estrictamente acotado al enunciado oficial ([`assignment/Prueba_Tecnica_Tech_Lead_1.pdf`](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/assignment/Prueba_Tecnica_Tech_Lead_1.pdf)) y a los documentos del repositorio `orderflow-engine-docs` (`spec/SPEC.md`, `spec/data-model.md`, `spec/api-contract.md`, `spec/plan.md`, `deliverables/adr/0001-order-pricing-and-confirmation.es.pdf`).

Tras auditar cruzadamente el enunciado original del cliente frente a las especificaciones técnicas (`SPEC.md`, `data-model.md`, `api-contract.md` y `ADR-0001`), se comprobó que varios aspectos básicos ya fueron resueltos mediante los supuestos `A-01`..`A-10` (como el prorrateo por *Largest Remainder* en combos de un solo uso, el bloqueo `FOR UPDATE` en concurrencia o el alcance por tenant de las claves de idempotencia). Sin embargo, **existen 5 puntos ciegos críticos dentro del alcance estricto de la prueba** donde la documentación actual es ambigua, carece de regla de desempate o entra en contradicción interna.

---

### Pregunta #1: Criterio de precedencia y optimización cuando coexisten múltiples combos que compiten por un mismo SKU

- **Requisito / Escenario de la prueba relacionado:**
  - Enunciado original: [`assignment/Prueba_Tecnica_Tech_Lead_1.pdf`](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/assignment/Prueba_Tecnica_Tech_Lead_1.pdf) (Parte A1 — *"Sobre el precio actúan varias palancas comerciales que pueden coexistir en el mismo pedido"* y *"Define y documenta el orden de aplicación y por qué ese orden es el correcto"*).
  - Especificación técnica: [`spec/SPEC.md` §3 `BR-03` (línea 120)](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/spec/SPEC.md#L120) y [`spec/data-model.md` §2 `combo_rules` (línea 54)](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/spec/data-model.md#L54).

- **La Pregunta (Redactada con precisión ejecutiva y técnica):**
  > *"Cuando un carrito cumple simultáneamente las condiciones de dos o más combos activos que comparten al menos un SKU (por ejemplo, el Combo A requiere `2 COLA + 1 CHIPS` y el Combo B requiere `2 COLA + 1 AGUA`), ¿cuál debe ser la regla de negocio para decidir qué combo consume primero las unidades compartidas: debemos maximizar el ahorro total a favor del tendero, aplicar una prioridad comercial explícita definida en catálogo, o mantener el orden arbitrario por identificador técnico (`combo_rules.id` UUID) que plantea actualmente `BR-03`?"*

- **Qué falta o por qué es ambiguo en `docs`:**
  - En [`spec/SPEC.md` `BR-03`](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/spec/SPEC.md#L120) se establece literalmente: *"When several combos could apply, they are evaluated in combo-id order, each on the units left by the previous ones"*, y en [`spec/data-model.md` §0 y §2](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/spec/data-model.md#L20) se define que `combo_rules.id` es un `UUIDv7` generado al insertar la regla.
  - Además, en el algoritmo de prorrateo *Largest Remainder* ([`SPEC.md` `BR-03` líneas 122–126](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/spec/SPEC.md#L122-L126)), el paso 3 indica *"Ties go by SKU-code order"*, pero **no define si las fracciones intermedias antes de comparar restos se calculan con escala decimal finita (`BigDecimal.divide` con `MathContext` o escala fija) o mediante aritmética racional exacta (`remainders = (discount * lineGross) % totalComboGross`)**, lo cual puede cambiar qué SKU gana el empate en divisiones periódicas (ej. $1/3$).

- **Riesgo técnico o de negocio si no se define:**
  - **Impacto comercial:** Ordenar por `UUIDv7` significa que el combo creado cronológicamente primero en la base de datos consumirá las unidades del carrito aunque otorgue un descuento menor al tendero que un combo promocional más reciente, provocando reclamos comerciales y precios subóptimos.
  - **Impacto en pruebas automatizadas:** Si un desarrollador calcula los restos del prorrateo en `LargestRemainderAllocator` dividiendo con `DECIMAL128` y otro usa el residuo entero `(comboDiscount * lineGross) mod totalGross`, en un combo de 3 productos con precios iguales obtendrán distintos ganadores del centavo residual, rompiendo el *Golden Test 4* (`GT-04`) y la base gravable por línea.

- **Propuesta de solución / Supuesto técnico recomendado:**
  1. Para el prorrateo del combo (`LargestRemainderAllocator`), formalizar que el cálculo de cuota entera y residuo se realice con aritmética entera exacta sobre unidades mínimas de la moneda: $\text{cuota}_i = \lfloor \frac{\text{descuento} \times \text{bruto}_i}{\text{brutoTotal}} \rfloor$ y $\text{residuo}_i = (\text{descuento} \times \text{bruto}_i) \bmod \text{brutoTotal}$, evitando divisiones decimales infinitas antes del desempate por `sku`.
  2. Para múltiples combos en conflicto, ordenar determinísticamente por **mayor descuento monetario por aplicación (`comboDiscount DESC`)** y usar `combo_rules.id ASC` únicamente como criterio final de desempate.

---

### Pregunta #2: Tratamiento del impuesto sobre obsequios (`TAXED`) frente al total a pagar y al consumo del cupo de crédito

- **Requisito / Escenario de la prueba relacionado:**
  - Enunciado original: [`assignment/Prueba_Tecnica_Tech_Lead_1.pdf`](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/assignment/Prueba_Tecnica_Tech_Lead_1.pdf) (Parte A1 — Palanca **Obsequio**: *"El obsequio no paga producto, pero sí puede tener implicaciones tributarias"* y **Golden Test 3**: *"Un pedido con obsequio: el producto gratis aparece con su cantidad en el desglose"*).
  - Especificación técnica: [`spec/SPEC.md` `BR-04` y `BR-05` (líneas 141–162)](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/spec/SPEC.md#L141-L162) y [`deliverables/adr/0001-order-pricing-and-confirmation.es.pdf`](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/deliverables/adr/0001-order-pricing-and-confirmation.es.pdf) (*Confianza: "Alta. Media en el impuesto del obsequio"*).

- **La Pregunta (Redactada con precisión ejecutiva y técnica):**
  > *"En los países cuya política fiscal grava los obsequios (`gift_tax_policy = 'TAXED'`, como Colombia y Perú en las semillas), el diseño actual suma el impuesto del obsequio (`referenceValue × taxRate`) directamente al `total` a pagar por el tendero y lo descuenta de su cupo de crédito disponible (`BR-04`, `BR-05`). ¿El negocio confirma que el IVA del producto de regalo debe cobrarse al tendero dentro del `total` del pedido y consumir su cupo de crédito, o debe reportarse únicamente como impuesto informativo/asumido por el distribuidor sin incrementar el `total` a pagar por el cliente?"*

- **Qué falta o por qué es ambiguo en `docs`:**
  - El propio autor del proyecto reconoce esta ambigüedad en la cabecera de [`ADR-0001`](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/deliverables/adr/0001-order-pricing-and-confirmation.es.pdf), calificando su nivel de confianza como *"Media en el impuesto del obsequio"*.
  - Además, en [`SPEC.md` `BR-04`](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/spec/SPEC.md#L141-L151), cuando una regla de obsequio se dispara por subtotal bruto mínimo (`min_gross`), no queda explícito qué ocurre si en un mismo tenant existen **dos reglas de obsequio activas que entregan el mismo `gift_product_id`**: en [`data-model.md` §4 `quote_lines`](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/spec/data-model.md#L72) cada línea guarda un único `gift_rule_id`, pero no se especifica el orden determinista en que se insertan múltiples líneas de regalo (`line_no`) cuando varias `gift_rules` se activan en el mismo pedido.

- **Riesgo técnico o de negocio si no se define:**
  - Si un tendero recibe un obsequio "gratis" pero el pedido rechaza su compra por `409 CREDIT_LIMIT_EXCEEDED` debido a que el IVA del regalo superó su cupo disponible, se genera una fricción comercial severa si la expectativa del negocio era que la marca asumiera esa retención tributaria.
  - Si dos reglas de regalo se activan al mismo tiempo y no tienen un `ORDER BY id ASC` explícito al generar las líneas de regalo, la respuesta JSON de `lines[]` y `totals.gifts[]` podría variar de orden entre ejecuciones.

- **Propuesta de solución / Supuesto técnico recomendado:**
  - Mantener la identidad contable `total = Σ line.net + taxes` (`BR-05`) donde en jurisdicciones `TAXED` el impuesto del obsequio se integra al total y al consumo de crédito (tal como está en `SPEC.md`), y explicitar en `BR-04` que las reglas de obsequio activas se evalúan y emiten en orden estricto de `gift_rules.id ASC`, generando una línea independiente por cada `gift_rule_id` disparada sin fusionarlas entre sí.

---

### Pregunta #3: Contradicción entre `data-model.md` y `plan.md` sobre la inmutabilidad de la descripción del producto y vigencias en cotizaciones selladas

- **Requisito / Escenario de la prueba relacionado:**
  - Enunciado original: [`assignment/Prueba_Tecnica_Tech_Lead_1.pdf`](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/assignment/Prueba_Tecnica_Tech_Lead_1.pdf) (Parte A1 — *"El total cotizado y el total confirmado deben ser idénticos. Diseña para que no puedan divergir, aunque las palancas o los precios cambien entre un momento y otro"* y Parte A3 — Riesgo de `ADR-0001`).
  - Especificación técnica: [`spec/data-model.md` §4 y §6 (líneas 72 y 97)](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/spec/data-model.md#L97) vs. [`spec/plan.md` §3 (línea 69)](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/spec/plan.md#L69) y [`ADR-0001`](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/deliverables/adr/0001-order-pricing-and-confirmation.es.pdf).

- **La Pregunta (Redactada con precisión ejecutiva y técnica):**
  > *"Detectamos una contradicción directa en la documentación respecto a qué datos se sellan en la cotización: mientras `data-model.md` (§6) indica que la descripción del SKU (`description`) no se guarda en `quote_lines` sino que se lee en vivo desde `products.name`, `plan.md` (§3) afirma que cada línea de cotización conserva la descripción con la que fue sellada para que un pedido confirmado jamás cambie. Asimismo, si entre el momento de cotizar ($T_1$) y el de confirmar ($T_2$, dentro del TTL de 15 min) la cuenta de crédito del cliente es deshabilitada o el SKU es retirado del catálogo, ¿la confirmación (`POST /api/v1/orders`) debe honrar ciegamente la cotización sellada o debe rechazar la operación?"*

- **Qué falta o por qué es ambiguo en `docs`:**
  1. **Contradicción documental verificada:**
     - [`spec/data-model.md` §6 (línea 97)](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/spec/data-model.md#L97): `description` $\rightarrow$ `products.name (current name, not captured)`.
     - [`spec/plan.md` §3 (línea 69)](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/spec/plan.md#L69): *"A quote line keeps the description it was sealed with, so a confirmed order never changes"*.
  2. **Vacío en el límite de la inmutabilidad (`SPEC §6` vs `SPEC §7.1`):** En [`SPEC.md` §7.1](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/spec/SPEC.md#L244-L253) el Paso 3 ejecuta `UPDATE credit_accounts SET consumed = consumed + :total WHERE ... AND consumed + :total <= credit_limit`. Si el cliente tenía cuenta de crédito al cotizar en $T_1$, pero su cuenta de crédito fue eliminada o bloqueada antes de confirmar en $T_2$, el `UPDATE` afectará `0` filas y el sistema devolverá `409 CREDIT_LIMIT_EXCEEDED` ([`api-contract.md` `E-03` línea 121](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/spec/api-contract.md#L121)) en lugar de `422 CREDIT_NOT_ENABLED`, mezclando dos causas de negocio distintas.

- **Riesgo técnico o de negocio si no se define:**
  - Si un distribuidor modifica el nombre o presentación de un SKU en `products.name` (ej. de *"Gaseosa 350 ml pack x6"* a *"Gaseosa 350 ml unidad"*), todos los pedidos históricos ya confirmados (`GET /api/v1/orders/{orderId}`) cambiarán retroactivamente la descripción de lo que el cliente compró, alterando el respaldo comercial de la orden.

- **Propuesta de solución / Supuesto técnico recomendado:**
  - Alinear la documentación con `data-model.md §6` para la entrega actual (donde `unit_price`, `tax_rate`, `taxable_base` y `tax` están sellados en `quote_lines` y garantizan el 100% de la invariante monetaria `G-1`), o bien capturar `product_name` en `quote_lines` para sellar también la descripción comercial del ítem.

---

### Pregunta #4: Definición de "JSON canónico" para el cálculo de `request_hash` en `POST /api/v1/orders` y ventana de expiración de `Idempotency-Key`

- **Requisito / Escenario de la prueba relacionado:**
  - Enunciado original: [`assignment/Prueba_Tecnica_Tech_Lead_1.pdf`](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/assignment/Prueba_Tecnica_Tech_Lead_1.pdf) (Parte A2 — *"POST /orders acepta una clave de idempotencia. Reintentos del cliente (mala red, doble tap, reintento de la app) no pueden crear pedidos duplicados ni consumir el cupo dos veces"*).
  - Especificación técnica: [`spec/SPEC.md` §7.1, §7.3 y §12 (líneas 254, 259–270, 527)](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/spec/SPEC.md#L254) y [`spec/api-contract.md` `E-03` (líneas 98, 122–123)](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/spec/api-contract.md#L98).

- **La Pregunta (Redactada con precisión ejecutiva y técnica):**
  > *"En `SPEC.md` (§7.1) y `api-contract.md` (`E-03`) se define que `request_hash = SHA-256(method + path + customerId + canonical JSON body)` y que cualquier propiedad extra enviada en el body es ignorada por la operación pero incluida en el hash (devolviendo `422 IDEMPOTENCY_KEY_REUSED` si difiere). ¿Cuál es la regla exacta de canonización del JSON (¿RFC 8785 JCS ordenando claves recursivamente y eliminando espacios en blanco, o el string crudo tras deserializar/reserializar el DTO?), y qué código HTTP (`201` replay vs. `409 QUOTE_ALREADY_CONFIRMED`) se espera si un cliente reintenta con la misma `Idempotency-Key` después de las 24 horas en que el job de retención (`HousekeepingJob`) purgó la clave?"*

- **Qué falta o por qué es ambiguo en `docs`:**
  1. **Ambigüedad en `canonical JSON body`:** En [`api-contract.md` `E-03` (línea 98)](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/spec/api-contract.md#L98) se afirma: *"Any other property is ignored by the operation, but it is part of the request hash (SPEC §7.1), so a retry must resend the same body"*. Si el controlador de Spring Boot deserializa el body directamente en un `record ConfirmOrderRequest(String quoteId)`, Jackson descartará las propiedades desconocidas salvo que se parsee el árbol `JsonNode` completo y se ordene canónicamente. Además, no se especifica el separador entre `method`, `path`, `customerId` y `body` al alimentar el `SHA-256`.
  2. **Interacción entre `lock_timeout` y fallo de la primera petición en vuelo:** En [`SPEC.md` §7.3 (línea 265)](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/spec/SPEC.md#L265) se dice: *"Same key while the first request is still in flight: Waits up to `lock_timeout`, then replays"*. Pero si la primera petición que estaba en vuelo termina haciendo **ROLLBACK** (por ejemplo, por un fallo transitorio), cuando la segunda petición despierta del bloqueo en PostgreSQL, la fila en `idempotency_keys` ya no existe; los documentos no especifican si esa segunda petición en espera debe proceder a ejecutar la confirmación por sí misma o reintentar el paso 1 dentro de la misma transacción.

- **Riesgo técnico o de negocio si no se define:**
  - Si un cliente móvil envía `{"quoteId":"..."}` en el primer intento y en el reintento su librería HTTP formatea con espacios `{"quoteId": "..."}`, un hash calculado sobre los bytes crudos del body en lugar de un `JsonNode` canonizado rechazará erróneamente el reintento legítimo con `422 IDEMPOTENCY_KEY_REUSED`.
  - Si la primera transacción concurrente hace rollback y la segunda que esperaba en el índice único solo hace `SELECT` de `idempotency_keys` asumiendo que la fila ya fue confirmada, encontrará `Optional.empty()` y podría fallar con un `500 INTERNAL_ERROR` si no re-ejecuta el `INSERT` de adquisición de la clave.

- **Propuesta de solución / Supuesto técnico recomendado:**
  - Parsear el cuerpo entrante como `JsonNode` con `MapperFeature.SORT_PROPERTIES_ALPHABETICALLY` y serializarlo sin espacios antes de aplicar `SHA-256`.
  - En concurrencia con la misma clave, si tras desbloquearse el `INSERT ... ON CONFLICT DO NOTHING` el `SELECT` posterior no encuentra la fila (porque la primera transacción hizo rollback), reintentar el bucle de adquisición de la clave dentro del caso de uso.
  - Pasadas las 24h de retención (`SPEC §12`), el comportamiento esperado y seguro es responder `409 QUOTE_ALREADY_CONFIRMED` incluyendo el `orderId` y `orderNumber` existentes (`BD-03`), lo cual sigue impidiendo duplicar el pedido o consumir cupo dos veces.

---

### Pregunta #5: Reconciliación operativa y estado del pedido cuando un evento en `outbox_events` pasa a estado `DEAD`

- **Requisito / Escenario de la prueba relacionado:**
  - Enunciado original: [`assignment/Prueba_Tecnica_Tech_Lead_1.pdf`](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/assignment/Prueba_Tecnica_Tech_Lead_1.pdf) (Parte A2 — *"La confirmación dispara efectos hacia afuera — al menos: notificación push al tendero y publicación del pedido para el ERP. Explica cómo garantizas que esos efectos no se pierdan ni se dupliquen, y qué pasa si el sistema externo está caído. Documenta el modelo de consistencia que elegiste y qué se sacrifica"*).
  - Especificación técnica: [`spec/SPEC.md` §7.4 y §7.5 (líneas 272–288)](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/spec/SPEC.md#L272-L288), [`spec/plan.md` §2 y §4 `RISK-02`](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/spec/plan.md#L76) y [`diagrams/09-outbox-lifecycle.svg`](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/diagrams/09-outbox-lifecycle.svg).

- **La Pregunta (Redactada con precisión ejecutiva y técnica):**
  > *"Según `SPEC.md` (§7.4) y `plan.md` (§2), cuando el ERP está caído o responde con un error, el `OutboxRelay` reintenta con backoff exponencial (base `2s`, máx. `5m`) hasta un máximo de `8` intentos (`app.outbox.max-attempts = 8`, es decir, unos pocos minutos de ventana total) o ante el primer error `4xx`, marcando el evento como `DEAD` mientras el pedido permanece `CONFIRMED` y el cupo de crédito sigue consumido. Si una caída del ERP supera esa ventana de ~10–15 minutos y los eventos pasan a `DEAD`, ¿el reencolado (`DEAD → PENDING`) debe ocurrir únicamente mediante intervención SQL manual de operaciones como sugiere `09-outbox-lifecycle.svg`, o debemos distinguir entre caídas de red/5xx (reintento indefinido sin pasar a `DEAD`) y rechazos de contrato `4xx` (pasar a `DEAD`)?"*

- **Qué falta o por qué es ambiguo en `docs`:**
  - En [`SPEC.md` §7.4 punto 6 (línea 280)](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/spec/SPEC.md#L280) se afirma: *"External system down. The order stays confirmed. The effect waits in the outbox and is delivered when the system recovers"*.
  - Sin embargo, en el punto 3 de la misma sección ([línea 275](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/spec/SPEC.md#L275)) y en [`plan.md` §2](file:///C:/Users/Aprendiz/Downloads/orderflow-engine-docs-main/orderflow-engine-docs-main/spec/plan.md#L47-L48) se fija `max-attempts = 8` con `backoff.base = 2s`. Con 8 intentos ($2\text{s}, 4\text{s}, 8\text{s}, 16\text{s}, 32\text{s}, 64\text{s}, 128\text{s}$ con *full jitter*), **en menos de 5 a 10 minutos de caída del ERP el evento agota sus 8 intentos y pasa a estado `DEAD`**, dejando de ser reclamado automáticamente por el `OutboxRelay` cuando el ERP se recupere, lo cual contradice la afirmación de que *"se entrega automáticamente cuando el sistema se recupera"* ante caídas prolongadas (`RISK-02`).

- **Riesgo técnico o de negocio si no se define:**
  - En un entorno real B2B, una ventana de mantenimiento o caída de un ERP suele durar entre 15 y 60 minutos. Con `max-attempts = 8` a partir de `2s`, todos los pedidos confirmados durante una caída de 15 minutos terminarán en `DEAD` y **no se entregarán solos cuando el ERP vuelva a estar en línea**, requiriendo intervención manual para evitar pedidos cobrados en el cupo del tendero que nunca llegan al centro de distribución.

- **Propuesta de solución / Supuesto técnico recomendado:**
  - Mantener la máquina de estados `PENDING → SENT | DEAD` tal como la exigen los criterios de aceptación `AC-33` y `AC-35` para no romper los tests de integración (`OutboxRelayIT#outageRecovery` y `OutboxRelayIT#dead`), pero documentar explícitamente en la sección *Operations* y en la sustentación técnica el procedimiento exacto de reencolado (`UPDATE outbox_events SET status = 'PENDING', attempts = 0, next_attempt_at = now(), locked_until = NULL WHERE status = 'DEAD'`) y recomendar que en producción `max-attempts` se configure para cubrir ventanas de caída de varias horas o que los fallos de conectividad pura no agoten intentos tan rápido como los errores de payload.
