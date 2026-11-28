# Informe de Análisis · Gestión Neiva (Sistema POS SaaS e Inventario Inteligente)

- **Autor:** `@SantiagoJavelaOspino`
- **Ficha:** 3413974 · Análisis y Desarrollo de Software (SENA)
- **Fecha:** Noviembre de 2026
- **Insumo base:** [`03-execute/proyecto-formativo-inventario/01-srs-gestion-neiva.md`](../../../../../../03-execute/proyecto-formativo-inventario/01-srs-gestion-neiva.md)

---

## 1. Requisitos interpretados (funcionales y no funcionales)

A partir de la especificación base del proyecto formativo **Gestión Neiva**, se interpretaron y formalizaron **10 Requisitos Funcionales (`RF-01` a `RF-10`)** y **5 Requisitos No Funcionales (`RNF-01` a `RNF-05`)** enfocados en resolver el control manual de existencias, la caducidad de productos perecederos y la falta de visibilidad financiera en tiendas de barrio.

- **Alcance funcional (`RF-01` a `RF-10`):** Administración multi-tenant de tiendas (`RF-01`), gestión de usuarios con roles y múltiples teléfonos (`RF-02`), categorías jerárquicas y proveedores (`RF-03`), catálogo con código de barras, venta a granel y baja lógica (`RF-04`), consulta ágil en terminal POS (`RF-05`), registro atómico de ventas con múltiples medios de pago y descuentos opcionales (`RF-06`), preservación de snapshot histórico de precio/nombre con total derivado (`RF-07`), reabastecimiento con control de lotes perecederos (`RF-08`), alertas automáticas de stock mínimo y vencimiento a ≤ 15 días (`RF-09`), y panel financiero con exportación de cuadre de caja (`RF-10`).
- **Restricciones de calidad (`RNF-01` a `RNF-05`):** Aislamiento estricto por `tenant_id` con contraseñas protegidas mediante hash+sal y transporte TLS 1.3 (`RNF-01`), latencia ≤ 1.5 s en POS con 50 usuarios concurrentes (`RNF-02`), cero sobreventas bajo concurrencia (`RNF-03`), disponibilidad ≥ 99.5 % con respaldo diario y restauración mensual (`RNF-04`), y usabilidad móvil PWA con arquitectura modular (`RNF-05`).
- **Marco metodológico seleccionado:** **Scrum con prácticas técnicas de XP**, justificado por el tamaño del equipo (3 aprendices), la disponibilidad intermitente de los tenderos y la necesidad de pruebas automatizadas sobre el núcleo transaccional.

---

## 2. Enlaces a los modelos de análisis construidos

| Artefacto | Ubicación | Resumen de aporte |
|---|---|---|
| Caracterización y selección metodológica | [`G1-P1/01-caracterizacion-y-metodologias.md`](../G1-P1-santiago-javela/01-caracterizacion-y-metodologias.md) | 4 aspectos caracterizados, 4 metodologías comparadas, selección justificada. |
| Plan de actividades de análisis | [`G1-P1/02-plan-actividades-analisis.md`](../G1-P1-santiago-javela/02-plan-actividades-analisis.md) | 8 actividades priorizadas con responsable, fecha y entregable. |
| Diagrama de casos de uso UML + Matriz RF→CU | [`G1-P1/04-diagrama-casos-uso.svg`](../G1-P1-santiago-javela/04-diagrama-casos-uso.svg) / [`03-matriz-requisitos-casos-uso.md`](../G1-P1-santiago-javela/03-matriz-requisitos-casos-uso.md) | 12 CU, 5 actores, 2 `«include»`, 2 `«extend»`, 100 % RF cubiertos. |
| Diagramas de actividades UML | [`01-diagramas-actividades.md`](./01-diagramas-actividades.md) | 2 flujos críticos (`CU-06` con bifurcación/unión y `CU-07` secuencial) con calles y guardas. |
| Plantillas extendidas de casos de uso | [`02-plantillas-casos-uso.md`](./02-plantillas-casos-uso.md) | 3 plantillas completas (`CU-06`, `CU-07`, `CU-08`) sin detalles de implementación. |
| Modelo de dominio conceptual | [`03-modelo-dominio.md`](./03-modelo-dominio.md) | 12 clases conceptuales sin métodos, generalización `Usuario` y clase asociación `LineaVenta`. |
| Modelo Entidad-Relación (MER) | [`04-modelo-entidad-relacion.md`](./04-modelo-entidad-relacion.md) | 10 entidades en Pata de gallo, N:M resuelta (`DETALLE_VENTA`), entidad débil (`LOTE_PRODUCTO`) y recursiva (`CATEGORIA`). |
| Prototipo inicial (mockup) | [`05-prototipo-inicial.html`](./05-prototipo-inicial.html) | 3 pantallas rotuladas (`CU-06`, `CU-07`, `CU-09`) sin pantallas huérfanas. |
| Matriz de trazabilidad completa | [`08-matriz-trazabilidad.md`](./08-matriz-trazabilidad.md) | 10 / 10 RF trazados de extremo a extremo (100 %). |

---

## 3. Resultado de la verificación de calidad

Se aplicó una lista de chequeo formal de **18 criterios verificables** ([`06-lista-chequeo-y-ajustes.md`](./06-lista-chequeo-y-ajustes.md)), incluyendo 5 criterios de cobertura y trazabilidad.

- **Primera verificación:** 12 criterios cumplieron de entrada (66.7 %) y **6 criterios presentaron hallazgos** (`H-01` a `H-06`), relacionados con trazabilidad de `RF-03`, omisión de `CompraReabastecimiento` en dominio, dirección de flecha `«extend»`, salida faltante en decisión de `CU-07`, mención de código HTTP 422 en plantilla y notación de entidad débil en el MER.
- **Segunda verificación (post-ajustes):** **18 / 18 criterios cumplidos (100 %)**, sin contradicciones entre casos de uso, plantillas, dominio, MER y prototipo.

---

## 4. Ajustes realizados y conclusión

Las seis correcciones documentadas en el Registro de Ajustes (`H-01` a `H-06`) eliminaron fugas de detalles técnicos en análisis, aseguraron la consistencia bidireccional entre el modelo de dominio y las plantillas extendidas, y garantizaron que cada requisito funcional tenga soporte estructural de datos. Con la matriz de trazabilidad al **100 %**, los modelos quedan validados y listos como línea base para la fase de diseño arquitectónico y de base de datos (Guía 2).
