# README de entrega · Guía 2: Diseño de la solución (Producto 1)

## 1. Datos de la entrega

| Campo | Valor |
|---|---|
| Producto | P1 (artefactos de diseño) |
| Usuario de GitHub del autor | `@SantiagoJavelaOspino` |
| Ficha | 3413974 |
| Caso elegido (nombre del proyecto) | Gestión Neiva — Sistema POS SaaS Multi-Tenant e Inventario Inteligente |
| Enlace al informe de análisis o SRS del caso (ruta en tu fork) | `03-execute/proyecto-formativo-inventario/01-srs-gestion-neiva.md` |
| Cuenta de GitHub con la que haces los commits | `@SantiagoJavelaOspino` |

## 2. Origen del insumo y trabajo en equipo

| Pregunta | Respuesta |
|---|---|
| ¿El SRS / informe de análisis lo elaboró un equipo? ¿Cuántas personas? | Sí, el proyecto formativo base fue elaborado por el Equipo Gestión Neiva (3 aprendices) en `https://github.com/Tomasberserk/GESTION_INVENTARIO_INTELIGENTE`. |
| ¿Qué parte del SRS es tuya? | Participación en especificación, soporte y consolidación del subconjunto individual de 10 RF (`RF-01`..`RF-10`) y 5 RNF (`RNF-01`..`RNF-05`) modelados en G1 y diseñados en G2. |
| ¿Los artefactos de esta entrega los hiciste tú solo? | Sí — todos los artefactos de diseño de G2-P1 (A1 a A7) fueron elaborados individualmente. |
| ¿Otro aprendiz usó o te compartió archivos de esta entrega? | No. |

## 3. Qué reutilicé, qué ajusté y qué hice nuevo

| Artefacto | Archivo en esta carpeta | Origen (ruta en mi fork o «nuevo») | Qué ajusté o agregué |
|---|---|---|---|
| A1. Ficha de interpretación y plataforma | [01-ficha-interpretacion-plataforma.md](./01-ficha-interpretacion-plataforma.md) | `03-execute/proyecto-formativo-inventario/01-srs-gestion-neiva.md` | Consolidé 10 RF y 5 RNF con IDs y justifiqué Python/FastAPI y PostgreSQL 16 con 4 condiciones concretas del caso. |
| A2. Diagrama de clases | [02-diagrama-clases-y-patrones.md](./02-diagrama-clases-y-patrones.md) · [(.drawio)](./02-diagrama-clases.drawio) / [(.svg)](./02-diagrama-clases.svg) | `G1-P2-santiago-javela/03-modelo-dominio.md` (ajustado a diseño OO) | Pasé de clases conceptuales a 13 clases de diseño con tipos, visibilidad, métodos, composición, agregación, herencia e interfaz polimórfica. |
| A3. Patrones de diseño GoF | [02-diagrama-clases-y-patrones.md](./02-diagrama-clases-y-patrones.md) | Nuevo | Apliqué 2 patrones distintos de Singleton (**Estrategia** en `IPoliticaDescuento` y **Fachada** en `PosVentaFacade`) con justificación de mantenibilidad. |
| A4. Arquitectura del software | [03-arquitectura-software.md](./03-arquitectura-software.md) · [(.drawio)](./03-arquitectura.drawio) / [(.svg)](./03-arquitectura.svg) | `03-execute/proyecto-formativo-inventario/02-constitucion-arquitectura.md` | Formalicé el Monolito Modular en 4 capas sin saltos, tabla de decisiones para 5 RNF y alternativas descartadas (Microservicios y BD-por-tenant). |
| A5. Vista de componentes | [04-vista-componentes.md](./04-vista-componentes.md) · [(.drawio)](./04-vista-componentes.drawio) / [(.svg)](./04-vista-componentes.svg) | Nuevo | Diseñé 6 componentes con interfaces provistas/requeridas nombradas, dependencias y mapeo a clases y RF/RNF. |
| A6. Vista de despliegue | [05-vista-despliegue.md](./05-vista-despliegue.md) · [(.drawio)](./05-vista-despliegue.drawio) / [(.svg)](./05-vista-despliegue.svg) | Nuevo | Modelé 4 nodos (Cliente PWA, Servidor Aplicación, Caché Redis, BD PostgreSQL) con puertos/protocolos (HTTPS 443, TCP 6379, TCP 5432) y decisiones RNF. |
| A7. Matriz de trazabilidad | [06-matriz-trazabilidad.md](./06-matriz-trazabilidad.md) | Nuevo | Trazabilidad bidireccional 100 % entre los 10 RF / 5 RNF, 13 clases, 11 tablas, 6 componentes y decisiones. |

**Qué reutilicé:** El SRS base consolidado (`01-srs-gestion-neiva.md`), los principios de la constitución arquitectónica multi-tenant/concurrencia (`02-constitucion-arquitectura.md`) y el modelo de dominio de G1-P2 como punto de partida conceptual.

**Qué ajusté para llevarlo al estándar de la rúbrica:** Incorporé tipado estricto, visibilidad y métodos con parámetros en todas las clases, añadí multiplicidades faltantes en `Categoria` recursiva (hallazgo H-01), completé puertos en la vista de despliegue (hallazgo H-02) y formalicé alternativas descartadas para los 5 RNF.

**Qué hice completamente nuevo:** La aplicación de los patrones Estrategia y Fachada, el diagrama de arquitectura en 4 capas, la vista de 6 componentes con interfaces, la vista de despliegue de 4 nodos y la matriz de trazabilidad análisis → diseño.

## 4. Autoverificación de mínimos

- [x] A1 Ficha de interpretación: ≥ 8 RF y ≥ 3 RNF con ID; plataforma justificada (10 RF, 5 RNF)
- [x] A2 Diagrama de clases: ≥ 8 clases, tipos, métodos, multiplicidades, ≥ 1 composición/agregación y ≥ 1 herencia o interfaz (con ≥ 2 implementaciones)
- [x] A3 ≥ 2 patrones GoF distintos aplicados en el diagrama (Estrategia y Fachada — ambos distintos de Singleton)
- [x] A4 Arquitectura con diagrama y tabla de ≥ 3 RNF → decisión (5 RNF)
- [x] A5 Vista de componentes: ≥ 5 componentes con interfaces (6 componentes)
- [x] A6 Vista de despliegue: ≥ 3 nodos con artefactos y protocolos (4 nodos)
- [x] A7 Matriz de trazabilidad análisis → diseño (100 % cobertura bidireccional)
- [x] Fuente editable (`.drawio`) e imagen exportada (`.svg`) de cada diagrama

## 5. Historial de commits

| Día | Qué avancé (mensaje del commit) |
|---|---|
| 2026-11-27 | [`6f2a39b`](https://github.com/SantiagoJavelaOspino/ADSO-3413974/commit/6f2a39b) `feat(g2-p1): agregar ficha A1, diagrama de clases con Estrategia y Fachada, arquitectura y componentes` |
| 2026-11-28 (antes de 6:00 a. m.) | `feat(g2-p1): agregar vista de despliegue A6, matriz de trazabilidad A7 y cerrar README` |

## 6. Uso de inteligencia artificial (declaración obligatoria)

| Herramienta | Para qué la usé | Qué verifiqué o cambié después |
|---|---|---|
| Antigravity (Gemini) | Asistencia en redacción de tablas de diseño A1–A7, verificación contra `Rubricas_G2.md` y generación de diagramas `.drawio`/`.svg`. | Comprobé cohesión de clases (sin mezcla de capas), verifiqué que ambos patrones GoF fueran distintos de Singleton y confirmé que todos los puertos, interfaces y trazabilidades coincidieran con el proyecto Gestión Neiva. |

## 7. Enlaces

- Informe de análisis / SRS del caso: `03-execute/proyecto-formativo-inventario/01-srs-gestion-neiva.md`
- Carpeta de esta entrega en GitHub: `https://github.com/SantiagoJavelaOspino/ADSO-3413974/tree/main/02-training-project/01-phase/02-planning/06-architecture/04-evidence-learning/G2-P1-santiago-javela`
- Repositorio base del equipo: `https://github.com/Tomasberserk/GESTION_INVENTARIO_INTELIGENTE`

## 8. Declaración de autoría

Declaro que los artefactos de esta carpeta son de mi autoría, que lo que reutilicé de mi trabajo del año o de otras fuentes está indicado en la sección 3, que no entregué como propio material del instructor ni de otros aprendices, y que puedo explicar cada artefacto en la verificación oral.

Usuario de GitHub: `@SantiagoJavelaOspino`  Fecha: `2026-11-27`
