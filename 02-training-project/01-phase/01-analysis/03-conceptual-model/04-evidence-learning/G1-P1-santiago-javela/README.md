# README de entrega · Guía 1 · Modelo conceptual (Producto 1)

## 1. Datos de la entrega

- **Producto:** P1 — Plan de análisis y casos de uso
- **Usuario de GitHub del autor:** `@SantiagoJavelaOspino`
- **Caso de estudio:** Gestión Neiva — Sistema POS SaaS Multi-Tenant e Inventario Inteligente
- **Trabajo en equipo del año:** Sí — Equipo Gestión Neiva (3 aprendices, Ficha 3413974; repositorio base `https://github.com/Tomasberserk/GESTION_INVENTARIO_INTELIGENTE`). El ajuste, la caracterización, la selección metodológica, el plan de análisis, el diagrama de casos de uso y la matriz de esta carpeta son **trabajo individual**.

## 2. Qué reutilicé

| Artefacto | Ruta original en mi fork | ¿Lo hice solo o en equipo? |
|---|---|---|
| Especificación de requisitos base (SRS) y reglas de negocio | `03-execute/proyecto-formativo-inventario/01-srs-gestion-neiva.md` | En equipo (consolidado individualmente del repo formativo del equipo) |
| Constitución de arquitectura y decisiones base | `03-execute/proyecto-formativo-inventario/02-constitucion-arquitectura.md` | En equipo |

## 3. Qué ajusté

| # | Artefacto | Qué cambié y por qué | Enlace al commit |
|---|---|---|---|
| 1 | `01-srs-gestion-neiva.md` → `03-matriz-requisitos-casos-uso.md` | Formalicé los requisitos dispersos del SRS del equipo en 10 RF numerados (`RF-01`..`RF-10`) separados explícitamente de 5 RNF (`RNF-01`..`RNF-05`), alcanzando 100 % de cobertura en la matriz RF→CU (mejora C3). | [`ab4dcbf`](https://github.com/SantiagoJavelaOspino/ADSO-3413974/commit/ab4dcbf) / [`ecb6987`](https://github.com/SantiagoJavelaOspino/ADSO-3413974/commit/ecb6987) |
| 2 | `04-diagrama-casos-uso.drawio` / `.svg` | Agrupé las operaciones CRUD sin flujo propio en casos de uso de objetivo de negocio (`CU-01`..`CU-04`), añadí frontera del sistema, actor Planificador Automático e incorporé relaciones `«include»` y `«extend»` con dirección UML verificada (mejora C4). | [`ecb6987`](https://github.com/SantiagoJavelaOspino/ADSO-3413974/commit/ecb6987) |
| 3 | `03-matriz-requisitos-casos-uso.md` y `04-diagrama-casos-uso.*` | Corregí la dirección de la relación `«extend»` (`CU-11` → `CU-06`) y documenté en una línea la justificación de cada relación `«include»`, `«extend»` y generalización (mejora C4 y hallazgo H-03 de G1-P2). | Commit de cierre G1-P1 (2026-11-28) |

## 4. Qué construí nuevo

- Caracterización de la solución con los 4 aspectos y comparación de 4 metodologías (Scrum, XP, RUP, RAD) con selección justificada (`01-caracterizacion-y-metodologias.md`).
- Plan de 8 actividades priorizadas de análisis con responsable, fecha y entregable (`02-plan-actividades-analisis.md`).
- Matriz RF → CU con separación explícita de RNF y tabla de justificación de relaciones (`03-matriz-requisitos-casos-uso.md`).
- Diagrama de casos de uso UML en fuente editable `.drawio` e imagen vectorial `.svg` (`04-diagrama-casos-uso.*`).

## 5. Artefactos entregados

**Producto 1**

- [x] Caracterización de la solución: [01-caracterizacion-y-metodologias.md](./01-caracterizacion-y-metodologias.md)
- [x] Comparación de metodologías y selección justificada: [01-caracterizacion-y-metodologias.md](./01-caracterizacion-y-metodologias.md)
- [x] Plan de actividades, cronograma y entregables: [02-plan-actividades-analisis.md](./02-plan-actividades-analisis.md)
- [x] Diagrama de casos de uso (fuente editable): [04-diagrama-casos-uso.drawio](./04-diagrama-casos-uso.drawio)
- [x] Diagrama de casos de uso (imagen): [04-diagrama-casos-uso.svg](./04-diagrama-casos-uso.svg)
- [x] Matriz requisito → caso de uso: [03-matriz-requisitos-casos-uso.md](./03-matriz-requisitos-casos-uso.md)

## 6. Declaración de autoría

- [x] Declaro que el ajuste y lo construido nuevo en esta carpeta es **mi trabajo individual**.
- [x] Declaro que lo que tomé de mi equipo o de otra fuente está identificado en la sección 2.
- [x] Entiendo que el sábado 28 de noviembre de 2026 el instructor me hará **3 preguntas orales** sobre mis productos (una del producto 1, una del producto 2 y una tercera a su elección) y que, si respondo bien menos de 2, el producto sobre el que fallé queda con tope de 50.

Firma (usuario de GitHub y fecha): `@SantiagoJavelaOspino` · 2026-11-27

## 7. Uso de inteligencia artificial

| Herramienta | Para qué la usé | Qué verifiqué o corregí yo |
|---|---|---|
| Antigravity (Gemini) | Apoyo en estructuración de tablas Markdown, verificación contra `Rubricas_G1.md` y generación del archivo `.drawio`/`.svg` del diagrama de casos de uso. | Validé que los 10 RF y 5 RNF correspondieran al proyecto real Gestión Neiva, verifiqué la dirección de `«include»`/`«extend»`, la agrupación CRUD sin fragmentación y la ausencia de datos personales reales. |

## 8. Autocontrol antes del push

- [x] Hice commits propios en al menos 2 días distintos entre la publicación de la guía (sábado 21 de noviembre de 2026) y la entrega (27 y 28 de noviembre antes de 6:00 a. m.).
- [x] No subí el marco documental del instructor, plantillas sin diligenciar ni archivos de otras personas.
- [x] Hice `push` y comprobé en GitHub que la carpeta está publicada.
