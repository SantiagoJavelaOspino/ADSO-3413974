# B7 · Lista de Chequeo de Verificación (P1 y P2) y Registro de Hallazgos

- **Caso de estudio:** Gestión Neiva — Sistema POS SaaS Multi-Tenant e Inventario Inteligente.
- **Autor:** `@SantiagoJavelaOspino`
- **Cobertura:** **24 criterios medibles** (≥ 20 exigidos), agrupados en los 8 bloques de artefactos de **G2-P1 y G2-P2**, con severidad (`Crítico`, `Mayor`, `Menor`), evidencia concreta y **4 hallazgos corregidos** (≥ 3 exigidos).

---

## 1. Lista de chequeo diligenciada sobre P1 y P2 (24 criterios)

| ID | Artefacto | Criterio de aceptación medible | Severidad | 1.ª verif. | Evidencia concreta |
|---|---|---|---|---|---|
| **LC-01** | Ficha A1 | La ficha identifica ≥ 8 RF y ≥ 3 RNF con su ID del SRS y justifica lenguaje y BD con ≥ 3 condiciones del caso. | Mayor | Sí | `G2-P1/01-ficha-interpretacion-plataforma.md` (10 RF, 5 RNF, 4 condiciones por tecnología). |
| **LC-02** | Clases A2 | El diagrama incluye ≥ 8 clases con atributos tipados, visibilidad (`-`/`+`) y métodos con parámetros. | Crítico | Sí | `G2-P1/02-diagrama-clases.svg` y `.drawio` (13 clases completas). |
| **LC-03** | Clases A2 | Todas las asociaciones presentan multiplicidad explícita en ambos extremos. | Menor | **No** → Sí | `G2-P1/02-diagrama-clases.svg` — **Hallazgo H-01** corregido. |
| **LC-04** | Clases A2 | Incluye ≥ 1 composición o agregación y ≥ 1 herencia o interfaz (con ≥ 2 implementaciones si es interfaz). | Crítico | Sí | Composición `Venta ◆── DetalleVenta`, agregación `Tienda ◇── Producto`, herencia `Usuario`, interfaz `IPoliticaDescuento` con 2 implementaciones. |
| **LC-05** | Clases A2 | Ninguna clase mezcla responsabilidades de áreas distintas (UI, dominio, persistencia, notificaciones, reportes). | Mayor | Sí | Revisión de métodos de las 13 clases en `02-diagrama-clases.svg`. |
| **LC-06** | Clases A2 | El 100 % de las clases traza a ≥ 1 requisito en la matriz A7 (sin clases huérfanas). | Mayor | Sí | `G2-P1/06-matriz-trazabilidad.md` (13/13 clases trazadas). |
| **LC-07** | Patrones A3 | Se aplican ≥ 2 patrones GoF distintos (al menos uno distinto de Singleton) visibles en el diagrama de clases. | Crítico | Sí | Estrategia (`IPoliticaDescuento`) + Fachada (`PosVentaFacade`) en `02-diagrama-clases.svg`. |
| **LC-08** | Patrones A3 | Cada patrón documenta problema concreto del caso, por qué ese patrón, clases y mejora de mantenibilidad. | Mayor | Sí | Tabla de `G2-P1/02-diagrama-clases-y-patrones.md` sección 2. |
| **LC-09** | Arquitectura A4 | Existe diagrama del estilo arquitectónico sin saltos de capa (Presentación no accede directo a BD). | Crítico | Sí | `G2-P1/03-arquitectura.svg` (4 capas estrictas). |
| **LC-10** | Arquitectura A4 | La tabla cubre ≥ 3 RNF con decisión concreta y al menos una alternativa descartada con su razón. | Mayor | Sí | `G2-P1/03-arquitectura-software.md` (5 RNF + Microservicios y BD-por-tenant descartadas). |
| **LC-11** | Componentes A5 | Existen ≥ 5 componentes con interfaces provistas y requeridas nombradas y dependencias bien orientadas. | Crítico | Sí | `G2-P1/04-vista-componentes.svg` y tabla (6 componentes con interfaces). |
| **LC-12** | Componentes A5 | Cada componente mapea explícitamente las clases que agrupa y los requisitos que atiende. | Mayor | Sí | Tabla de `G2-P1/04-vista-componentes.md`. |
| **LC-13** | Despliegue A6 | Existen ≥ 3 nodos con artefactos alojados, protocolo/puerto en cada conexión y ≥ 1 decisión por RNF. | Crítico | **No** → Sí | `G2-P1/05-vista-despliegue.svg` (4 nodos) — **Hallazgo H-02** corregido. |
| **LC-14** | Trazabilidad A7 | La matriz cubre el 100 % de los RF y RNF hacia clases, tablas, componentes y decisiones. | Mayor | Sí | `G2-P1/06-matriz-trazabilidad.md` (10/10 RF, 5/5 RNF). |
| **LC-15** | Modelo B1 | El modelo conceptual tiene ≥ 6 entidades con identificadores, cardinalidad mín/máx, verbo, ≥ 1 N:M y ≥ 1 1:N. | Crítico | Sí | `G2-P2/01-modelo-conceptual.svg` (10 entidades, N:M y 1:N). |
| **LC-16** | Modelo B2 | El modelo lógico tiene ≥ 8 tablas con PK/FK y cuadro de reglas de transformación (incluye N:M, multivaluado y recursiva). | Crítico | Sí | `G2-P2/02-modelo-logico.svg` y `01-modelo-conceptual-y-logico.md` (11 tablas). |
| **LC-17** | Normalización B3 | Evidencia paso a paso 0FN→3FN de ≥ 2 tablas propias (una con llave compuesta y otra con dependencia transitiva) y DF escritas. | Crítico | Sí | `G2-P2/03-normalizacion.md` (`venta_detalle_cruda` y `producto_catalogo_crudo`). |
| **LC-18** | Diccionario B4 | El diccionario documenta el 100 % de tablas y columnas con estándar de nombrado, tipo, tamaño, restricciones y dominio. | Mayor | **No** → Sí | `G2-P2/04-diccionario-datos.md` (11 tablas, 70 columnas) — **Hallazgo H-03** corregido. |
| **LC-19** | Script SQL B5 | El script ejecuta sin errores en un motor real (evidencia adjunta) y crea el 100 % de las tablas. | Crítico | Sí | `G2-P2/05-script-creacion.sql` + `05-evidencia-ejecucion-sql.txt` (11/11 tablas en SQLite 3). |
| **LC-20** | Script SQL B5 | Incluye PK, FK con `ON DELETE` en ≥ 3 FK, `NOT NULL`, `UNIQUE` y ≥ 3 `CHECK`, con nombres/tipos idénticos al diccionario. | Crítico | Sí | 15 FK con `ON DELETE`/`ON UPDATE`, 13 `CHECK`, 100 % coincidencia con B4. |
| **LC-21** | Seguridad B6 | Define ≥ 6 políticas (≥ 2 por principio: integridad, confidencialidad, disponibilidad) vinculadas a tablas del caso. | Crítico | Sí | `G2-P2/06-politicas-seguridad.md` (9 políticas, 3 por principio). |
| **LC-22** | Seguridad B6 | Contraseñas declaradas con **hash y sal** (no cifradas), tráfico TLS, datos personales (Ley 1581) y respaldo con prueba de restauración. | Crítico | **No** → Sí | `G2-P2/06-politicas-seguridad.md` (P-04, P-05, P-06, P-07, P-08) — **Hallazgo H-04** corregido. |
| **LC-23** | Seguridad B6 | Matriz de ≥ 3 roles contra las tablas del esquema con permisos SQL concretos y filtro por tienda. | Mayor | Sí | `G2-P2/06-politicas-seguridad.md` sección 2 (4 roles × 11 tablas). |
| **LC-24** | Documentación | Todos los diagramas de P1 y P2 tienen fuente editable (`.drawio`) e imagen exportada (`.svg`) legible, y `README.md` completo. | Menor | Sí | Archivos `.drawio` + `.svg` y `README.md` en `G2-P1` y `G2-P2`. |

---

## 2. Registro de hallazgos y ajustes realizados (4 hallazgos ≥ 3 exigidos)

| ID | Artefacto | Descripción del hallazgo | Requisito / criterio afectado | Severidad | Corrección aplicada y verificada |
|---|---|---|---|---|---|
| **H-01** | Diagrama de clases (`G2-P1/02-diagrama-clases`) | La asociación entre `Categoria` y su categoría padre (recursiva) no tenía multiplicidad escrita en el extremo padre en el primer borrador. | `RF-03` / `LC-03` | Menor | Se añadió la multiplicidad explícita `0..1` (padre) y `0..*` (subcategorías) en `.drawio` y `.svg`. Verificado: **Cumple**. |
| **H-02** | Vista de despliegue (`G2-P1/05-vista-despliegue`) | La conexión entre `NodoServidorAplicacion` y `NodoCacheRedis` indicaba «red interna» pero omitía el puerto específico. | `RNF-02` / `LC-13` | Crítico | Se especificó `TCP 6379 (red privada)` en el diagrama y en la tabla de nodos, además de `TCP 5432` para PostgreSQL y `HTTPS 443 (TLS 1.3)` para el cliente PWA. Verificado: **Cumple**. |
| **H-03** | Diccionario de datos (`G2-P2/04-diccionario-datos`) | La columna `porcentaje_descuento` de la tabla `venta` figuraba como `DECIMAL(5,2)` en el diccionario mientras el script SQL usaba `NUMERIC(5,2)`. | `RF-06` / `LC-18`, `LC-20` | Mayor | Se unificó el tipo a `NUMERIC(5,2)` en el diccionario y en `05-script-creacion.sql` para mantener coincidencia exacta al 100 %. Verificado: **Cumple**. |
| **H-04** | Políticas de seguridad (`G2-P2/06-politicas-seguridad`) | El borrador inicial de respaldo (P-07) mencionaba respaldo diario pero no incluía frecuencia ni evidencia de prueba de restauración. | `RNF-04` / `LC-22` | Crítico | Se agregó la política **P-08** estableciendo prueba mensual de restauración en entorno aislado con acta y objetivos RTO ≤ 30 min / RPO ≤ 24 h. Verificado: **Cumple**. |

**Resultado tras correcciones:** **24 / 24 criterios cumplidos (100 %)**.
