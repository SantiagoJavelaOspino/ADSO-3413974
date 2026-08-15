# PROPUESTA DE MEJORAS Y DISEÑO.
## Sistema de Gestión de Horarios SENA

**Proyecto:** Optimización de la Interfaz y Flujos de Trabajo  
**Programa de Formación:** Análisis y Desarrollo de Software  
**Institución:** Servicio Nacional de Aprendizaje (SENA)  
**Autor:** Estudiante SENA / Consultor de Experiencia de Usuario y Procesos  
**Fecha:** Agosto 2026  

---

# 1. Introducción y Contexto

El presente documento analiza el prototipo del **Sistema de Gestión de Horarios SENA**, una herramienta diseñada para organizar, asignar y consultar las clases, aulas y horarios de instructores y aprendices en los Centros de Formación.

El objetivo principal de esta evaluación es examinar la pantalla y las interacciones desde una **perspectiva humana y centrada en las personas**. Buscamos identificar las dificultades que enfrentan los usuarios en su día a día al interactuar con el sistema actual y proponer mejoras claras, sencillas e intuitivas que faciliten el trabajo de los coordinadores, la tranquilidad de los instructores y la consulta rápida de los aprendices.

---

# 2. Fase de Empatía y Definición (Design Thinking)

Para diseñar un sistema verdaderamente útil, primero debemos entender a las personas que lo utilizarán. A continuación, se detallan las características, necesidades, frustraciones y expectativas de cada rol dentro de la comunidad SENA.

### 2.1 Análisis de Roles de Usuario

#### 1. Coordinador Académico
Es la persona encargada de armar y coordinar todo el esquema de horarios del centro de formación.
* **Necesidades:** Asignar salones e instructores de forma rápida sin cometer errores ni cruces involuntarios.
* **Frustraciones:** Siente estrés al armar horarios porque el sistema actual solo avisa que hay un problema *después* de haber llenado todo un formulario y presionado guardar, obligándolo a rehacer el trabajo.
* **Expectativas:** Que la pantalla le muestre claramente qué salones y profesores están libres *antes* de elegirlos, y que el sistema guarde su progreso automáticamente si ocurre algún corte de energía o falla de red.

#### 2. Instructor
Es el docente encargado de impartir las clases y guiar a los aprendices en los talleres y ambientes de aprendizaje.
* **Necesidades:** Consultar su programación semanal actualizada y saber con exactitud en qué salón debe dar cada clase.
* **Frustraciones:** Confusión cuando hay cambios de salón de último momento y no recibe una alerta clara, o cuando llega a un ambiente y descubre que no cuenta con las herramientas necesarias para su clase.
* **Expectativas:** Poder revisar su horario desde el teléfono celular con un solo vistazo y contar con un botón sencillo para reportar permisos o imprevistos personales.

#### 3. Aprendiz
Es el estudiante que asiste a la formación académica.
* **Necesidades:** Saber exactamente a qué hora y en qué salón se imparte su clase cada día.
* **Frustraciones:** Dificultad para leer el horario en la pantalla de su teléfono celular, teniendo que deslizar demasiado hacia abajo o hacia los lados sin entender bien a qué día corresponde cada información.
* **Expectativas:** Entrar a la aplicación y ver de inmediato la clase del día actual, resaltando el número de salón y el nombre de su instructor.

#### 4. Director de Centro
Es el directivo responsable de la supervisión general del centro de formación.
* **Necesidades:** Ver resúmenes visuales sobre el aprovechamiento de los salones y el cumplimiento de las jornadas.
* **Frustraciones:** Encontrar reportes con tablas recargadas de datos difíciles de interpretar a simple vista.
* **Expectativas:** Gráficos sencillos y tarjetas de resumen que le permitan tomar decisiones rápidas en reuniones de gestión.

#### 5. Administrador de Soporte
Es el encargado del mantenimiento de usuarios, permisos y catálogos de información.
* **Necesidades:** Gestionar accesos y revisar el historial de cambios realizados en la plataforma.
* **Frustraciones:** Formularios de configuración largos y poco claros que dificultan encontrar la información de un usuario específico.
* **Expectativas:** Pantallas ordenadas por categorías claras con botones de búsqueda rápida y mensajes comprensibles.

---

# 3. Análisis de Oportunidades de Mejora

A partir del recorrido por las pantallas del diseño actual, se han identificado tres grandes áreas de mejora en la experiencia de uso:

### 3.1 Navegación y Distribución de Elementos en Pantalla
* **Ajuste para Pantallas de Teléfonos Celulares:** En dispositivos móviles, las tablas de horarios se convierten en listas muy largas que pierden el orden de los días de la semana. Se propone reemplazar este diseño por pestañas superiores sencillas (Lunes, Martes, Miércoles, etc.) que permitan cambiar de día con un solo toque.
* **Simplificación de Menús Extensos:** Los menús desplegables actuales contienen listas muy largas de opciones sin ordenar. Se propone incluir una casilla de búsqueda dentro de cada lista para que el usuario escriba las primeras letras y encuentre inmediatamente lo que busca.

### 3.2 Claridad en los Flujos de Trabajo e Interacción
* **Prevención de Errores en Lugar de Castigo:** Actualmente, el sistema permite seleccionar un profesor o salón ocupado y solo muestra una pantalla de error en color rojo después de guardar. La mejora consiste en **deshabilitar o marcar visualmente en color gris** los salones y profesores ocupados desde el momento en que se abre la lista de opciones.
* **Guardado Automático de Borradores:** Si un coordinador está creando un horario y por accidente cierra la pestaña del navegador, la información se pierde. Se propone un sistema de **resguardo automático** que conserve los datos escritos para que el usuario pueda continuar exactamente donde se quedó.

### 3.3 Organización Visual y Facilidad de Uso
* **Mayor Contraste y Claridad en los Textos:** Algunos textos secundarios y etiquetas de información tienen letras muy claras sobre fondos grises, lo que dificulta su lectura. Se propone oscurecer los textos y aumentar el tamaño de la letra en datos importantes como el número de salón.
* **Uso Guiado de Colores para Alertas:** Utilizar el verde para acciones exitosas y confirmaciones, el amarillo cálido para advertencias o salones casi llenos, y el rojo únicamente para situaciones que requieran atención urgente, evitando sobrecargar la vista con demasiados tonos intensos.

---

# 4. Priorización de Mejoras (Metodología MoSCoW)

Para organizar la implementación de estas soluciones de forma ordenada y lógica, clasificamos las propuestas utilizando la técnica **MoSCoW**:

| Criterio | Significado | Enfoque de Aplicación |
|---|---|---|
| **Must Have** | *Imprescindible* | Cambios obligatorios sin los cuales el sistema causa confusión o pérdida de información. |
| **Should Have** | *Debería tener* | Mejoras de gran valor que hacen la herramienta mucho más cómoda y rápida de usar. |
| **Could Have** | *Podría tener* | Funciones deseadas que aportan comodidad adicional si el tiempo lo permite. |
| **Won't Have** | *No se incluirá por ahora* | Ideas que se posponen para futuras etapas para no complicar el diseño inicial. |

---

### 4.1 Clasificación Detallada de Propuestas de Mejora

| ID | Categoría MoSCoW | Propuesta de Mejora | ¿Por qué es Importante para el Usuario? |
|---|---|---|---|
| **MEJ-01** | **Must Have** *(Imprescindible)* | **Aviso de Ocupación Previo:** Deshabilitar en las listas de selección los salones y profesores que ya tienen clase a esa hora. | Evita que el usuario cometa errores y tenga que llenar formularios varias veces. |
| **MEJ-02** | **Must Have** *(Imprescindible)* | **Vista Móvil por Pestañas de Día:** Organizar el horario en teléfonos usando pestañas individuales por cada día de la semana. | Permite que aprendices e instructores lean su horario en el celular de forma cómoda y sin perderse. |
| **MEJ-03** | **Must Have** *(Imprescindible)* | **Resguardo Automático de Borradores:** Guardar automáticamente lo que el usuario va escribiendo en pantalla. | Evita que el coordinador pierda su trabajo si falla el navegador o la conexión a internet. |
| **MEJ-04** | **Must Have** *(Imprescindible)* | **Mejora de Tamaño y Contraste de Letra:** Oscurecer los textos informativos para que se lean con total claridad. | Facilita la lectura a personas con cansancio visual o en pantallas con poco brillo. |
| **MEJ-05** | **Should Have** *(Debería tener)* | **Listas con Buscador Integrado:** Agregar una barra de búsqueda dentro de los menús desplegables largos. | Ahorra tiempo al buscar asignaturas, fichas o nombres de profesores en listas extensas. |
| **MEJ-06** | **Should Have** *(Debería tener)* | **Botones de Deshacer y Rehacer:** Permitir retroceder o avanzar cambios con botones claros en pantalla. | Da tranquilidad al usuario para corregir pequeños descuidos sin empezar de cero. |
| **MEJ-07** | **Should Have** *(Debería tener)* | **Alerta Visual de Salón Alternativo:** Cuando un salón esté ocupado, mostrar sugerencias de salones libres cercanos. | Ayuda al coordinador a tomar decisiones rápidamente sin tener que investigar por fuera. |
| **MEJ-08** | **Could Have** *(Podría tener)* | **Descarga de Horario para Calendario Personal:** Permite enviar el horario al calendario del teléfono del aprendiz. | Ayuda a los estudiantes a recibir recordatorios de sus clases en su rutina diaria. |
| **MEJ-09** | **Could Have** *(Podría tener)* | **Botón de Sugerencia Automática:** Un botón que propone un borrador de horario inicial completo. | Sirve como punto de partida rápido cuando se inicia un nuevo trimestre académico. |
| **MEJ-10** | **Won't Have** *(No por ahora)* | **Asistente de Voz para Crear Horarios:** Dictar comandos por voz para armar clases. | Se descarta por ahora para enfocar el esfuerzo en que la pantalla táctil y el teclado funcionen perfecto. |
| **MEJ-11** | **Won't Have** *(No por ahora)* | **Personalización Completa de Colores de Pantalla:** Permitir que cada usuario cambie los tonos del sistema. | Se pospone para mantener la identidad visual institucional uniforme y ordenada. |

---

# 5. Conclusión y Beneficios Esperados

El análisis realizado al prototipo del **Sistema de Gestión de Horarios SENA** demuestra que, aunque la plataforma cuenta con una cantidad valiosa de pantallas e información, su éxito real dependerá de qué tan **fácil, segura y cómoda** resulte para las personas en su rutina diaria.

Al aplicar la fase de **Empatía**, logramos transformar las quejas de los usuarios en soluciones prácticas:
1. **Reducción del Estrés Administrativo:** El Coordinador Académico trabajará con la confianza de que el sistema previene los cruces de horario antes de que ocurran y resguarda su trabajo automáticamente.
2. **Claridad para la Comunidad:** Instructores y Aprendices podrán consultar sus salones y horas desde cualquier teléfono celular en segundos, eliminando las dudas al inicio de cada jornada.
3. **Orden Institucional:** Los Directores y Administradores contarán con pantallas limpias, legibles y bien organizadas para tomar decisiones sin complicaciones.

La priorización mediante la metodología **MoSCoW** servirá como una guía clara para que el equipo de desarrollo se enfoque primero en lo que verdaderamente importa: **brindar una experiencia de uso humana, ágil y sin tropiezos**.
