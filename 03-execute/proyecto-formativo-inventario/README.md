# Proyecto Formativo Base — Gestión Neiva (POS SaaS e Inventario Inteligente)

- **Repositorio original del equipo:** https://github.com/Tomasberserk/GESTION_INVENTARIO_INTELIGENTE
- **Usuario de GitHub (autor de las entregas individuales G1 y G2):** `@SantiagoJavelaOspino`
- **Trabajo en equipo del año:** Sí — Equipo Gestión Neiva (3 aprendices de la Ficha 3413974).
- **Propósito de esta carpeta:** Conservar únicamente el insumo base consolidado (documentación de partida en formato Markdown) que sirve como origen verificable dentro del fork para las entregas individuales de la **Guía 1 (Modelo conceptual)** y la **Guía 2 (Diseño de la solución)**, sin duplicar el código fuente completo del repositorio del equipo.

## Archivos de insumo incluidos

| Archivo | Origen en `GESTION_INVENTARIO_INTELIGENTE` | Contenido resumido |
|---|---|---|
| [01-srs-gestion-neiva.md](./01-srs-gestion-neiva.md) | `docs/srs/SRS_MVP_v1.md` + `docs/spec/spec.md` | Contexto, alcance, actores, 10 RF, 5 RNF y reglas de negocio (`RN-01` a `RN-06`). |
| [02-constitucion-arquitectura.md](./02-constitucion-arquitectura.md) | `docs/spec/constitution.md` | Principios arquitectónicos (multi-tenant, pureza de dominio, snapshot, baja lógica, concurrencia). |
| [03-modelo-datos-base.md](./03-modelo-datos-base.md) | `docs/spec/data-model.md` | Esquema base inicial de tablas principales (`tenants`, `productos`, `ventas`, `detalles_venta`). |
| [04-adr-decisiones-base.md](./04-adr-decisiones-base.md) | `docs/spec/adr/adr-001-*.md` y `adr-002-*.md` | Decisiones arquitectónicas previas sobre aislamiento multi-tenant y control de concurrencia en POS. |

## Alcance individual de `@SantiagoJavelaOspino`

Sobre este insumo compartido del equipo, las entregas de **G1-P1**, **G1-P2**, **G2-P1** y **G2-P2** modelan y diseñan de forma **individual** el subconjunto integral de **10 Requisitos Funcionales (`RF-01` a `RF-10`)** y **5 Requisitos No Funcionales (`RNF-01` a `RNF-05`)** correspondientes al núcleo de administración multi-tenant, inventario por lotes/categorías, punto de venta (POS), alertas automáticas y reportes financieros.
