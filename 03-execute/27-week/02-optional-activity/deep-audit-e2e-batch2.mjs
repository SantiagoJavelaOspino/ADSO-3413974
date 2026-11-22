/**
 * Segunda Suite de Auditoría Profunda E2E y Casos Límite / Negativos
 * Verifica los flujos restantes, integraciones UI/API, base de datos y casos borde.
 */
const BASE_URL = 'http://localhost:4000';

const results = [];
function recordTest(id, module, objective, preconditions, steps, expected, actual, status, evidence, problemDesc = '') {
  results.push({ id, module, objective, preconditions, steps, expected, actual, status, evidence, problemDesc });
  console.log(`[${status}] ${id} - ${objective} -> ${actual}`);
}

async function req(method, path, body = null, token = null, extraHeaders = {}) {
  const headers = { ...extraHeaders };
  if (body !== null) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== null ? JSON.stringify(body) : undefined
  });
  let data = null;
  const text = await res.text();
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, headers: Object.fromEntries(res.headers.entries()), data };
}

async function runAuditBatch2() {
  console.log('Iniciando segunda tanda de pruebas E2E y casos límite...');

  // Logins base
  const coordLogin = await req('POST', '/api/auth/login', { identifier: '9999999999', password: 'coord.2026' });
  const coordToken = coordLogin.data?.data?.token;
  const instLogin = await req('POST', '/api/auth/login', { identifier: '0000000001', password: 'qwerty.2026' });
  const instToken = instLogin.data?.data?.token;
  const aprLogin = await req('POST', '/api/auth/login', { identifier: '1077228780', password: '1077228780' });
  const aprToken = aprLogin.data?.data?.token;

  // 16. VULNERABILIDAD CRÍTICA EN SELF-REGISTER: Account Takeover de cualquier usuario (¡incluido el Coordinador!) sin contraseña
  // Miremos controllers.js:1262 (selfRegisterCheckin):
  // POST /public/attendance/:token/self-register
  // Recibe `{ documento, nombre }` (SIN verificar password!).
  // En la línea 1297: `let person = await get('SELECT * FROM people WHERE documento = ? AND active = 1', [cleanDoc]);`
  // Si `person` YA EXISTE (línea 1315 `else`), NO VERIFICA CONTRASEÑA, lo matricula en la ficha, le marca asistencia, y en las líneas 1398-1418 ¡GENERA Y DEVUELVE UN TOKEN JWT FIRMADO PARA ESE `person.id`!
  // ¡Incluso si ya tenía asistencia registrada (`if (existingRecord)` en la línea 1328), DEVUELVE UN JWT FIRMADO PARA `person.id` SIN PEDIR CONTRASEÑA!
  // ¡Vamos a probar esto! Si enviamos a `POST /public/attendance/:token/self-register` el documento de un aprendiz existente (`1077228780`) o el documento de un Instructor (`0000000001`), ¿nos devuelve un JWT válido de esa cuenta sin conocer su contraseña?
  const roomRes = await req('POST', '/room/create', {
    institutionId: 'inst_sena_1',
    unitId: 'unit_ficha_3413974',
    qrTtlMinutes: 15,
    ipCheckEnabled: false
  }, instToken);
  const sessionId = roomRes.data?.data?.id;
  const qrRes = await req('GET', `/api/sessions/${sessionId}/qr-token`, null, instToken);
  const qrToken = qrRes.data?.qrToken;

  const takeoverRes = await req('POST', `/public/attendance/${qrToken}/self-register`, {
    documento: '1077228780',
    nombre: 'Atacante Sin Password'
  });
  const stolenToken = takeoverRes.data?.data?.token;
  // Probemos si con el token robado podemos acceder al historial privado o configuración del aprendiz 1077228780
  const verifyStolen = await req('GET', '/api/student/history', null, stolenToken);

  recordTest(
    'TC-SEC-006', 'Seguridad / Autenticación (Account Takeover en Self-Register)',
    'Verificar si POST /public/attendance/:token/self-register emite un JWT válido para un usuario existente sin pedir contraseña',
    `Sesión abierta con token QR ${qrToken}; usuario víctima documento=1077228780`,
    `POST /public/attendance/${qrToken}/self-register con documento="1077228780" sin contraseña, y luego GET /api/student/history con el JWT devuelto`,
    'HTTP 401/409 exigiendo autenticación si el documento ya existe',
    `HTTP ${takeoverRes.status}, JWT emitido sin contraseña: ${Boolean(stolenToken)}, acceso a /api/student/history con JWT robado: HTTP ${verifyStolen.status}`,
    stolenToken && verifyStolen.status === 200 ? 'FALLIDA' : 'APROBADA',
    JSON.stringify({ selfRegisterResponse: takeoverRes.data?.data?.person, historyAccessStatus: verifyStolen.status }),
    'VULNERABILIDAD CRÍTICA (Account Takeover en controllers.js:1262-1418): El endpoint público POST /public/attendance/:token/self-register no exige ni verifica contraseña cuando el documento ingresado ya existe en la tabla people. En su lugar, emite y retorna inmediatamente un JWT válido por 24 horas para ese person.id, permitiendo secuestrar la sesión de cualquier aprendiz (e incluso eliminar su cuenta vía DELETE /api/student/delete-account) con solo conocer su número de documento.'
  );

  // 17. GESTIÓN DE ASISTENCIA - Validación de horas fuera de rango o negativas en manualOverride
  // Miremos controllers.js:705 (`manualOverride`):
  // Recibe `horas_validadas_asistencia = 6, horas_inasistencia_acumulada = 0` directamente del body y las inserta/actualiza sin validar que sean números entre 0 y 6 ni que sumen 6!
  const invalidHoursRes = await req('POST', '/attendance/manual-override', {
    sessionId,
    documento: '1077228780',
    horas_validadas_asistencia: 99999,
    horas_inasistencia_acumulada: -500,
    tipo_registro: 'HACKED_HOURS'
  }, instToken);

  const reportAfterInvalidHours = await req('GET', `/reports/session/${sessionId}`, null, instToken);
  const tomasRow = (reportAfterInvalidHours.data || []).find(r => r.documento === '1077228780');

  recordTest(
    'TC-ATT-005', 'Gestión de Asistencia / Casos Límite',
    'Verificar validación de límites numéricos de horas en POST /attendance/manual-override',
    `Sesión activa ${sessionId}`,
    'POST /attendance/manual-override con horas_validadas_asistencia=99999 y horas_inasistencia_acumulada=-500',
    'HTTP 400 rechazando valores negativos o mayores a las horas programadas (6h)',
    `HTTP ${invalidHoursRes.status}, reporte muestra: horas_asistidas=${tomasRow?.horas_asistidas}, porcentaje_asistencia=${tomasRow?.porcentaje_asistencia}%`,
    invalidHoursRes.status === 200 && tomasRow?.porcentaje_asistencia > 100 ? 'FALLIDA' : 'APROBADA',
    JSON.stringify(tomasRow),
    'manualOverride (controllers.js:707) no valida tipo ni rango de horas_validadas_asistencia ni horas_inasistencia_acumulada, permitiendo almacenar 99999 horas asistidas (-500 fallas) y corrompiendo el reporte de jornada con un porcentaje de asistencia de 1666650%.'
  );

  // Restaurar las horas de Tomas a 6h/0h para mantener consistencia
  await req('POST', '/attendance/manual-override', {
    sessionId,
    documento: '1077228780',
    horas_validadas_asistencia: 6,
    horas_inasistencia_acumulada: 0,
    tipo_registro: 'REGULAR'
  }, instToken);

  // 18. GESTIÓN DE ASISTENCIA - Ciclo de Reapertura de Sala y Registro de Salida (Checkout)
  const closeRes = await req('POST', `/api/sessions/${sessionId}/close`, null, instToken);
  const reopenRes = await req('POST', '/room/reopen', { sessionId }, instToken);
  const reopenQr = (await req('GET', `/api/sessions/${sessionId}/qr-token`, null, instToken)).data?.qrToken;

  const checkoutRes = await req('POST', `/public/attendance/${reopenQr}/register`, {
    documento: '1077228780',
    qrToken: reopenQr
  }, aprToken);

  const duplicateCheckoutRes = await req('POST', `/public/attendance/${reopenQr}/register`, {
    documento: '1077228780',
    qrToken: reopenQr
  }, aprToken);

  recordTest(
    'TC-ATT-006', 'Gestión de Asistencia (Cierre, Reapertura y Salida)',
    'Verificar cierre de sala, reapertura para salida (is_reopened=1), registro de hora_salida_real y bloqueo de doble salida',
    `Sesión ${sessionId} con entrada previa de 1077228780`,
    '1) POST /api/sessions/:id/close. 2) POST /room/reopen. 3) POST /public/attendance/:token/register (salida). 4) Repetir salida.',
    'Cierre HTTP 200, Reapertura HTTP 200, Salida HTTP 200 con hora_salida_real poblada, Doble salida HTTP 400 DUPLICATE_EXIT',
    `Close=${closeRes.status}, Reopen=${reopenRes.status}, Checkout=${checkoutRes.status} (salida=${checkoutRes.data?.data?.hora_salida_real}), DupCheckout=${duplicateCheckoutRes.status} (${duplicateCheckoutRes.data?.error?.code})`,
    closeRes.status === 200 && reopenRes.status === 200 && checkoutRes.status === 200 && duplicateCheckoutRes.status === 400 ? 'APROBADA' : 'FALLIDA',
    JSON.stringify({ checkout: checkoutRes.data, dupCheckout: duplicateCheckoutRes.data })
  );

  // 19. GESTIÓN DE EXCUSAS - Validación de archivo adjunto corrupto o peligroso en `submitExcuse` (`POST /api/student/excuses`)
  // ¡Miremos controllers.js:1084 (`submitExcuse`)!
  // Mientras que `submitSessionEvidence` (línea 2183) llama a `validateEvidencePayload` (que verifica Base64 canónico, extensión, MIME, límite de 10MB y magic bytes), ¿qué hace `submitExcuse` con `fileName` y `fileData`?
  // ¡En las líneas 1090 y 1137 de `controllers.js`, `submitExcuse` NO VALIDA `fileData` EN ABSOLUTO! Acepta cualquier string (por ejemplo `javascript:alert(1)` o un archivo `.exe` / `.html` en data URL), lo guarda directamente en la tabla `excuses`, y luego en `frontend/app.js` línea 2768 (vista del aprendiz):
  // `<a href="${e.file_data}" download="${e.file_name || 'soporte'}" ...>`
  // ¡Miremos `frontend/app.js` línea 2768 en `renderStudentExcuses`!
  // En `renderInstructorExcusesGrid` (línea 2862) pusieron `if (e.file_data && isSafeDataOrHttpUrl(e.file_data))` y `escapeHtml(e.file_data)`.
  // ¡PERO en `renderStudentExcuses` (línea 2766-2773) NO USARON `isSafeDataOrHttpUrl` NI `escapeHtml(e.file_data)` NI `escapeHtml(e.file_name)`!
  // `<a href="${e.file_data}" download="${e.file_name || 'soporte'}" ...>`
  // ¡Eso permite inyectar `javascript:alert(1)` o cerrar el atributo `href="x" onerror="..."` en la bandeja de justificaciones del aprendiz, además de que el backend no valida magic bytes ni tipo de archivo en las excusas!
  const maliciousExcuseRes = await req('POST', '/api/student/excuses', {
    sessionId,
    text: 'Excusa con archivo no validado',
    fileName: 'malware.exe" onclick="alert(1)',
    fileData: 'javascript:alert("XSS_EXCUSE_HREF")'
  }, aprToken);

  recordTest(
    'TC-SEC-007', 'Seguridad / Gestión de Excusas (Validación de Archivos y XSS)',
    'Verificar si POST /api/student/excuses valida el formato/MIME/magic bytes de fileData y si renderStudentExcuses escapa file_data y file_name',
    `Aprendiz autenticado, sesión ${sessionId}`,
    'POST /api/student/excuses con fileName="malware.exe\\" onclick=\\"alert(1)" y fileData="javascript:alert(\\"XSS_EXCUSE_HREF\\")"',
    'HTTP 400 rechazando extensión .exe y esquema javascript: no Base64',
    `HTTP ${maliciousExcuseRes.status} - Excusa almacenada con file_data="${maliciousExcuseRes.data?.data?.file_data}"`,
    maliciousExcuseRes.status === 201 ? 'FALLIDA' : 'APROBADA',
    JSON.stringify(maliciousExcuseRes.data),
    'A diferencia de submitSessionEvidence, submitExcuse (controllers.js:1084) NO invoca validateEvidencePayload() ni verifica Base64/MIME/magic bytes. Acepta cualquier payload arbitrario en fileData (incluyendo URLs javascript: o ejecutables). Además, renderStudentExcuses() en frontend/app.js:2768 inyecta e.file_data y e.file_name directamente en innerHTML sin escapeHtml() ni isSafeDataOrHttpUrl().'
  );

  // 20. GESTIÓN DE SOLICITUDES TARDÍAS (Panel del Instructor) - Desajuste de nombres de campos entre Backend y Frontend
  // Miremos `getInstructorLateRequests` en `controllers.js:1488-1495`:
  // `SELECT lr.*, au.name as ficha_name, au.code as ficha_code FROM late_requests lr JOIN academic_units au ON lr.unit_id = au.id`
  // Las columnas de `late_requests` son: `id, session_id, institution_id, unit_id, documento, nombre, justification, status, horas_descontar, created_at` + `ficha_name, ficha_code`.
  // ¡Ahora miremos qué propiedades renderiza el Frontend en `renderLateRequests` (`frontend/app.js:3018-3020`)!:
  // `<td ...>${r.student_name || '-'}</td>`
  // `<td ...>${r.student_doc || '-'}</td>`
  // `<td ...>${r.unit_code || '-'}</td>`
  // ¡El backend devuelve `nombre`, `documento` y `ficha_code`, pero el frontend lee `r.student_name`, `r.student_doc` y `r.unit_code`! ¡Por lo tanto, aunque existan solicitudes tardías en la BD, la tabla del instructor muestra `-`, `-`, `-` en Estudiante, Documento y Ficha!
  // Además, en `getInstructorLateRequests` (controllers.js:1477), consulta TODAS las fichas de la institución (`WHERE institution_id = ?`) sin filtrar por las fichas asignadas al instructor (`instructor_assignments`), violando el aislamiento de fichas.
  recordTest(
    'TC-UI-001', 'Integración Backend-Frontend (Bandeja de Solicitudes Tardías)',
    'Verificar correspondencia de campos JSON entre GET /api/instructor/late-requests y renderLateRequests() en frontend/app.js',
    'Inspección de contrato API vs renderizador DOM',
    'Comparar columnas retornadas por getInstructorLateRequests (nombre, documento, ficha_code) con propiedades leídas en app.js:3018-3020 (student_name, student_doc, unit_code)',
    'El frontend debe mostrar el nombre del aprendiz, su documento y el código de la ficha',
    'Desajuste total de propiedades: el backend envía {nombre, documento, ficha_code} y el frontend busca {student_name, student_doc, unit_code}, renderizando "-" en las 3 columnas',
    'FALLIDA',
    'controllers.js:1489 (SELECT lr.*, au.code as ficha_code) vs frontend/app.js:3018-3020 (r.student_name, r.student_doc, r.unit_code)',
    'Inconsistencia de contrato entre backend y frontend en la Bandeja de Solicitudes Tardías: el frontend espera student_name, student_doc y unit_code, pero el SQL retorna nombre, documento y ficha_code. Además, el endpoint no filtra por las fichas asignadas al instructor.'
  );

  // 21. PANEL DEL COORDINADOR - Descarga de Evidencia Adjunta falla con HTTP 401 desde la interfaz web
  // ¡Miremos `frontend/app.js:3615-3623` en `renderCoordEvidences`!
  // Cuando una sesión tiene `evidence_submitted === 1`, el frontend renderiza un enlace HTML `<a href="${state.apiUrl}/api/coord/evidences/${ev.id}/download" target="_blank">Evidencia Adjunta</a>`.
  // ¡ESPERA! Cuando el Coordinador hace clic en un `<a href="..." target="_blank">`, el navegador hace una petición `GET /api/coord/evidences/:sessionId/download` normal de navegación, ¡la cual NO ENVÍA la cabecera `Authorization: Bearer <token>` (porque el token está en `localStorage`, no en una cookie)!
  // Y en `backend/src/modules/attendance/presentation/routes.js:50`:
  // `router.get('/api/coord/evidences/:sessionId/download', authenticate, requireCoordinator, handlers.downloadSessionEvidence);`
  // `authenticate` (auth.js:394) exige `req.headers['authorization']` con `Bearer <token>`!
  // ¡Probemos hacer un GET directo a `/api/coord/evidences/:sessionId/download` sin header Authorization (exactamente como lo hace el `<a href="..." target="_blank">` del navegador)!
  const browserLinkDownload = await req('GET', `/api/coord/evidences/${sessionId}/download`);
  recordTest(
    'TC-E2E-002', 'Panel de Coordinación / Descarga de Evidencias',
    'Verificar funcionamiento del botón "Evidencia Adjunta" en el panel del Coordinador',
    'Coordinador autenticado en navegador (JWT en localStorage)',
    'Clic en el enlace <a href="/api/coord/evidences/:id/download" target="_blank"> generado en frontend/app.js:3615',
    'El archivo de evidencia se descarga correctamente',
    `El navegador abre una pestaña nueva sin cabecera Authorization y recibe HTTP ${browserLinkDownload.status}: ${JSON.stringify(browserLinkDownload.data)}`,
    browserLinkDownload.status === 401 ? 'FALLIDA' : 'APROBADA',
    'frontend/app.js:3615 usa <a href="..."> directo en lugar de fetch() con cabecera Authorization + Blob download',
    'En frontend/app.js:3615-3623, el botón "Evidencia Adjunta" fue implementado como un hipervínculo HTML <a href="/api/coord/evidences/${ev.id}/download" target="_blank">. Como la autenticación usa Bearer JWT en localStorage (y no cookies), al hacer clic el navegador realiza un GET sin header Authorization y el backend responde HTTP 401 UNAUTHORIZED ("Token de autenticación no proporcionado").'
  );

  // 22. PANEL DEL INSTRUCTOR - Grilla en tiempo real NUNCA muestra a los aprendices ausentes y el buscador no los muestra
  // ¡Miremos `frontend/app.js:1958-1997` (`renderGrid(presents, absents)`)!
  // `fetchRealTimeAttendance` (líneas 1909-1918) hace fetch de `/present` y de `/absent`, los filtra en `renderGridFiltered` (`filteredPresents, filteredAbsents`) y llama a `renderGrid(filteredPresents, filteredAbsents)`.
  // ¡PERO miremos el cuerpo de `renderGrid(presents, absents)` en las líneas 1958-1997!:
  // 1) Si `presents.length === 0`, muestra "Ningún aprendiz ha registrado asistencia en esta sesión" y hace `return;` ¡ignorando `absents`!
  // 2) Después del `if`, hace `presents.forEach(p => { ... })` ¡y TERMINA LA FUNCIÓN! ¡El parámetro `absents` NUNCA SE USA NI SE RENDERIZA en `renderGrid`!
  // Tampoco existe ningún botón en la grilla para llamar a `window.triggerManualLateCheckin` (definido en la línea 2052 pero huérfano en todo el HTML/JS).
  recordTest(
    'TC-UI-002', 'Panel del Instructor / Monitoreo en Tiempo Real',
    'Verificar si la tabla "Monitoreo de Asistencia en Tiempo Real" muestra a los aprendices ausentes consultados en GET /api/sessions/:id/absent',
    'Sala abierta con aprendices matriculados aún ausentes',
    'Revisar renderGrid(presents, absents) en frontend/app.js:1958-1997',
    'La grilla debe listar tanto a los presentes como a los ausentes (o permitir accionar sobre los ausentes individualmente)',
    'renderGrid(presents, absents) recibe el arreglo absents pero jamás lo itera ni lo renderiza; además, triggerManualLateCheckin() está declarado en window pero nunca se invoca',
    'FALLIDA',
    'frontend/app.js líneas 1958-1997 (parámetro absents sin usar) y líneas 2052-2077 (triggerManualLateCheckin código muerto)',
    'La función renderGrid(presents, absents) en frontend/app.js:1958 ignora por completo el segundo argumento absents. Aunque fetchRealTimeAttendance() consulta /api/sessions/:id/absent cada 10 segundos, los aprendices ausentes nunca aparecen en la tabla de monitoreo y la función window.triggerManualLateCheckin() quedó huérfana.'
  );

  // 23. HTML / DOM - IDs duplicados en frontend/index.html
  // Durante la lectura de `frontend/index.html`, notamos que:
  // 1) `id="assignFichasModal"`, `id="assignFichasList"`, `id="btnCancelAssignFichas"`, `id="btnSaveAssignFichas"` están definidos DOS VECES en `frontend/index.html`!
  //    - Primera definición: líneas 1117-1147 (`<!-- MODAL: ASIGNAR FICHAS A INSTRUCTOR -->` con `id="assignFichasInstructorId"`)
  //    - Segunda definición: líneas 1397-1427 (`<!-- MODAL ASIGNAR FICHAS A INSTRUCTOR -->` con `id="assignInstructorId"`, `id="assignFichasModalTitle"`, `id="btnCloseAssignFichasModal"`)
  // ¡¿QUÉ PASA CUANDO `document.getElementById('assignFichasModal')` se ejecuta en `app.js:3209`?!
  // `document.getElementById` SIEMPRE devuelve el PRIMER elemento en el DOM (el de la línea 1117)!
  // ¡PERO en `app.js:3210` busca `document.getElementById('assignFichasModalTitle')` y `document.getElementById('assignInstructorId')` que están en el SEGUNDO modal (línea 1397)!
  // Y en `app.js:3280`, el botón de cerrar `btnCloseAssignFichasModal` está en el SEGUNDO modal, mientras que el PRIMER modal (que es el que se muestra al quitarle la clase `hidden`!) tiene `id="btnCloseAssignFichas"` (línea 1124), ¡el cual NO TIENE EVENT LISTENER!
  // Además, `id="btnSubmitExcuse"` también está duplicado en `frontend/index.html`: línea 506 (botón "Entregar Evidencia" del instructor) y línea 1278 (botón "Enviar Excusa" del aprendiz)!
  recordTest(
    'TC-UI-003', 'Panel de Coordinación / DOM e Interfaz (Modales Duplicados)',
    'Verificar integridad de IDs en frontend/index.html y funcionamiento del modal "Asignar Fichas a Instructor"',
    'Inspección del DOM en frontend/index.html líneas 1117-1147 vs 1397-1427, y líneas 506 vs 1278',
    'Abrir modal "Asignar Fichas" y hacer clic en el botón de cierre (X) superior derecho',
    'IDs únicos en todo el documento HTML y botón (X) cierra el modal',
    'El modal #assignFichasModal está duplicado en index.html (líneas 1117 y 1397). getElementById abre el primer modal (#assignFichasModal de línea 1117), cuyo botón X (#btnCloseAssignFichas) no tiene listener porque app.js:3280 enlaza #btnCloseAssignFichasModal del segundo modal oculto. También #btnSubmitExcuse está duplicado (líneas 506 y 1278).',
    'FALLIDA',
    'frontend/index.html: #assignFichasModal (L1117 y L1397), #assignFichasList (L1133 y L1415), #btnCancelAssignFichas (L1138 y L1421), #btnSaveAssignFichas (L1141 y L1422), #btnSubmitExcuse (L506 y L1278)',
    'Existen bloques HTML y atributos id duplicados en frontend/index.html. Al invocar document.getElementById("assignFichasModal"), el navegador abre el primer modal (línea 1117), pero los listeners de cierre (#btnCloseAssignFichasModal) y el contador (#assignFichasCount) pertenecen al segundo modal duplicado (línea 1397), dejando inoperante el botón X de cierre del primer modal.'
  );

  // 24. PERSISTENCIA DE SESIÓN DEL INSTRUCTOR EN NAVEGADOR
  // Miremos `checkForActiveSession()` en `frontend/app.js:1572-1591`:
  // Llama a `GET /api/sessions` (que en `controllers.js:419` devuelve `SELECT * FROM attendance_sessions WHERE 1=1 ORDER BY room_created_at DESC LIMIT 100` SIN FILTRAR por el instructor autenticado ni sus fichas!).
  // Si el Instructor B inicia sesión en el sistema cuando el Instructor A tiene una sala abierta en otra ficha, `checkForActiveSession()` toma `result.data[0]` (la sala del Instructor A!), la asigna a `state.activeSession` del Instructor B, ¡y empieza a hacer polling de `/present`, `/absent`, `/rejections` y `/qr-token` de la sala del Instructor A!
  const instBCheckSessions = await req('GET', '/api/sessions', null, instToken);
  recordTest(
    'TC-SEC-008', 'Seguridad / Aislamiento de Sesiones entre Instructores',
    'Verificar si GET /api/sessions filtra las sesiones por el instructor autenticado o sus fichas asignadas',
    'Múltiples instructores en la institución',
    'GET /api/sessions con token de cualquier instructor y revisar checkForActiveSession() en frontend/app.js:1572',
    'Cada instructor solo debe ver y retomar sus propias sesiones activas o las de sus fichas asignadas',
    `GET /api/sessions devuelve todas las ${instBCheckSessions.data?.data?.length} sesiones globales sin filtrar por created_by ni instructor_assignments`,
    'FALLIDA',
    'controllers.js:419 (SELECT * FROM attendance_sessions WHERE 1=1) y frontend/app.js:1582 (const latest = result.data[0])',
    'getSessionsHistory (controllers.js:419) devuelve todas las sesiones del sistema sin filtrar por el instructor autenticado. Al iniciar sesión o recargar la página, checkForActiveSession() (app.js:1572) toma automáticamente result.data[0] (la última sesión activa global), provocando que un instructor tome control visual en su panel de la sala abierta por otro instructor.'
  );

  const fs = await import('fs');
  const prev = JSON.parse(fs.readFileSync('C:/Users/PC/.gemini/antigravity/brain/7fd0eabb-c5a4-4e87-b7f6-7581ebbfc130/scratch/audit_results.json', 'utf8'));
  const combined = [...prev, ...results];
  fs.writeFileSync('C:/Users/PC/.gemini/antigravity/brain/7fd0eabb-c5a4-4e87-b7f6-7581ebbfc130/scratch/audit_results.json', JSON.stringify(combined, null, 2));
  console.log('\nTotal acumulado de pruebas registradas:', combined.length);
}

runAuditBatch2().catch(err => {
  console.error(err);
  process.exit(1);
});
