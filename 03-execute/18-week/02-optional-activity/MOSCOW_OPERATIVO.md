# Planificación MoSCoW y Evaluación Basada en Casos de Uso

Este documento clasifica las actividades de la jornada académica mediante la matriz MoSCoW enfocándose en dar respuesta a los casos de uso reales del aula, y presenta la autorreflexión de nuestro equipo sobre el proceso de diseño y desarrollo del sistema.

---

## 1. Matriz MoSCoW de Casos de Uso (Prioridades de Hoy)

Para asegurar que el sistema responda con calidad a las necesidades prioritarias del salón de clase sin alterar el código que ya está funcionando y desplegado, organizamos la matriz basándonos en los escenarios de los usuarios:

```
┌────────────────────────────────────────────────────────────────────────┐
│                              MATRIZ MoSCoW                             │
│                                                                        │
│  MUST HAVE (Crítico para hoy)           SHOULD HAVE (Importante)       │
│  ┌───────────────────────────────────┐  ┌───────────────────────────┐  │
│  │ - Asegurar que funcionen:         │  │ - Validar:                │  │
│  │   * Caso 1: Estudiante puntual    │  │   * Caso 2: El retardo    │  │
│  │   * Caso 3: Registro manual       │  │     fraccionado.          │  │
│  │   * Caso 5: Cámara rota           │  │   * Caso 4: Control de    │  │
│  │   * Caso 8: Alumno nuevo          │  │     trampa/IP.            │  │
│  └───────────────────────────────────┘  └───────────────────────────┘  │
│                                                                        │
│  COULD HAVE (Opcional si hay tiempo)    WON'T HAVE (Futuras sesiones)  │
│  ┌───────────────────────────────────┐  ┌───────────────────────────┐  │
│  │ - Esbozar en papel mejoras para:  │  │ - Modificar código fuente   │  │
│  │   * Caso 6: Peticiones tardías.   │  │   de la app desplegada.   │  │
│  │   * Caso 7: Carga de excusas.     │  │ - Implementar el Caso 9   │  │
│  │                                   │  │   (Auditoría Coordinador).│  │
│  └───────────────────────────────────┘  └───────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### 🟩 Must Have (Debe tener) - Escenarios Críticos para Operar Hoy
* **Caso 1 (Estudiante puntual):** El flujo feliz de asistencia debe operar sin contratiempos, ya que es la base del sistema.
* **Caso 3 (Estudiante sin internet/batería):** El docente debe poder marcar la asistencia manualmente en clase para rescatar a estudiantes excluidos por fallos de conectividad.
* **Caso 5 (Fallo de cámara):** El código alfanumérico manual de 6 caracteres es obligatorio para salvar el registro de alumnos con celulares defectuosos.
* **Caso 8 (Estudiante nuevo):** El autoregistro en el salón de clase es fundamental para mitigar la fricción de alumnos transferidos de última hora.
* **Documentación:** Consolidar e inventariar estos casos de uso en el portafolio.

### 🟨 Should Have (Debería tener) - Control y Calidad
* **Caso 2 (Retraso fraccionado):** El cálculo proporcional de horas por impuntualidad debe validarse en el backend para penalizar de forma justa los retardos.
* **Caso 4 (Intento de trampa):** La rotación del QR de 15 segundos y la validación de IP deben estar operativas para garantizar la honestidad de la clase.

### 🟦 Could Have (Podría tener) - Flujos Secundarios de Comodidad
* **Caso 6 (Petición tardía):** El formulario de solicitud de retraso si la sala está cerrada.
* **Caso 7 (Carga de excusas):** Cargar soportes de incapacidades Base64 de días previos desde el panel del alumno.

### 🟥 Won't Have (No se hará hoy) - Dejado para el Futuro
* **Alterar la lógica desplegada:** Ningún cambio de código de último minuto que pueda arruinar la presentación funcional en clase hoy.
* **Caso 9 (Auditoría del coordinador):** La verificación fotográfica de evidencias de sala por la coordinación se pospone, ya que la toma de asistencia opera de forma independiente a la auditoría.

---

## 2. KPIs de la Experiencia por Caso de Uso

Evaluamos cualitativamente el nivel de éxito que alcanza el sistema actual en la resolución de cada situación real en el aula:

| Escenario Evaluado | Nivel de Éxito | Evaluación Cualitativa del Comportamiento |
|---|---|---|
| **Caso 1 (Puntual)** | ⭐⭐⭐⭐⭐ | Impecable. El check-in con código QR dinámico es intuitivo y toma menos de 10 segundos. |
| **Caso 3 (Sin datos/batería)** | ⭐⭐⭐⭐☆ | Muy Bueno. La grilla del docente responde bien, aunque el botón de override manual podría tener un diseño más simple y directo. |
| **Caso 5 (Cámara rota)** | ⭐⭐⭐⭐⭐ | Impecable. El código alfanumérico de 6 caracteres es visible en pantalla y resuelve la toma de asistencia en segundos. |
| **Caso 8 (Alumno nuevo)** | ⭐⭐⭐⭐☆ | Bueno. El autoregistro funciona, pero no avisa al docente que un alumno nuevo se matriculó hasta que se actualiza la grilla. |
| **Caso 4 (Evitar trampa)** | ⭐⭐⭐☆☆ | Regular. La rotación de 15 segundos es efectiva, pero el chequeo de subred IP da errores de acceso a quienes usan datos móviles en lugar de la red local. |

---

## 3. Autorreflexión del Equipo: ¿Por qué fallamos en la planeación?

El error de nuestro equipo fue **rumbear directo a escribir código motivados por tener algo funcional y desplegado**, saltándonos el diseño conceptual previo (MoSCoW y Design Thinking).

* **Consecuencia del apresuramiento:**
  Al no modelar primero en papel los casos de uso, dedicamos demasiado tiempo a programar y probar el control estricto de subredes IP (Caso 4) pensando que todos usarían la red Wi-Fi de aprendices del salón. Sin embargo, en el aula real es común que algunos estudiantes se conecten por costumbre con sus datos móviles personales, lo que causa que el sistema los bloquee por no estar en la misma subred local y obliga al docente a realizar registros manuales innecesarios.
* **Lección Aprendida:**
  Si hubiéramos diseñado en papel y analizado cualitativamente el contexto del aula real primero, habríamos identificado que el **Caso 3 (Estudiante sin internet)** y el **Caso 5 (Fallo de cámara)** eran de mayor prioridad y urgencia en la experiencia real que la automatización de la auditoría de evidencias del coordinador.
* **Compromiso Metodológico:**
  A partir de ahora, todo desarrollo del grupo iniciará dibujando las interacciones en papel y validando con MoSCoW qué escenarios de usuario son indispensables antes de tirar la primera línea de código.
