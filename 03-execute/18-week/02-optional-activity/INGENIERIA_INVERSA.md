# Ingeniería Inversa y Reglas de Negocio en el Aula

Este documento explica cómo funciona "por detrás" la lógica del sistema de asistencia para dar respuesta a los escenarios cotidianos de la clase, y propone una guía conceptual para rediseñar la experiencia del usuario (UX) partiendo desde el papel.

---

## 1. Reglas de Negocio y Lógica Conceptual

Para que los casos de uso descritos en el inventario funcionen, el servidor procesa y evalúa constantemente una serie de reglas lógicas basadas en el comportamiento de los estudiantes:

### A. La Regla de la Puntualidad (Retraso Fraccionado)
* **El Problema:** La asistencia tradicional es binaria (vino o no vino). Pero en la formación técnica (ej. clases de 6 horas), un alumno que llega 1 hora tarde no debería perder todo el día, pero tampoco registrar 6 horas completas.
* **La Lógica del Sistema:** Al activarse la sesión, se fija una hora de inicio.
  - Si el estudiante registra su ingreso entre el minuto 0 y el 15, el sistema le otorga el 100% de las horas (6 horas asistidas, 0 de falla).
  - A partir del minuto 16, cada hora de retraso o fracción representa la pérdida de un "bloque" completo. El servidor calcula la diferencia de minutos, descuenta las horas y actualiza su estado a "Asistencia Parcial".

### B. El Mecanismo Anti-Fraude (Código Dinámico e IP)
* **El Problema:** La "viveza criolla" de compartir capturas de pantalla del QR por redes sociales para registrarse sin estar en el salón.
* **La Lógica del Sistema:**
  - El token que se proyecta en el QR cambia cada 15 segundos en base al índice de tiempo del servidor. Cuando el celular envía la marcación, el backend comprueba si el token enviado coincide con el bloque de tiempo activo. Si es viejo, se rechaza.
  - Para evitar que los alumnos compartan el código manual de 6 caracteres muy rápido por chat, el sistema puede verificar que el celular del estudiante esté enviando la petición desde la misma subred de internet (NAT compartido) que el computador del docente, asegurando que ambos están compartiendo la red del aula. En la práctica, esto requiere que los estudiantes se conecten a la red Wi-Fi local de aprendices provista en el laboratorio, ya que si intentan usar sus datos móviles personales, la diferencia de IP provocará un bloqueo de seguridad.

### C. La Flexibilidad ante Imprevistos (Fallo de Cámara y Sin Conectividad)
* **El Problema:** El estudiante con cámara rota o sin señal de datos.
* **La Lógica del Sistema:**
  - Si la cámara no responde, el portal ofrece un campo de texto alternativo para escribir los 6 caracteres del código dinámico que el docente proyecta.
  - Si el alumno no tiene internet, el docente actúa como punto de entrada de la información mediante el "Override Manual" en su panel, corrigiendo directamente en la base de datos las horas de inasistencia del alumno para no perjudicarlo por fallas técnicas ajenas a su control.

---

## 2. Estrategia de Reconstrucción Conceptual (Design Thinking)

Si tuviéramos que rehacer este sistema desde cero partiendo con maquetas en papel, el enfoque cualitativo se centraría en resolver la experiencia antes de escribir una sola línea de código:

### Fase 1: Empatizar con el Aula Real
* **El Estudiante:** No quiere lidiar con logins complejos cada mañana. Desea llegar, escanear en un segundo y sentarse a estudiar.
* **El Docente:** No quiere pasar los primeros 20 minutos de clase ayudando a alumnos que no pueden conectarse al sistema.

### Fase 2: Rediseñar los Flujos en Papel (Ideación)
1. **Asistencia "Un Clic" (Recordar Usuario):** En lugar de pedir documento y contraseña en cada clase, la app del estudiante debería recordar su sesión en el navegador local, permitiendo que marcar asistencia sea tan sencillo como abrir el escáner y pulsar "Registrar".
2. **Registro Offline Inteligente:** Si el estudiante no tiene señal, la app captura el QR con la hora local firmada. Al salir de la clase o llegar a su casa con internet, la app envía los registros guardados en cola y el servidor valida su veracidad.
3. **Flujo de Override Visual:** Simplificar el panel docente para que con un simple deslizamiento (swipe) sobre el nombre del alumno ausente se le cambie el estado a "Presente con Justificación", reduciendo la cantidad de clics que el profesor debe realizar frente a la pantalla de la laptop.
