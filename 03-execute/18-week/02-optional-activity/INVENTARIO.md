# Catálogo de Casos de Uso y Escenarios del Aula

Este documento presenta un inventario del sistema estructurado en torno a situaciones reales que viven los estudiantes y profesores en el salón de clase. Describe cómo responde la aplicación ante cada escenario del día a día académico.

---

## 1. Escenarios de Uso en el Aula

### Caso 1: El Estudiante Puntual (El Flujo Ideal)
* **Situación:** El estudiante llega a tiempo a su clase. El profesor proyecta el código QR en el tablero.
* **Respuesta del Sistema:** El estudiante abre la cámara de su celular, escanea el QR, introduce su número de documento y su contraseña. El sistema confirma su asistencia de forma inmediata, registrando su hora de ingreso y asignándole las **6 horas completas** de la jornada formativa.
* **Componentes Involucrados:** Escáner QR de la cámara, pantalla de login del estudiante, y cálculo de horas regular en el backend.

### Caso 2: El Estudiante que Llega Tarde (Asistencia Fraccionada)
* **Situación:** Un estudiante llega 40 minutos tarde por tráfico.
* **Respuesta del Sistema:** Al escanear el QR e identificarse, el sistema detecta que han pasado más de los 15 minutos de tolerancia inicial. Calcula el tiempo transcurrido y le descuenta 1 hora de asistencia. En su pantalla se muestra un aviso de "Asistencia Parcial", registrando **5 horas validadas** y **1 hora de falla acumulada**.
* **Componentes Involucrados:** Módulo de puntualidad (cálculo de diferencia de tiempo) y alertas de estado en la confirmación.

### Caso 3: El Estudiante sin Datos Móviles o sin Batería (Sin Conectividad)
* **Situación:** Un aprendiz llega al aula pero no tiene saldo de internet en su celular, o se quedó sin batería.
* **Respuesta del Sistema:** Como no puede escanear el QR de forma autónoma, al finalizar la clase se acerca al docente. El docente busca al estudiante por su nombre en la grilla interactiva de su panel y marca su asistencia de forma manual (**Override**), asignándole las horas correspondientes.
* **Componentes Involucrados:** Buscador en la grilla del docente y botón de corrección manual de horas.

### Caso 4: El Estudiante que Intenta Hacer Trampa (Intento de Suplantación)
* **Situación:** Un estudiante se quedó dormido en su casa y le pide a un compañero en el aula que le envíe una foto del código QR por WhatsApp para marcar asistencia desde su cama.
* **Respuesta del Sistema:**
  - Si intenta escanear la foto minutos después: El token del QR ya cambió (el sistema lo rota cada 15 segundos en el proyector) y recibe un mensaje de "Código Expirado".
  - Si intenta escanearlo rápido antes de los 15 segundos: El sistema detecta que la dirección IP de su celular móvil no coincide con la red del salón de clase del docente. El registro es rechazado y guardado en la lista de intentos fallidos con la alerta de seguridad correspondiente.
* **Componentes Involucrados:** Algoritmo de rotación de tokens (HMAC) en el backend y verificador de subred IP.

### Caso 5: La Cámara del Celular no Funciona (Fallo de Hardware)
* **Situación:** El celular de un estudiante es antiguo o tiene la cámara rota, por lo que no puede enfocar el QR del proyector.
* **Respuesta del Sistema:** En lugar de activar la cámara, el estudiante presiona el botón "Ingresar Código Manual". Escribe el código alfanumérico de 6 caracteres que el docente visualiza en su pantalla principal junto al QR y marca su asistencia de forma segura.
* **Componentes Involucrados:** Campo de entrada manual de 6 caracteres en el portal de estudiantes.

### Caso 6: El Estudiante Rezagado (Llegada después del Cierre)
* **Situación:** Un estudiante llega cuando la clase ya está avanzada y el docente cerró oficialmente la sala de asistencia para iniciar la explicación teórica.
* **Respuesta del Sistema:** Al intentar ingresar su documento, el portal le informa que la sala está cerrada. En su lugar, le muestra el formulario de **Petición Tardía (Late Request)**, donde el estudiante escribe su nombre y justifica brevemente su tardanza. El docente evalúa la petición al final de la jornada.
* **Componentes Involucrados:** Formulario de petición tardía y bandeja de solicitudes en el panel docente.

### Caso 7: La Falta con Justificación Médica (Carga de Excusas)
* **Situación:** Un estudiante no asiste a clase por enfermedad. Al día siguiente desea justificar su inasistencia.
* **Respuesta del Sistema:** Desde su casa, el estudiante entra a su panel personal, busca la fecha de la sesión perdida y sube una foto de su incapacidad médica redactando un mensaje. El docente recibe la excusa en su bandeja, revisa el archivo adjunto y, si es válido, aprueba la novedad, convirtiendo la inasistencia (falla) en horas justificadas.
* **Componentes Involucrados:** Formulario de carga de imágenes en Base64 en el panel del alumno, y bandeja de aprobación de excusas en el panel docente.

### Caso 8: El Estudiante Nuevo (No Aparece en la Lista)
* **Situación:** Un aprendiz fue transferido de grupo recientemente y el docente no lo tiene registrado en la ficha académica de ese día.
* **Respuesta del Sistema:** Al ingresar su documento en el QR, el sistema le indica que no figura en la lista de la clase, pero le ofrece un botón de "Autoregistro". El estudiante introduce su nombre y crea una contraseña, quedando registrado en la ficha de forma inmediata para poder marcar su asistencia.
* **Componentes Involucrados:** Módulo de autoregistro rápido en caliente en el portal público.

### Caso 9: La Auditoría Académica (Control del Coordinador)
* **Situación:** El coordinador de la institución necesita auditar si los instructores están dictando las clases de 6 horas completas.
* **Respuesta del Sistema:** El coordinador ingresa a su panel administrativo, revisa el histórico de jornadas de las fichas y comprueba si cada docente subió la foto de soporte físico del salón de clase requerida al dar por concluida la toma de asistencia.
* **Componentes Involucrados:** Módulo del coordinador y cargador de imágenes de evidencia de sala.
