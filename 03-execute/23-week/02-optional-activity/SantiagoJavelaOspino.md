# Especificación Técnica de Software Template

## 1. Metadatos del Documento
- **Título:** Especificación Técnica Integral del Sistema de Gestión de Horarios Académicos
- **Sistema:** Plataforma de Gestión de Horarios SENA
- **Autor:** Santiago Javela Ospino
- **Fecha de Creación:** 15 de Agosto de 2026

## 2. Introducción y Alcance del Sistema
El presente documento describe la especificación técnica integral de la plataforma de "Gestión de Horarios Académicos" del SENA. El sistema es una solución basada en arquitectura de micro-frontends (con shell-host y guards RBAC) que automatiza y optimiza la asignación de fichas, instructores, ambientes de aprendizaje y competencias a lo largo de diversas franjas horarias. Su alcance abarca múltiples roles, incluyendo Coordinador Académico, Instructor, Aprendiz, Director de Centro y Administrador de Soporte, permitiendo una parametrización escalable y prevención de colisiones.

## 3. Especificación de Calidad de Software

### 3.1. Adecuación Funcional (Functional Suitability)
- **Completitud Funcional:** El sistema cubre el 100% de los requerimientos de agendamiento. Permite la visualización de horarios para aprendices e instructores, gestión de indicadores para directores y parametrización de variables globales.
- **Corrección Funcional:** Los algoritmos de validación garantizan el cruce perfecto, asegurando un 0% de superposición de franjas horarias para un mismo instructor, ambiente o ficha.
- **Pertinencia Funcional:** Las interfaces, flujos y menús de navegación están adaptados estrictamente al rol del usuario mediante Guards RBAC, entregando sólo la información requerida.

### 3.2. Usabilidad (Usability)
- **Aprehendibilidad:** Curva de aprendizaje reducida gracias a interfaces intuitivas, consistencia en la navegación y un calendario interactivo estilo "drag-and-drop".
- **Operabilidad:** Tareas de alto impacto (como la programación de fichas) reducidas en su flujo de clics, con opciones rápidas de autocompletado y filtros contextuales.
- **Protección contra errores de usuario:** Validaciones asíncronas en tiempo real que previenen y bloquean asignaciones inválidas o cruzadas (ej. asignar un ambiente ocupado) antes de la confirmación final.
- **Estética UI:** Diseño limpio, minimalista, corporativo, y alineado con los estándares gráficos del SENA, basado en componentes Tailwind CSS.

### 3.3. Mantenibilidad (Maintainability)
- **Modularidad:** Construcción sobre una arquitectura Micro-frontend (MFE) por dominio con un shell-host, lo que divide el sistema en unidades independientes.
- **Reusabilidad:** Catálogo central de componentes UI (Tablas de Datos, Modales, Calendarios y Filtros de Búsqueda) reutilizables a lo largo de las 53 pantallas proyectadas en el mockup.
- **Analizabilidad:** Trazabilidad del estado de la aplicación y un sistema estructurado de logs y de manejo de errores globales en el shell-host.
- **Modificabilidad:** Acoplamiento débil entre la UI (React/Tailwind) y la lógica de negocio subyacente, facilitando la futura adición de nuevas reglas o interfaces.

### 3.4. Seguridad (Security)
- **Confidencialidad:** Aislamiento de las vistas de información sensible. Solo usuarios autorizados y en roles específicos pueden visualizar datos protegidos (Router por Hash y RBAC).
- **Integridad:** Restricciones de base de datos a nivel backend y frontend que previenen la alteración indebida o eliminación accidental de los horarios.
- **No repudio:** Trazabilidad (Auditoría) integral de cambios. El sistema registra qué usuario, desde qué IP y en qué fecha genera una modificación al cronograma académico.
- **Autenticidad:** Control de acceso mediante inicio de sesión centralizado con autenticación basada en JWT o tokens robustos.

### 3.5. Eficiencia de Desempeño (Performance Efficiency)
- **Comportamiento Temporal:** Respuestas ágiles del UI; tiempos de carga del calendario, paneles e indicadores inferiores a 300ms gracias a la virtualización y estrategias de paginación.
- **Utilización de Recursos:** Optimización exhaustiva del payload de datos. El uso intensivo de cachés locales reduce las peticiones de red recurrentes.

### 3.6. Compatibilidad y Portabilidad (Compatibility & Portability)
- **Compatibilidad:** Capacidad de coexistir con otras plataformas del SENA (como SofiaPlus) mediante el consumo de APIs estandarizadas (RESTful).
- **Portabilidad:** Estructura de componentes Responsive Design (Mobile-First) soportando resoluciones de escritorio (1440×1000) y de móviles (390×844).

---

## 4. Arquitectura del Sistema y Frontend

El sistema está cimentado bajo una estructura Micro-Frontend que permite alta escalabilidad y despliegue independiente. El stack sugerido en la especificación visual (Mockup) es:
- **Core / Shell-Host:** Contenedor maestro encargado de levantar el menú base, el contexto de estado global, la sesión y el router por Hash de los 53 modales/pantallas.
- **Frontend Framework:** ReactJS (u homólogo moderno).
- **Estilos:** Tailwind CSS, utilizando flexbox y CSS Grid para layouts complejos.

### Interfaz de Usuario y Componentes del Mockup
| Componente | Especificación y Uso (Referencia Mockup) |
| :--- | :--- |
| **Login Central** | Inicio de sesión que enruta a la interfaz correspondiente basándose en el rol del usuario elegido (Coordinador, Instructor, etc.). |
| **Calendarios Interactivos** | Componente visual principal (`Instructor/mi-horario`, `mi-horario`). Permite la visualización en vista semana/mes. |
| **Hub de Parametrización** | Panel exclusivo para la Dirección del Centro. Permite crear/editar y dar de baja reglas, catálogos e información fundacional. |
| **Dashboard de Indicadores** | Panel de datos para Directores de Centro, incluyendo gráficos estadísticos de ocupación de ambientes, instructores con sobrecarga u horas ociosas. |
| **Tablas de Datos (Grids)** | Paneles usados en la asignación masiva, mostrando la lista de fichas, instructores y ambientes, con checkboxes y acciones (Backoffice de Soporte). |
| **Panel de Filtros** | Buscadores multicriterio superiores para localizar ambientes disponibles en tiempos específicos. |

---

## 5. Especificación de Datos y Entidades

Para soportar las interfaces del frontend y aplicar las características del ISO 25010 (especialmente Integridad y Confiabilidad), el modelo relacional maneja las siguientes entidades core:

- **1. Usuario (Usuarios):**
  - Campos: `id`, `nombre_completo`, `documento_identidad`, `correo`, `rol_sistema` (Enum).
- **2. Ficha (Grupos Formativos):**
  - Campos: `codigo_ficha`, `programa_formacion`, `jornada`, `fecha_inicio`, `fecha_fin`, `modalidad`.
- **3. Instructor:**
  - Campos: `id`, `usuario_id` (FK), `tipo_contrato` (Planta, Contratista), `horas_maximas_semana`, `area_especialidad`.
- **4. Ambiente de Aprendizaje:**
  - Campos: `id`, `nombre_ambiente`, `capacidad_personas`, `tipo_ambiente` (Regular, Laboratorio, Taller de Sistemas, Especializado), `sede_id`.
- **5. Competencia/Resultado de Aprendizaje:**
  - Campos: `id`, `descripcion`, `codigo_competencia`, `programa_formacion_id`.
- **6. Franja Horaria:**
  - Campos: `id`, `dia_semana`, `hora_inicio`, `hora_fin`.
- **7. Horario_Transaccional (Schedule):**
  - Campos: `id`, `ficha_id`, `instructor_id`, `ambiente_id`, `competencia_id`, `franja_id`, `fecha_especifica`, `estado_asignacion`.

### Reglas de Negocio (Persistencia y Prevención de Conflictos)
Estas restricciones se evalúan para cumplir con la característica de **Protección contra errores de usuario** y **Corrección Funcional**:
1. **Regla de Instructor Único:** `UNIQUE(instructor_id, franja_id, fecha_especifica)` - Un instructor NO puede impartir clases a dos fichas en distintos lugares simultáneamente.
2. **Regla de Ambiente Disponible:** `UNIQUE(ambiente_id, franja_id, fecha_especifica)` - El ambiente físico debe ser de uso exclusivo por cada franja y fecha solicitada.
3. **Regla de Ocupación de Ficha:** `UNIQUE(ficha_id, franja_id, fecha_especifica)` - El grupo de estudiantes de la ficha no puede tener dos instructores programados al mismo tiempo en diferentes competencias.
4. **Regla de Capacidad:** El total de aprendices matriculados en `Ficha` debe ser menor o igual a `capacidad_personas` de la entidad `Ambiente de Aprendizaje`.

---

## 6. Matriz de Casos de Uso y Flujos de Trabajo

A continuación, la correlación de flujos integrales basados en el mockup:

| Identificador | Descripción del Caso de Uso | Rol Implicado | Flujo del Sistema (Frontend) | Criterio ISO 25010 Satisfecho |
| :---: | :--- | :--- | :--- | :--- |
| **CU-01** | **Ingreso con RBAC** | Todos | El usuario digita su correo en la vista login. El router por hash verifica las reglas de guards RBAC y lo transporta al dashboard nativo de su rol. | **Seguridad** (Confidencialidad y Autenticidad). |
| **CU-02** | **Asignación Integral de Horario** | Coordinador Académico | Desde el panel de programación, el coordinador filtra ficha. El sistema arroja instructores y ambientes con disponibilidad (Cruce en vivo). Asigna. | **Adecuación Funcional** (Corrección) y **Usabilidad** (Protección contra colisiones). |
| **CU-03** | **Visualización de Carga Horaria** | Aprendiz / Instructor | Al ingresar a la ruta `#/instructor/mi-horario`, visualiza la grilla (calendario). Responde a drag-scroll en móvil y desktop. | **Portabilidad** (Adaptación móvil) y **Usabilidad** (Estética). |
| **CU-04** | **Gestión y Configuración** | Director de Centro | Entra por `#/admin/parametrizacion`. Registra o inhabilita ambientes y programas. Actualiza topes de horas para la sede. | **Mantenibilidad** (Modificabilidad) y **Adecuación Funcional**. |
| **CU-05** | **Supervisión de Rendimiento** | Director de Centro | Entra por `#/admin/indicadores`. Accede a gráficos dinámicos con los resúmenes estadísticos (horas impartidas, ambientes vacíos). | **Eficiencia de Desempeño** (Uso óptimo de datos agregados). |
| **CU-06** | **Soporte de Documentos** | Administrador | Navega por `#/backoffice/documentos`. Revisa peticiones y cruces con problemas reportados. Aplica filtros a la tabla de reportes. | **Usabilidad** (Operabilidad y filtros eficientes). |

---

## 7. Ingeniería Inversa y Mejoras UX/UI (Design Thinking + MoSCoW)

El análisis detallado de ingeniería inversa sobre las **53 pantallas y 7 roles** del mockup de Gestión de Horarios SENA (`design-software-mockup`) y sobre el **Sistema de Asistencia de Ambiente** se encuentra desarrollado en [`Ingenieria_Inversa.md`](./Ingenieria_Inversa.md).

### Resumen de Hallazgos Clave:
1. **Prevención de Colisiones en UI (`Must Have`):** Deshabilitación preventiva en tiempo real de ambientes e instructores ya ocupados en la franja seleccionada, respaldada por restricciones `UNIQUE` en base de datos.
2. **Persistencia Intermedia (`Should Have`):** Guardado automático (`auto-save`) en formularios extensos de programación para evitar pérdida de trabajo ante desconexiones.
3. **Adaptabilidad Móvil (`Must Have`):** Vista móvil por pestañas diarias (Lunes a Sábado) en resoluciones `390×844` para eliminar el scroll horizontal en la consulta de horarios de aprendices e instructores.
4. **Integridad de Datos en Asistencia (`Must Have`):** Validación estricta de `tipo_documento` (`CC`, `TI`, `CE`, `PEP`, `PPT`), unicidad de asistencia por sesión para evitar duplicados/homónimos, baja lógica con principio de 4 ojos para fichas y cumplimiento de la **Ley 1581 de 2012** (Habeas Data).

---

## 8. Plan de Contingencia Operativo y de Accesibilidad

El protocolo completo de continuidad operativa se encuentra documentado en [`Plan_de_Contingencia.md`](./Plan_de_Contingencia.md) y cubre:

- **Accesibilidad e Inclusión (CA-01 a CA-04):** Protocolos para aprendices sin teléfono celular, o con discapacidad visual, auditiva o motriz (registro manual asistido por el instructor, check-in de 1 clic, soporte para lectores de pantalla y alertas visuales de alto contraste).
- **Fallas Técnicas y de Conectividad (CT-01 a CT-06):** Cola offline idempotente (`offline-queue.js`) ante caída de Internet en el ambiente, código manual de respaldo ante fallo del proyector/QR, ventana de gracia ante expiración de token y bloqueo idempotente de registros duplicados.
- **Contingencias en Gestión de Horarios (CH-01 a CH-05):** Flujos BPMN de excepción ante incapacidad repentina de instructor (`PROC_I2` / `PROC_C3`), inhabilitación o mantenimiento de ambientes (`PROC_C2`), protección contra borrado accidental de fichas/horarios publicados (`PROC_S2`) y aislamiento de fallos en el Shell-Host.

---

## 9. Estrategia de Pensamiento y Gestión del Conocimiento

El marco metodológico completo se encuentra en [`Estrategia_Pensamiento_y_Gestion_del_Conocimiento.md`](./Estrategia_Pensamiento_y_Gestion_del_Conocimiento.md) e integra:

1. **Cuatro Estrategias de Pensamiento:**
   - **Pensamiento Analítico y Crítico:** Deconstrucción mediante ingeniería inversa.
   - **Pensamiento de Diseño (Design Thinking):** Empatía por rol (Aprendiz, Instructor, Coordinador, Director, Soporte).
   - **Pensamiento Sistémico:** Modelado de procesos BPMN 2.0 (`SENA_BPMN_Horarios.zip`), modelo lógico/relacional y calidad ISO/IEC 25010.
   - **Pensamiento Estratégico y Convergente:** Priorización MoSCoW y diseño de planes de contingencia.
2. **Espiral del Conocimiento SECI (Nonaka & Takeuchi):**
   - **Socialización** (Tácito → Tácito en sesiones de equipo y revisión de MVPs),
   - **Exteriorización** (Tácito → Explícito en diagramas BPMN e historias de usuario),
   - **Combinación** (Explícito → Explícito en arquitectura SDD, ADRs y especificación ISO 25010),
   - **Interiorización** (Explícito → Tácito en implementación de código, pruebas QA/E2E y operación real).

