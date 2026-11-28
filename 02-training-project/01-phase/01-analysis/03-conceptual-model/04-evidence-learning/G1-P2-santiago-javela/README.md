# README de entrega · Guía 1 · Modelo conceptual (Producto 2)

## 1. Datos de la entrega

- **Producto:** P2 — Modelo de análisis y verificación
- **Usuario de GitHub del autor:** `@SantiagoJavelaOspino`
- **Caso de estudio:** Gestión Neiva — Sistema POS SaaS Multi-Tenant e Inventario Inteligente
- **Trabajo en equipo del año:** Sí — Equipo Gestión Neiva (3 aprendices, Ficha 3413974; repositorio base `https://github.com/Tomasberserk/GESTION_INVENTARIO_INTELIGENTE`). Los diagramas de actividades, plantillas extendidas, modelo de dominio, MER ampliado, prototipo, lista de chequeo, registro de ajustes, informe y matriz de trazabilidad son **trabajo individual**.

## 2. Qué reutilicé

| Artefacto | Ruta original en mi fork | ¿Lo hice solo o en equipo? |
|---|---|---|
| SRS base y reglas de negocio | `03-execute/proyecto-formativo-inventario/01-srs-gestion-neiva.md` | En equipo (consolidado individualmente) |
| Modelo de datos inicial (4 tablas MVP) | `03-execute/proyecto-formativo-inventario/03-modelo-datos-base.md` | En equipo |
| Casos de uso y matriz RF→CU de G1-P1 | `02-training-project/01-phase/01-analysis/03-conceptual-model/04-evidence-learning/G1-P1-santiago-javela/` | Solo |

## 3. Qué ajusté

| # | Artefacto | Qué cambié y por qué | Enlace al commit |
|---|---|---|---|
| 1 | `04-modelo-entidad-relacion.*` (desde `03-modelo-datos-base.md`) | Amplié las 4 tablas base a 10 entidades en notación Pata de gallo con cardinalidad, participación, entidad débil `LOTE_PRODUCTO`, relación recursiva en `CATEGORIA` y N:M resuelta con `DETALLE_VENTA` (mejora C4). | [`d3dda80`](https://github.com/SantiagoJavelaOspino/ADSO-3413974/commit/d3dda80) |
| 2 | `02-plantillas-casos-uso.md` y `03-modelo-dominio.*` | Eliminé menciones a códigos HTTP (detalle de implementación) en `CU-06` y añadí la clase conceptual `CompraReabastecimiento` al dominio para coherencia total con `CU-07` (hallazgos H-02 y H-05; mejora C2 y C3). | [`d3dda80`](https://github.com/SantiagoJavelaOspino/ADSO-3413974/commit/d3dda80) |
| 3 | `06-lista-chequeo-y-ajustes.md`, `07-informe-analisis.md` y `08-matriz-trazabilidad.md` | Ejecuté la lista de chequeo de 18 criterios, registré los 6 hallazgos (`H-01`..`H-06`) con segunda verificación, cerré la trazabilidad de `RF-03` al 100 % y redacté el informe de análisis (mejora C6, C7 y C8). | Commit de cierre G1-P2 (2026-11-28) |

## 4. Qué construí nuevo

- 2 diagramas de actividades UML con calles, guardas entre corchetes y bifurcación/unión (`01a-actividad-venta-pos.*`, `01b-actividad-reabastecimiento.*`).
- 3 plantillas extendidas de casos de uso (`02-plantillas-casos-uso.md`).
- Modelo de dominio conceptual con 12 clases sin métodos, generalización y clase de asociación (`03-modelo-dominio.*`).
- Prototipo inicial interactivo con 3 pantallas rotuladas (`05-prototipo-inicial.html`).
- Lista de chequeo de 18 criterios, registro de 6 ajustes con segunda verificación, informe de análisis y matriz de trazabilidad al 100 % (`06-*`, `07-*`, `08-*`).

## 5. Artefactos entregados

**Producto 2**

- [x] Diagramas de actividades (2): [01-diagramas-actividades.md](./01-diagramas-actividades.md) · [CU-06 (.drawio)](./01a-actividad-venta-pos.drawio) / [(.svg)](./01a-actividad-venta-pos.svg) · [CU-07 (.drawio)](./01b-actividad-reabastecimiento.drawio) / [(.svg)](./01b-actividad-reabastecimiento.svg)
- [x] Plantillas extendidas de casos de uso (3): [02-plantillas-casos-uso.md](./02-plantillas-casos-uso.md)
- [x] Modelo de dominio: [03-modelo-dominio.md](./03-modelo-dominio.md) · [(.drawio)](./03-modelo-dominio.drawio) / [(.svg)](./03-modelo-dominio.svg)
- [x] Modelo entidad-relación: [04-modelo-entidad-relacion.md](./04-modelo-entidad-relacion.md) · [(.drawio)](./04-modelo-entidad-relacion.drawio) / [(.svg)](./04-modelo-entidad-relacion.svg)
- [x] Prototipo inicial (3 pantallas): [05-prototipo-inicial.html](./05-prototipo-inicial.html)
- [x] Lista de chequeo diligenciada (18 criterios): [06-lista-chequeo-y-ajustes.md](./06-lista-chequeo-y-ajustes.md)
- [x] Registro de ajustes y segunda verificación (6 hallazgos): [06-lista-chequeo-y-ajustes.md](./06-lista-chequeo-y-ajustes.md)
- [x] Informe de análisis: [07-informe-analisis.md](./07-informe-analisis.md)
- [x] Matriz de trazabilidad (Anexo C): [08-matriz-trazabilidad.md](./08-matriz-trazabilidad.md)

## 6. Declaración de autoría

- [x] Declaro que el ajuste y lo construido nuevo en esta carpeta es **mi trabajo individual**.
- [x] Declaro que lo que tomé de mi equipo o de otra fuente está identificado en la sección 2.
- [x] Entiendo que el sábado 28 de noviembre de 2026 el instructor me hará **3 preguntas orales** sobre mis productos (una del producto 1, una del producto 2 y una tercera a su elección) y que, si respondo bien menos de 2, el producto sobre el que fallé queda con tope de 50.

Firma (usuario de GitHub y fecha): `@SantiagoJavelaOspino` · 2026-11-27

## 7. Uso de inteligencia artificial

| Herramienta | Para qué la usé | Qué verifiqué o corregí yo |
|---|---|---|
| Antigravity (Gemini) | Apoyo en redacción de plantillas Anexo A, maquetación del prototipo HTML y generación de diagramas `.drawio`/`.svg`. | Revisé que ninguna plantilla incluyera SQL/HTTP, comprobé que cada rama de actividades coincide con su plantilla, verifiqué que el dominio no tiene métodos ni claves y validé los 18 criterios de chequeo. |

## 8. Autocontrol antes del push

- [x] Hice commits propios en al menos 2 días distintos entre la publicación de la guía (sábado 21 de noviembre de 2026) y la entrega (27 y 28 de noviembre antes de 6:00 a. m.).
- [x] No subí el marco documental del instructor, plantillas sin diligenciar ni archivos de otras personas.
- [x] Hice `push` y comprobé en GitHub que la carpeta está publicada.
