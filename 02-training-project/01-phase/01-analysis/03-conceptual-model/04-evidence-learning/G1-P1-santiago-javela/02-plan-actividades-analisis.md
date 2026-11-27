# Plan de Actividades de Análisis · Gestión Neiva (POS SaaS)

- **Metodología seleccionada:** Scrum con prácticas técnicas de XP (iteraciones cortas, refinamiento de backlog y validación incremental).
- **Autor:** `@SantiagoJavelaOspino`
- **Horizonte de análisis:** Sprint 0 (Planificación y análisis base) y Refinamiento de Sprint 1 (noviembre de 2026).

---

## 1. Cronograma y actividades priorizadas de análisis (8 actividades)

| Prioridad | ID | Actividad de análisis (coherente con Scrum) | Responsable | Fecha límite | Entregable verificable |
|---|---|---|---|---|---|
| **Alta (P1)** | ACT-01 | Consolidar y depurar el *Product Backlog* inicial (10 RF, 5 RNF y 7 reglas de negocio) a partir del SRS del equipo. | `@SantiagoJavelaOspino` (Analista / Product Backlog Owner) | 2026-11-22 | `01-srs-gestion-neiva.md` (SRS base consolidado en `03-execute`) |
| **Alta (P1)** | ACT-02 | Caracterizar la solución, comparar 4 metodologías y formalizar el marco de trabajo Scrum + prácticas XP. | `@SantiagoJavelaOspino` (Analista) | 2026-11-23 | `01-caracterizacion-y-metodologias.md` |
| **Alta (P1)** | ACT-03 | Elaborar el diagrama de casos de uso UML (frontera, actores, 10 CU, «include» y «extend») y la matriz RF → CU. | `@SantiagoJavelaOspino` (Analista UML) | 2026-11-24 | `04-diagrama-casos-uso.drawio`, `.svg` y `03-matriz-requisitos-casos-uso.md` |
| **Alta (P2)** | ACT-04 | Modelar los flujos detallados de los casos de uso críticos mediante diagramas de actividades UML con calles y guardas. | `@SantiagoJavelaOspino` (Analista de procesos) | 2026-11-25 | `01-diagramas-actividades.md`, `.drawio` y `.svg` (en G1-P2) |
| **Alta (P2)** | ACT-05 | Redactar las plantillas extendidas (Anexo A) de los 3 casos de uso críticos (venta POS, reabastecimiento y alertas). | `@SantiagoJavelaOspino` (Analista funcional) | 2026-11-25 | `02-plantillas-casos-uso.md` (en G1-P2) |
| **Media (P3)** | ACT-06 | Abstraer el modelo de dominio conceptual (clases de negocio sin métodos) y estructurar el Modelo Entidad-Relación (MER). | `@SantiagoJavelaOspino` (Modelador de datos) | 2026-11-26 | `03-modelo-dominio.*` y `04-modelo-entidad-relacion.*` (en G1-P2) |
| **Media (P3)** | ACT-07 | Construir el prototipo inicial navegable (3 pantallas rotuladas con su CU) para validación tipo *Sprint Review* con tenderos. | `@SantiagoJavelaOspino` (Diseñador UX/Analista) | 2026-11-27 | `05-prototipo-inicial.html` (en G1-P2) |
| **Alta (P4)** | ACT-08 | Ejecutar verificación formal con lista de chequeo (≥ 15 criterios), registrar ajustes, segunda verificación e informe final de análisis. | `@SantiagoJavelaOspino` (QA / Verificador) | 2026-11-28 (antes de 6:00 a. m.) | `06-lista-chequeo-y-ajustes.md`, `07-informe-analisis.md` y `08-matriz-trazabilidad.md` |

## 2. Criterios de coherencia con Scrum

- **Priorización por valor de negocio:** Primero se asegura el alcance del núcleo POS y multi-tenant (`ACT-01` a `ACT-05`) antes de pasar al prototipado y verificación de cierre (`ACT-07` y `ACT-08`).
- **Validación incremental:** El prototipo de 3 pantallas (`ACT-07`) sirve como insumo directo de *Sprint Review* para recibir retroalimentación rápida del tendero antes de escribir código de producción.
- **Definición de Terminado (*Definition of Done* del análisis):** Todo artefacto debe superar la lista de chequeo de calidad (`ACT-08`), contar con trazabilidad ≥ 90 % a los RF y quedar versionado en GitHub.
