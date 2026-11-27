# Caracterización de la Solución y Selección de Metodología · Gestión Neiva (POS SaaS)

- **Caso de estudio:** Gestión Neiva — Sistema POS SaaS Multi-Tenant e Inventario Inteligente para Micro-Negocios de Barrio.
- **Autor:** `@SantiagoJavelaOspino`
- **Insumo base:** [`03-execute/proyecto-formativo-inventario/01-srs-gestion-neiva.md`](../../../../../../03-execute/proyecto-formativo-inventario/01-srs-gestion-neiva.md)

---

## 1. Caracterización de la solución (4 aspectos)

| Aspecto | Caracterización del proyecto Gestión Neiva | Implicación para el análisis y desarrollo |
|---|---|---|
| **1. Tipo de proyecto** | Aplicación web responsiva (PWA) SaaS multi-tenant de punto de venta (POS) e inventario en tiempo real para tiendas de barrio con conectividad móvil variable. | Requiere entregas incrementales funcionales (MVP temprano: catálogo + ventas + alertas) y validación continua de usabilidad en dispositivos móviles. |
| **2. Tamaño del equipo** | Equipo pequeño de **3 aprendices** (perfiles multifuncionales: análisis, backend, frontend y QA) con supervisión técnica de un instructor. | No soporta burocracia documental pesada ni roles altamente especializados por fase; necesita ceremonias ligeras y comunicación directa. |
| **3. Estabilidad de requisitos** | **Media-baja (evolutiva):** el núcleo POS (ventas, stock, alertas) es claro, pero las reglas de negocio en tienda (granel, descuentos, alertas de vencimiento, reportes de cuadre) se refinan tras probar con tenderos reales. | Exige un marco iterativo que acepte cambios en la pila de producto (backlog) entre iteraciones sin rehacer documentación rígida de principio a fin. |
| **4. Disponibilidad del cliente** | **Media (intermitente):** los tenderos (Product Owners de negocio) atienden su negocio a diario y no pueden sentarse 8 horas diarias con el equipo, pero sí participan en revisiones cortas cada 1 o 2 semanas. | Favorece demostraciones breves al final de cada sprint (1–2 semanas) en lugar de exigir cliente presencial de tiempo completo en el sitio de desarrollo. |

---

## 2. Comparación de metodologías de desarrollo (4 metodologías)

Los criterios de evaluación se derivan directamente de las 4 características anteriores del proyecto:

| Criterio (derivado de la caracterización) | **Scrum** | **XP (Extreme Programming)** | **RUP (Rational Unified Process)** | **RAD (Rapid Application Development)** |
|---|---|---|---|---|
| **Adecuación a equipo pequeño (3 personas)** | **Alta.** Roles ligeros (PO, SM, Dev Team) adaptables a 3 personas multifuncionales sin sobrecarga administrativa. | **Alta.** Pensado para equipos pequeños (2–10) con propiedad colectiva del código. | **Baja.** Diseñado para equipos medianos/grandes con múltiples roles formales y numerosos artefactos por fase. | **Media-alta.** Usa equipos pequeños enfocados en prototipado rápido, pero puede descuidar arquitectura multi-tenant. |
| **Manejo de requisitos evolutivos (estabilidad media-baja)** | **Alta.** Product Backlog priorizado y refinado en cada Sprint; absorbe cambios sin romper iteraciones cerradas. | **Muy alta.** Ciclos muy cortos, historias de usuario y refactorización continua con TDD. | **Media.** Es iterativo, pero los cambios tardíos en casos de uso y arquitectura formal tienen mayor costo documental. | **Alta.** Permite ajustar prototipos rápidamente, pero con riesgo de deuda técnica en reglas críticas (concurrencia POS). |
| **Compatibilidad con disponibilidad media/intermitente del cliente** | **Alta.** El cliente valida incrementos en la *Sprint Review* cada 1–2 semanas sin requerir presencia permanente diaria. | **Baja (puro).** Exige la práctica de *On-site Customer* (cliente disponible a tiempo completo junto al equipo), inviable con tenderos. | **Media.** Interacción concentrada en hitos de fase (Inicio, Elaboración, Construcción), menos frecuente que Scrum. | **Baja.** Requiere participación intensiva del usuario final durante talleres continuos de diseño y prototipado. |
| **Calidad técnica y trazabilidad en núcleo crítico (POS + Multi-Tenant)** | **Media-alta.** Garantiza entrega de valor y trazabilidad por sprint, pero no prescribe prácticas técnicas de código por sí solo. | **Muy alta.** Aporta pruebas unitarias automatizadas (TDD), integración continua y estándares de diseño limpio. | **Alta.** Enfatiza arquitectura robusta y modelado UML formal desde la fase de Elaboración. | **Baja.** Prioriza velocidad de interfaz sobre pruebas rigurosas de concurrencia y aislamiento de datos. |

---

## 3. Metodología seleccionada y justificación

### Selección: **Scrum (marco principal) complementado con prácticas técnicas de XP** *(enfoque híbrido declarado)*

**Justificación basada en las características del proyecto:**
1. **Ajuste al equipo de 3 aprendices y al tipo de proyecto SaaS POS:** Scrum permite dividir el producto en incrementos funcionales verificables cada 2 semanas (Sprint 1: multi-tenant y catálogo; Sprint 2: POS y descuento atómico; Sprint 3: lotes, alertas y panel financiero), evitando la sobrecarga documental de RUP.
2. **Respuesta a la disponibilidad intermitente de los tenderos:** A diferencia de XP puro o RAD —que exigen presencia constante del cliente—, Scrum concentra la validación con el tendero en la *Sprint Review* quincenal con un incremento ejecutable o prototipo navegable.
3. **Control de requisitos evolutivos:** El *Product Backlog* priorizado absorbe ajustes de reglas del negocio minorista (por ejemplo, venta a granel o umbrales de vencimiento) al inicio de cada sprint sin paralizar el análisis.
4. **Por qué se incorporan prácticas específicas de XP (híbrido justificado):** Como Scrum no define prácticas de ingeniería de software y el proyecto tiene requisitos críticos de integridad (`RNF-01` aislamiento multi-tenant y `RNF-03` cero sobreventas), se adoptan de XP **pruebas automatizadas continuas, refactorización guiada y diseño simple** para blindar la lógica de negocio sin adoptar *On-site Customer* ni programación en pareja estricta al 100 %.
