# Lista de Chequeo de Validación (Anexo B) y Registro de Ajustes (Anexo D)

- **Caso de estudio:** Gestión Neiva — Sistema POS SaaS Multi-Tenant e Inventario Inteligente.
- **Autor:** `@SantiagoJavelaOspino`
- **Alcance de la verificación:** Artefactos de análisis de `G1-P1-santiago-javela` y `G1-P2-santiago-javela`.

---

## 1. Lista de chequeo de validación (18 criterios verificables — incluye 5 de cobertura/trazabilidad)

> **Nota:** La columna «1.ª verificación» muestra el resultado inicial durante la revisión de borrador; los criterios con hallazgo (`No`) fueron corregidos y re-verificados en la sección 2 (Registro de ajustes).

| # | Tipo | Criterio verificable (Sí / No) | Artefacto | 1.ª verif. | Evidencia (enlace o cita) | Hallazgo |
|---|---|---|---|---|---|---|
| 1 | Cobertura | ¿Cada uno de los 10 RF del SRS aparece cubierto en al menos un caso de uso en la matriz RF → CU (≥ 90 %)? | Matriz RF→CU | Sí | `G1-P1/03-matriz-requisitos-casos-uso.md` (10/10 = 100 %) | Ninguno |
| 2 | Cobertura | ¿Se separan explícitamente los 5 RNF de los RF sin modelarlos como casos de uso? | Matriz RF→CU | Sí | `G1-P1/03-matriz-requisitos-casos-uso.md` sección 2 | Ninguno |
| 3 | Cobertura | ¿El 100 % de los RF se traza hasta caso de uso, clase de dominio y entidad del MER en la matriz de trazabilidad? | Matriz trazabilidad | **No** → Sí | `G1-P2/08-matriz-trazabilidad.md` | **H-01:** Faltaba trazar `RF-03` hacia `Categoria` recursiva y `Proveedor`. |
| 4 | Cobertura | ¿Todo concepto sustantivo citado en las 3 plantillas extendidas existe en el modelo de dominio? | Dominio y plantillas | **No** → Sí | `G1-P2/03-modelo-dominio.md` vs `02-plantillas-casos-uso.md` | **H-02:** `CompraReabastecimiento` aparecía en `CU-07` pero no en el primer borrador del dominio. |
| 5 | Cobertura | ¿Cada pantalla del prototipo inicial está rotulada con su caso de uso y no hay pantallas huérfanas? | Prototipo inicial | Sí | `G1-P2/05-prototipo-inicial.html` (CU-06, CU-07, CU-09) | Ninguno |
| 6 | Metodología | ¿La caracterización cubre los 4 aspectos (tipo, equipo, estabilidad, disponibilidad del cliente)? | Caracterización | Sí | `G1-P1/01-caracterizacion-y-metodologias.md` sección 1 | Ninguno |
| 7 | Metodología | ¿Se comparan ≥ 3 metodologías usando criterios derivados de la caracterización y se justifica la selección? | Metodologías | Sí | `G1-P1/01-caracterizacion-y-metodologias.md` secciones 2 y 3 (4 metodologías) | Ninguno |
| 8 | Plan | ¿El plan de análisis contiene ≥ 6 actividades con responsable, fecha y entregable coherentes con Scrum? | Plan de análisis | Sí | `G1-P1/02-plan-actividades-analisis.md` (8 actividades) | Ninguno |
| 9 | Casos de uso | ¿El diagrama de casos de uso tiene frontera del sistema, actores fuera, ≥ 8 CU con verbo+objeto y sin ciclos? | Diagrama CU | Sí | `G1-P1/04-diagrama-casos-uso.svg` y `.drawio` (12 CU, 5 actores) | Ninguno |
| 10 | Casos de uso | ¿Cada relación `«include»` y `«extend»` tiene dirección correcta y justificación escrita en una línea? | Diagrama CU y matriz | **No** → Sí | `G1-P1/03-matriz-requisitos-casos-uso.md` sección 3 | **H-03:** En borrador inicial, la flecha de `CU-11` (`«extend»`) apuntaba en sentido inverso. |
| 11 | Actividades | ¿Existen ≥ 2 diagramas de actividades con calles por actor y decisiones con guardas entre corchetes que cubran todas las salidas? | Diagramas actividades | **No** → Sí | `G1-P2/01a-actividad-venta-pos.svg` y `01b-actividad-reabastecimiento.svg` | **H-04:** En `CU-07` faltaba la rama `[producto no perecedero]` en la decisión de caducidad. |
| 12 | Actividades | ¿Cada rama alterna o de excepción de los diagramas de actividades coincide con la plantilla del mismo caso? | Actividades y plantillas | Sí | `G1-P2/01-diagramas-actividades.md` vs `02-plantillas-casos-uso.md` | Ninguno |
| 13 | Plantillas | ¿Las ≥ 3 plantillas extendidas tienen precondiciones, ≥ 6 pasos, ≥ 1 flujo alterno, ≥ 1 excepción y postcondiciones sin detalle técnico? | Plantillas CU | **No** → Sí | `G1-P2/02-plantillas-casos-uso.md` | **H-05:** En borrador de `CU-06` aparecía «retorna HTTP 422» (detalle de implementación). |
| 14 | Dominio | ¿El modelo de dominio tiene ≥ 8 clases conceptuales sin métodos ni claves foráneas, con multiplicidades y generalización/clase asociación? | Modelo de dominio | Sí | `G1-P2/03-modelo-dominio.svg` (12 clases, herencia `Usuario`, clase asociación `LineaVenta`) | Ninguno |
| 15 | MER | ¿El MER declara notación, incluye ≥ 6 entidades, identificadores, cardinalidad, participación, N:M resuelta y entidad débil/recursiva? | MER | **No** → Sí | `G1-P2/04-modelo-entidad-relacion.svg` | **H-06:** Faltaba indicar participación obligatoria/opcional en la relación `PRODUCTO`–`LOTE_PRODUCTO` y marcar `LOTE_PRODUCTO` como entidad débil. |
| 16 | Prototipo | ¿El prototipo cubre los 3 casos de uso críticos (`CU-06`, `CU-07`, `CU-09`) con campos coherentes con las reglas de negocio? | Prototipo inicial | Sí | `G1-P2/05-prototipo-inicial.html` | Ninguno |
| 17 | Trazabilidad | ¿Todos los diagramas tienen fuente editable (`.drawio`) e imagen exportada (`.svg`) legible? | Todos los diagramas | Sí | `.drawio` + `.svg` en G1-P1 y G1-P2 | Ninguno |
| 18 | Autoría | ¿Los `README.md` omiten datos personales reales y declaran reutilización, ajustes, commits e IA? | README G1-P1 y G1-P2 | Sí | `G1-P1/README.md` y `G1-P2/README.md` | Ninguno |

---

## 2. Registro de ajustes y segunda verificación (Anexo D — 6 hallazgos corregidos)

| # | Hallazgo (criterio que no cumplía) | Artefacto | Antes | Después | Commit de corrección | ¿Se verificó de nuevo? |
|---|---|---|---|---|---|---|
| **H-01** | Criterio 3: Trazabilidad incompleta de `RF-03` hacia modelo de dominio y MER. | `08-matriz-trazabilidad.md` | `RF-03` solo enlazaba a `Categoria` sin mencionar `Proveedor` ni su relación recursiva. | Se completó la fila de `RF-03` trazando a `Categoria` (recursiva) y `Proveedor` en dominio y MER. | Commit de cierre G1-P2 (2026-11-28) | **Sí — Cumple** |
| **H-02** | Criterio 4: Concepto de plantilla ausente en el modelo de dominio. | `03-modelo-dominio.drawio` / `.svg` / `.md` | `CU-07` mencionaba el registro de compra a proveedor, pero el dominio solo tenía `Proveedor` y `LoteProducto`. | Se incorporó la clase conceptual `CompraReabastecimiento` con sus atributos (`fechaCompra`, `cantidadIngresada`, `costoUnitario`) y asociaciones a `Proveedor` y `Producto`. | Commit de cierre G1-P2 (2026-11-28) | **Sí — Cumple** |
| **H-03** | Criterio 10: Dirección invertida de relación `«extend»` en casos de uso. | `G1-P1/04-diagrama-casos-uso.drawio` / `.svg` | La flecha punteada iba de `CU-06` hacia `CU-11 · Aplicar descuento por volumen`. | Se corrigió la dirección UML: la flecha `«extend»` va del caso que extiende (`CU-11`) hacia el caso base (`CU-06`), con punto de extensión documentado. | Commit de cierre G1-P1 (2026-11-28) | **Sí — Cumple** |
| **H-04** | Criterio 11: Decisión con salida faltante en diagrama de actividades de `CU-07`. | `01b-actividad-reabastecimiento.drawio` / `.svg` | El rombo «¿Es perecedero?» solo mostraba la salida `[sí]` hacia solicitud de vencimiento. | Se agregó la rama explícita con guarda `[producto no perecedero]` que omite el lote y converge en la confirmación del reabastecimiento, alineado con el flujo alterno `4a`. | Commit de cierre G1-P2 (2026-11-28) | **Sí — Cumple** |
| **H-05** | Criterio 13: Detalle de implementación técnica dentro de plantilla de caso de uso. | `02-plantillas-casos-uso.md` | La excepción `6a` de `CU-06` indicaba «el backend retorna error HTTP 422 Unprocessable Entity». | Se reescribió como intención de negocio pura: «el Sistema cancela toda la operación sin modificar el inventario e indica qué producto se agotó y cuántas unidades quedan disponibles». | Commit de cierre G1-P2 (2026-11-28) | **Sí — Cumple** |
| **H-06** | Criterio 15: Falta de identificación explícita de entidad débil y participación en el MER. | `04-modelo-entidad-relacion.drawio` / `.svg` / `.md` | `LOTE_PRODUCTO` aparecía con borde simple y sin llave identificadora compuesta. | Se marcó `LOTE_PRODUCTO` como entidad débil con doble borde, clave identificadora `(id_producto, codigo_lote)` y participación obligatoria `(1,1)` hacia `PRODUCTO`. | Commit de cierre G1-P2 (2026-11-28) | **Sí — Cumple** |

**Resultado tras la segunda verificación:** **18 / 18 criterios cumplidos (100 %)**; todos los hallazgos (`H-01` a `H-06`) fueron corregidos y verificados.
