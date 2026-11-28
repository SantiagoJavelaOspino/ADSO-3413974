# README de entrega · Guía 2: Diseño de la solución (Producto 2)

## 1. Datos de la entrega

| Campo | Valor |
|---|---|
| Producto | P2 (modelo de datos y verificación) |
| Usuario de GitHub del autor | `@SantiagoJavelaOspino` |
| Ficha | 3413974 |
| Caso elegido (nombre del proyecto) | Gestión Neiva — Sistema POS SaaS Multi-Tenant e Inventario Inteligente |
| Enlace al informe de análisis o SRS del caso (ruta en tu fork) | `03-execute/proyecto-formativo-inventario/01-srs-gestion-neiva.md` |
| Cuenta de GitHub con la que haces los commits | `@SantiagoJavelaOspino` |

## 2. Origen del insumo y trabajo en equipo

| Pregunta | Respuesta |
|---|---|
| ¿El SRS / informe de análisis lo elaboró un equipo? ¿Cuántas personas? | Sí, el proyecto formativo base fue elaborado por el Equipo Gestión Neiva (3 aprendices) en `https://github.com/Tomasberserk/GESTION_INVENTARIO_INTELIGENTE`. |
| ¿Qué parte del SRS es tuya? | Consolidación del subconjunto individual de 10 RF (`RF-01`..`RF-10`) y 5 RNF (`RNF-01`..`RNF-05`) utilizado de forma consistente en G1 y G2. |
| ¿Los artefactos de esta entrega los hiciste tú solo? | Sí — los modelos B1–B2, la normalización B3, el diccionario B4, el script SQL ejecutado B5, las políticas B6 y la lista de chequeo B7 son trabajo individual. |
| ¿Otro aprendiz usó o te compartió archivos de esta entrega? | No. |

## 3. Qué reutilicé, qué ajusté y qué hice nuevo

| Artefacto | Archivo en esta carpeta | Origen (ruta en mi fork o «nuevo») | Qué ajusté o agregué |
|---|---|---|---|
| B1. Modelo conceptual | [01-modelo-conceptual-y-logico.md](./01-modelo-conceptual-y-logico.md) · [(.drawio)](./01-modelo-conceptual.drawio) / [(.svg)](./01-modelo-conceptual.svg) | `G1-P2-santiago-javela/04-modelo-entidad-relacion.md` (desde `03-execute/.../03-modelo-datos-base.md`) | Ajusté las 10 entidades al motor relacional PostgreSQL 16 con cardinalidades mín/máx, verbos y trazabilidad a RF. |
| B2. Modelo lógico relacional | [01-modelo-conceptual-y-logico.md](./01-modelo-conceptual-y-logico.md) · [(.drawio)](./02-modelo-logico.drawio) / [(.svg)](./02-modelo-logico.svg) | Nuevo (transformado desde B1) | 11 tablas en 3FN con PK/FK y cuadro de reglas de transformación (N:M, 1:N, multivaluado, recursiva, débil, generalización). |
| B3. Evidencia de normalización | [03-normalizacion.md](./03-normalizacion.md) | Nuevo | Normalización paso a paso 0FN→3FN con DF escritas de 2 tablas propias (llave compuesta y dependencia transitiva). |
| B4. Diccionario de datos | [04-diccionario-datos.md](./04-diccionario-datos.md) | Nuevo | 100 % de las 11 tablas y 70 columnas con estándar `snake_case`, tipos, tamaños, restricciones y dominios. |
| B5. Script SQL y evidencia | [05-script-creacion.sql](./05-script-creacion.sql) · [05-evidencia-ejecucion-sql.txt](./05-evidencia-ejecucion-sql.txt) | Nuevo | DDL completo de 11 tablas, 18 FKs con `ON DELETE`/`ON UPDATE`, 13 `CHECK`, 4 índices y log real de ejecución sin errores en SQLite 3.53.4. |
| B6. Políticas de seguridad y roles | [06-politicas-seguridad.md](./06-politicas-seguridad.md) | Nuevo | 9 políticas (3 Integridad, 3 Confidencialidad con Argon2id hash+sal y TLS 1.3 + Ley 1581, 3 Disponibilidad con respaldo diario y prueba mensual) + matriz 4 roles × 11 tablas. |
| B7. Lista de chequeo y hallazgos | [07-lista-chequeo-y-hallazgos.md](./07-lista-chequeo-y-hallazgos.md) | Nuevo | 24 criterios medibles con severidad aplicados sobre P1 y P2 con evidencia y 4 hallazgos corregidos (`H-01`..`H-04`). |

**Qué reutilicé:** El esquema inicial de 4 tablas MVP (`03-modelo-datos-base.md`) y el MER conceptual trabajado en G1-P2 como base de entidades y cardinalidades.

**Qué ajusté para llevarlo al estándar de la rúbrica:** Expandí el modelo a 11 tablas normalizadas en 3FN, unifiqué el tipo `NUMERIC(5,2)` entre diccionario y script SQL (hallazgo H-03) y completé la política de prueba mensual de restauración con RTO/RPO (hallazgo H-04).

**Qué hice completamente nuevo:** El modelo lógico relacional, la normalización paso a paso 0FN→3FN, el diccionario de 70 columnas, el script SQL validado en motor real, las 9 políticas con matriz de roles y la lista de chequeo de 24 criterios.

## 4. Autoverificación de mínimos

- [x] B1 Modelo conceptual: ≥ 6 entidades, cardinalidades, ≥ 1 N:M y ≥ 1 1:N (10 entidades)
- [x] B2 Modelo lógico: ≥ 8 tablas con PK/FK y cuadro de reglas de transformación (11 tablas)
- [x] B3 Normalización: ≥ 2 tablas de 0FN a 3FN con dependencias funcionales (una con llave compuesta y una con dependencia transitiva)
- [x] B4 Diccionario de datos completo (11 tablas, 70 columnas, 100 % idéntico al SQL)
- [x] B5 Script SQL ejecutado sin errores (evidencia adjunta) y `ON DELETE` en ≥ 3 FK (18 FKs)
- [x] B6 ≥ 6 políticas de seguridad (9 políticas, con hash y sal en contraseñas y TLS) y matriz de ≥ 3 roles (4 roles)
- [x] B7 Lista de chequeo de ≥ 20 criterios (24 criterios), diligenciada sobre P1 y P2, con evidencia y 4 hallazgos corregidos

## 5. Historial de commits

| Día | Qué avancé (mensaje del commit) |
|---|---|
| 2026-11-27 | [`feb1a9d`](https://github.com/SantiagoJavelaOspino/ADSO-3413974/commit/feb1a9d) `feat(g2-p2): agregar modelos conceptual y logico, normalizacion 3FN, diccionario y script SQL validado` |
| 2026-11-28 (antes de 6:00 a. m.) | `feat(g2-p2): agregar politicas de seguridad B6, lista de chequeo B7 y cerrar README` |

## 6. Uso de inteligencia artificial (declaración obligatoria)

| Herramienta | Para qué la usé | Qué verifiqué o corregí yo |
|---|---|---|
| Antigravity (Gemini) | Apoyo en estructuración de normalización, diccionario de datos, script SQL, políticas de seguridad y diagramas `.drawio`/`.svg`. | Ejecuté el script SQL en un motor SQLite real con `PRAGMA foreign_keys = ON`, probé rechazo de stock negativo (`CHECK`) y `ON DELETE RESTRICT`, y verifiqué coincidencia exacta de las 11 tablas y 70 columnas con el diccionario. |

## 7. Enlaces

- Informe de análisis / SRS del caso: `03-execute/proyecto-formativo-inventario/01-srs-gestion-neiva.md`
- Carpeta de esta entrega en GitHub: `https://github.com/SantiagoJavelaOspino/ADSO-3413974/tree/main/02-training-project/01-phase/02-planning/06-architecture/04-evidence-learning/G2-P2-santiago-javela`
- Repositorio base del equipo: `https://github.com/Tomasberserk/GESTION_INVENTARIO_INTELIGENTE`

## 8. Declaración de autoría

Declaro que los artefactos de esta carpeta son de mi autoría, que lo que reutilicé de mi trabajo del año o de otras fuentes está indicado en la sección 3, que no entregué como propio material del instructor ni de otros aprendices, y que puedo explicar cada artefacto en la verificación oral.

Usuario de GitHub: `@SantiagoJavelaOspino`  Fecha: `2026-11-27`
