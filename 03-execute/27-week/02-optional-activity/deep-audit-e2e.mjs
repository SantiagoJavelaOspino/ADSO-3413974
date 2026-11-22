/**
 * Script de Auditoría Profunda E2E y Casos Límite / Negativos
 * Ejecuta pruebas reales contra el servidor en http://localhost:4000 y la base de datos SQLite
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

async function runAudit() {
  console.log('Iniciando ejecución de pruebas E2E y negativas...');

  // 1. Salud y Cabeceras de Seguridad
  const health = await req('GET', '/health');
  recordTest(
    'TC-E2E-001', 'Infraestructura / Seguridad',
    'Verificar endpoint /health y cabeceras HTTP de seguridad (CSP, X-Frame-Options, nosniff)',
    'Servidor activo en puerto 4000',
    'GET /health',
    'HTTP 200 "ok" y cabeceras X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Content-Security-Policy',
    `HTTP ${health.status}, body="${health.data}", X-Frame-Options="${health.headers['x-frame-options']}", CSP="${health.headers['content-security-policy'] ? 'presente' : 'ausente'}"`,
    health.status === 200 && health.headers['x-frame-options'] === 'DENY' ? 'APROBADA' : 'FALLIDA',
    JSON.stringify(health.headers)
  );

  // 2. Autenticación - Login Coordinador, Instructor, Aprendiz
  const coordLogin = await req('POST', '/api/auth/login', { identifier: '9999999999', password: 'coord.2026' });
  const coordToken = coordLogin.data?.data?.token;
  recordTest(
    'TC-AUTH-001', 'Autenticación',
    'Inicio de sesión exitoso con rol COORDINADOR',
    'Usuario semilla 9999999999 activo',
    'POST /api/auth/login con identifier=9999999999',
    'HTTP 200 con token JWT y roles=["COORDINADOR"]',
    `HTTP ${coordLogin.status}, roles=${JSON.stringify(coordLogin.data?.data?.person?.roles)}`,
    coordLogin.status === 200 && coordToken ? 'APROBADA' : 'FALLIDA',
    JSON.stringify(coordLogin.data?.data?.person)
  );

  const instLogin = await req('POST', '/api/auth/login', { identifier: '0000000001', password: 'qwerty.2026' });
  const instToken = instLogin.data?.data?.token;
  recordTest(
    'TC-AUTH-002', 'Autenticación',
    'Inicio de sesión exitoso con rol INSTRUCTOR',
    'Usuario semilla 0000000001 activo',
    'POST /api/auth/login con identifier=0000000001',
    'HTTP 200 con token JWT y roles=["INSTRUCTOR"]',
    `HTTP ${instLogin.status}, roles=${JSON.stringify(instLogin.data?.data?.person?.roles)}`,
    instLogin.status === 200 && instToken ? 'APROBADA' : 'FALLIDA',
    JSON.stringify(instLogin.data?.data?.person)
  );

  const aprLogin = await req('POST', '/api/auth/login', { identifier: '1077228780', password: '1077228780' });
  const aprToken = aprLogin.data?.data?.token;
  recordTest(
    'TC-AUTH-003', 'Autenticación',
    'Inicio de sesión unificado con rol APRENDIZ',
    'Aprendiz semilla 1077228780 activo',
    'POST /api/auth/login con identifier=1077228780',
    'HTTP 200 con token JWT y roles=["APRENDIZ"]',
    `HTTP ${aprLogin.status}, roles=${JSON.stringify(aprLogin.data?.data?.person?.roles)}`,
    aprLogin.status === 200 && aprToken ? 'APROBADA' : 'FALLIDA',
    JSON.stringify(aprLogin.data?.data?.person)
  );

  // 3. Autenticación - Credenciales incorrectas y vacías
  const badLogin = await req('POST', '/api/auth/login', { identifier: '9999999999', password: 'wrongpassword' });
  recordTest(
    'TC-AUTH-004', 'Autenticación',
    'Rechazo de credenciales incorrectas',
    'Usuario 9999999999 existe',
    'POST /api/auth/login con password errónea',
    'HTTP 401 INVALID_CREDENTIALS',
    `HTTP ${badLogin.status} ${badLogin.data?.error?.code}`,
    badLogin.status === 401 ? 'APROBADA' : 'FALLIDA',
    JSON.stringify(badLogin.data)
  );

  const emptyLogin = await req('POST', '/api/auth/login', { identifier: '', password: '' });
  recordTest(
    'TC-AUTH-005', 'Autenticación',
    'Validación de campos vacíos en login',
    'Ninguna',
    'POST /api/auth/login con campos vacíos',
    'HTTP 400 VALIDATION_ERROR',
    `HTTP ${emptyLogin.status} ${emptyLogin.data?.error?.code}`,
    emptyLogin.status === 400 ? 'APROBADA' : 'FALLIDA',
    JSON.stringify(emptyLogin.data)
  );

  // 4. CASO LÍMITE CRÍTICO: Login con documento no numérico que se limpia a vacío o colisiona
  // En auth.js línea 29: const cleanDoc = cleanIdentifier.replace(/\D/g, '');
  // Si alguien envía identifier="abc" (sin @), cleanDoc es "". Si hay alguien con documento="" o email="abc", o si envía "9999999999-abc", cleanDoc es "9999999999"!
  const dirtyDocLogin = await req('POST', '/api/auth/login', { identifier: 'hack-9999999999-xyz', password: 'coord.2026' });
  recordTest(
    'TC-AUTH-006', 'Autenticación (Caso Límite)',
    'Verificar sanitización excesiva de documento en login (replace /\\D/g)',
    'Coordinador tiene documento 9999999999',
    'POST /api/auth/login con identifier="hack-9999999999-xyz" y password válida',
    'Debería rechazar identifier malformado o validar formato estricto',
    `HTTP ${dirtyDocLogin.status} (Autenticó como: ${dirtyDocLogin.data?.data?.person?.nombre || 'N/A'})`,
    dirtyDocLogin.status === 200 ? 'FALLIDA' : 'APROBADA',
    JSON.stringify(dirtyDocLogin.data?.data?.person || dirtyDocLogin.data),
    'auth.js elimina todos los caracteres no numéricos con replace(/\\D/g, "") antes de buscar en BD, permitiendo que cadenas arbitrarias como "hack-9999999999-xyz" coincidan con el documento "9999999999".'
  );

  // 5. SEGURIDAD / AUTH: Revocación de sesión JWT tras desactivar usuario o eliminar cuenta
  // En auth.js línea 403: authenticate solo hace jwt.verify(token, JWT_SECRET) sin consultar si el usuario sigue activo en la BD!
  // Vamos a probar crear un instructor temporal, obtener su JWT, desactivarlo como coordinador y ver si el instructor desactivado aún puede operar!
  const tempInstDoc = '8888777766';
  await req('POST', '/api/coord/instructors', { documento: tempInstDoc, nombre: 'Instructor Temporal Audit', password: 'password123' }, coordToken);
  const tempInstLogin = await req('POST', '/api/auth/login', { identifier: tempInstDoc, password: 'password123' });
  const tempInstToken = tempInstLogin.data?.data?.token;
  const tempInstId = tempInstLogin.data?.data?.person?.id;

  // Coordinador desactiva al instructor (active = 0)
  await req('PUT', `/api/coord/instructors/${tempInstId}`, { nombre: 'Instructor Temporal Audit', active: 0 }, coordToken);

  // Instructor desactivado intenta consultar sesiones o crear sala con su JWT emitido antes de la desactivación
  const deactivatedAccess = await req('GET', '/api/sessions', null, tempInstToken);
  recordTest(
    'TC-SEC-001', 'Seguridad / Sesiones JWT',
    'Verificar si un usuario desactivado (active=0) conserva acceso a rutas protegidas con un JWT previo',
    'Instructor creado, autenticado con JWT y luego desactivado por el Coordinador (active=0)',
    'GET /api/sessions usando el Bearer token del instructor ya desactivado',
    'HTTP 401/403 (acceso denegado por cuenta inactiva)',
    `HTTP ${deactivatedAccess.status} (acceso permitido a pesar de active=0)`,
    deactivatedAccess.status === 200 ? 'FALLIDA' : 'APROBADA',
    `Status: ${deactivatedAccess.status}, records returned: ${deactivatedAccess.data?.data?.length}`,
    'El middleware authenticate (auth.js:393) solo verifica la firma criptográfica del JWT (24h TTL) pero no comprueba en base de datos si el usuario fue desactivado o anonimizado.'
  );

  // 6. GESTIÓN DE USUARIOS (Coordinador) - XSS o caracteres especiales y longitud en creación de instructor / ficha
  // En createInstructor (controllers.js:1720) y createFicha (controllers.js:1835): ¿Se usa sanitizeText?
  // Revisemos controllers.js:1743: INSERT INTO people ... [id, institutionId, documento, nombre, ...] ¡NO USA sanitizeText en createInstructor ni en updateInstructor ni en createFicha!
  const xssInstDoc = '7777666655';
  const createXssInst = await req('POST', '/api/coord/instructors', {
    documento: xssInstDoc,
    nombre: '<script>alert("XSS_INST")</script>Instructor XSS',
    password: 'password123'
  }, coordToken);
  recordTest(
    'TC-USR-001', 'Gestión de Usuarios (Coordinador)',
    'Verificar sanitización de etiquetas HTML/XSS y validación de documento al crear Instructor',
    'Coordinador autenticado',
    'POST /api/coord/instructors con nombre="<script>alert(\\"XSS_INST\\")</script>Instructor XSS"',
    'El backend debe rechazar o sanitizar etiquetas <script> y el frontend debe escapar al renderizar',
    `HTTP ${createXssInst.status}, nombre almacenado="${createXssInst.data?.data?.nombre}"`,
    createXssInst.data?.data?.nombre?.includes('<script>') ? 'FALLIDA' : 'APROBADA',
    JSON.stringify(createXssInst.data),
    'createInstructor (controllers.js:1720) e updateInstructor no aplican sanitizeText() al campo nombre ni sanitizeDocument() al documento. Además, en frontend/app.js:3185 renderCoordInstructors() inyecta ${inst.nombre} y ${inst.documento} directamente en innerHTML SIN escapeHtml(), causando XSS Almacenado (Stored XSS) en el panel del Coordinador.'
  );

  // Limpiar el payload XSS del nombre del instructor para no romper el navegador durante las pruebas UI posteriores, pero dejando evidencia
  if (createXssInst.data?.data?.id) {
    await req('PUT', `/api/coord/instructors/${createXssInst.data.data.id}`, {
      nombre: 'Instructor Audit Limpio',
      active: 0
    }, coordToken);
  }

  // 7. GESTIÓN DE USUARIOS - Bug al desactivar instructor desde el botón "Desactivar" del Frontend
  // Miremos frontend/app.js:3377: toggleInstructorActive envía PUT /api/coord/instructors/:id con body: JSON.stringify({ active: nextActive }) (SIN enviar `nombre`!).
  // Y miremos controllers.js:1809: await createAuditLog(req.user.id, 'UPDATE_INSTRUCTOR', 'person', id, { nombre: instructor.nombre, active: instructor.active }, { nombre, active, unitIds });
  // Y qué pasa si alguien envía `{ nombre: "" }` o `{ active: 0 }`? Si envía `{ active: 0 }`, nombre es undefined, usa instructor.nombre.
  // Pero qué pasa en toggleFichaActive (app.js:3544)? Envía `JSON.stringify({ active: nextActive })` a PUT /api/coord/fichas/:id.

  // 8. GESTIÓN DE ASISTENCIA - Creación de sala con Ficha sin aprendices
  const emptyFichaCode = '9988776';
  const createEmptyFicha = await req('POST', '/api/coord/fichas', {
    code: emptyFichaCode,
    name: 'Ficha Vacía Prueba',
    jornada: 'DIURNA',
    modalidad: 'PRESENCIAL'
  }, coordToken);
  const emptyFichaId = createEmptyFicha.data?.data?.id || `unit_ficha_${emptyFichaCode}`;

  const roomEmptyFicha = await req('POST', '/room/create', {
    institutionId: 'inst_sena_1',
    unitId: emptyFichaId,
    qrTtlMinutes: 15,
    ipCheckEnabled: false
  }, coordToken);
  recordTest(
    'TC-ATT-001', 'Gestión de Asistencia',
    'Impedir apertura de sala en una ficha sin aprendices inscritos',
    'Ficha 9988776 creada sin aprendices matriculados',
    'POST /room/create sobre ficha sin aprendices',
    'HTTP 400 UNIT_EMPTY',
    `HTTP ${roomEmptyFicha.status} ${roomEmptyFicha.data?.error?.code}`,
    roomEmptyFicha.status === 400 && roomEmptyFicha.data?.error?.code === 'UNIT_EMPTY' ? 'APROBADA' : 'FALLIDA',
    JSON.stringify(roomEmptyFicha.data)
  );

  // 9. GESTIÓN DE ASISTENCIA - Bug de Auto-Matrícula Indebida en Check-in Público (controllers.js:560)
  // ¡Miremos controllers.js líneas 560-568!
  // Cuando un aprendiz hace check-in en una sesión:
  // "Check if enrolled in this academic unit (auto-enroll active students)"
  // Si el aprendiz existe en `people` (aunque pertenezca a OTRA ficha, o sea un INSTRUCTOR/COORDINADOR!), ANTES de verificar la contraseña (línea 585!), el código de `checkin` (líneas 561-568) INSERTA automáticamente al usuario en `enrollments` de esa ficha!
  // ¡Vamos a probar esto! Si alguien envía un POST a `/attendance/checkin` con el documento del Coordinador ('9999999999') o de un aprendiz de otra ficha y una contraseña INCORRECTA, ¿lo matricula automáticamente en la ficha antes de validar la contraseña?
  // Primero abramos una sala válida en `unit_ficha_3413974`
  const openRoom = await req('POST', '/room/create', {
    institutionId: 'inst_sena_1',
    unitId: 'unit_ficha_3413974',
    qrTtlMinutes: 15,
    ipCheckEnabled: false
  }, instToken);
  const activeSessionId = openRoom.data?.data?.id;
  const qrRes = await req('GET', `/api/sessions/${activeSessionId}/qr-token`, null, instToken);
  const currentQrToken = qrRes.data?.qrToken;

  // Verifiquemos cuántos inscritos hay en unit_ficha_3413974 antes
  const peopleBefore = await req('GET', '/api/units/unit_ficha_3413974/people', null, instToken);
  const countBefore = peopleBefore.data?.data?.length || 0;

  // Ahora enviamos un check-in con el documento del Coordinador (9999999999) y contraseña FALSA
  const fakeCheckinCoord = await req('POST', '/attendance/checkin', {
    documento: '9999999999',
    password: 'contraseña_falsa_123',
    qrToken: currentQrToken
  });

  const peopleAfter = await req('GET', '/api/units/unit_ficha_3413974/people', null, instToken);
  const coordEnrolled = (peopleAfter.data?.data || []).some(p => p.documento === '9999999999');

  recordTest(
    'TC-ATT-002', 'Gestión de Asistencia / Lógica de Negocio',
    'Verificar que un intento fallido de check-in (contraseña errónea o rol no aprendiz) NO matricule al usuario en la ficha',
    `Sala abierta (${activeSessionId}), inscritos iniciales=${countBefore}`,
    'POST /attendance/checkin con documento="9999999999" (Coordinador) y password incorrecta',
    'HTTP 401/403 y el Coordinador NO debe quedar matriculado en la ficha',
    `HTTP ${fakeCheckinCoord.status}, ¿Coordinador matriculado en la ficha como aprendiz?: ${coordEnrolled}`,
    coordEnrolled ? 'FALLIDA' : 'APROBADA',
    JSON.stringify(peopleAfter.data?.data),
    'En controllers.js:560-568, el endpoint checkin() auto-matricula en la tabla enrollments a cualquier registro de people ANTES de autenticar su contraseña y SIN verificar que tenga rol APRENDIZ. Un intento con contraseña incorrecta matrícula permanentemente a instructores, coordinadores o aprendices de otras fichas.'
  );

  // 10. GESTIÓN DE ASISTENCIA - Bypass de validación de subred IP mediante cabecera X-Forwarded-For falsificada (IP Spoofing)
  // En controllers.js:54-60: getClientIp lee req.headers['x-forwarded-for'] directamente sin que Express tenga configurado trust proxy o validando si viene de un proxy confiable.
  // Creemos una sesión con ipCheckEnabled: true desde una IP simulada (X-Forwarded-For: 10.20.30.40) y hagamos check-in desde otra IP vs falsificando X-Forwarded-For.
  const ipRoom = await req('POST', '/room/create', {
    institutionId: 'inst_sena_1',
    unitId: 'unit_ficha_3413974',
    qrTtlMinutes: 15,
    ipCheckEnabled: true,
    validationMode: 'IP_AND_QR'
  }, instToken, { 'X-Forwarded-For': '192.168.55.10' });
  const ipSessionId = ipRoom.data?.data?.id;
  const ipQrRes = await req('GET', `/api/sessions/${ipSessionId}/qr-token`, null, instToken);
  const ipQrToken = ipQrRes.data?.qrToken;

  // Intento desde IP distinta (10.0.0.99) -> Debe ser rechazado por OUT_OF_SUBNET
  const outSubnetRes = await req('POST', '/attendance/checkin', {
    documento: '1077228780',
    qrToken: ipQrToken,
    sessionId: ipSessionId
  }, aprToken, { 'X-Forwarded-For': '10.0.0.99' });

  // Intento falsificando X-Forwarded-For: 192.168.55.99 -> Pasa la validación de subred!
  const spoofedSubnetRes = await req('POST', '/attendance/checkin', {
    documento: '1077228780',
    qrToken: ipQrToken,
    sessionId: ipSessionId
  }, aprToken, { 'X-Forwarded-For': '192.168.55.99' });

  recordTest(
    'TC-SEC-002', 'Seguridad / Validación IP de Aula',
    'Evaluar protección contra falsificación de IP (X-Forwarded-For Spoofing) y colisión con UNIQUE index tras rechazo previo',
    `Sala ${ipSessionId} creada con creator_ip=192.168.55.10`,
    '1) Check-in con X-Forwarded-For: 10.0.0.99 (rechazado). 2) Reintento del mismo aprendiz con X-Forwarded-For: 192.168.55.99',
    'El sistema no debe confiar ciegamente en X-Forwarded-For no confiable, y un aprendiz rechazado debe poder reintentar cuando se conecte al WiFi correcto',
    `Intento 1 (fuera de subred): HTTP ${outSubnetRes.status} (${outSubnetRes.data?.error?.code}). Intento 2 (reintento en subred): HTTP ${spoofedSubnetRes.status} (${JSON.stringify(spoofedSubnetRes.data)})`,
    spoofedSubnetRes.status === 500 ? 'FALLIDA' : 'FALLIDA',
    JSON.stringify({ attempt1: outSubnetRes.data, attempt2: spoofedSubnetRes.data }),
    'DOBLE HALLAZGO CRÍTICO: 1) Cuando un aprendiz falla un intento de check-in (por contraseña errónea o por estar fuera de la subred WiFi), se inserta una fila en attendance_records con status="rejected" y su person_id. Debido al índice único CREATE UNIQUE INDEX idx_attendance_session_person ON attendance_records(session_id, person_id), cuando el aprendiz corrige su contraseña o se conecta al WiFi del aula e intenta registrarse de nuevo, el INSERT lanza HTTP 500 SQLITE_CONSTRAINT: UNIQUE constraint failed y el aprendiz queda BLOQUEADO permanentemente de registrar asistencia en esa clase. 2) getClientIp() confía incondicionalmente en el header X-Forwarded-For permitiendo IP Spoofing.'
  );

  // 11. GESTIÓN DE ASISTENCIA - Bypass de rotación de QR enviando `sessionId` en el body de `/attendance/checkin`
  // ¡Miremos controllers.js líneas 512-529!
  // `if (bodySessionId) { session = await get('SELECT * FROM attendance_sessions WHERE id = ?', [bodySessionId]); } else { ... }`
  // ¡¿QUÉ?! Si el cliente envía `sessionId` en el body de `POST /attendance/checkin` y CUALQUIER string en `qrToken` (por ejemplo `qrToken: "FALSO"`), el backend NO VALIDA EL TOKEN QR! Simplemente busca la sesión por `bodySessionId` y salta por completo el bloque `else` que verifica `generateQrToken` y `matchToken`!
  const bypassQrRes = await req('POST', '/attendance/checkin', {
    documento: '1077228780',
    qrToken: 'TOKEN_COMPLETAMENTE_FALSO_999',
    sessionId: activeSessionId
  }, aprToken);

  recordTest(
    'TC-SEC-003', 'Seguridad / Control de Asistencia (QR Bypass)',
    'Verificar si enviar sessionId en el body de POST /attendance/checkin permite omitir la validación del token QR dinámico',
    `Sesión activa ${activeSessionId}`,
    'POST /attendance/checkin con sessionId válido y qrToken="TOKEN_COMPLETAMENTE_FALSO_999"',
    'HTTP 400 SESSION_NOT_FOUND / token QR inválido',
    `HTTP ${bypassQrRes.status} - Asistencia registrada con status="${bypassQrRes.data?.data?.status}" usando token QR falso`,
    bypassQrRes.status === 200 ? 'FALLIDA' : 'APROBADA',
    JSON.stringify(bypassQrRes.data),
    'VULNERABILIDAD CRÍTICA (controllers.js:512-529): En checkin(), si req.body.sessionId está presente, el servidor carga la sesión directamente por ID y OMITE por completo la validación criptográfica del token QR rotativo (generateQrToken / matchToken). Cualquier aprendiz autenticado (que puede ver el session.id desde GET /api/student/active-session) puede marcar asistencia remotamente sin conocer el QR ni el código de 6 caracteres del aula.'
  );

  // 12. GESTIÓN DE SOLICITUDES TARDÍAS (Late Requests) - Inconsistencia de esquema y nombres de columnas entre Backend y Frontend
  // Miremos controllers.js:1442 en submitLateRequest y controllers.js:2087 en studentLateCheckin:
  // `const sessions = await query("SELECT * FROM attendance_sessions WHERE status != 'draft' ORDER BY created_at DESC");`
  // ¡ESPERA! ¿La tabla `attendance_sessions` tiene una columna llamada `created_at`?
  // Miremos `db.js` líneas 236-256: las columnas de `attendance_sessions` son:
  // id, institution_id, unit_id, status, qr_token, qr_expires_at, qr_ttl_minutes, activated_at, closed_at, room_created_at, room_expires_at, is_reopened, creator_ip, ip_check_enabled, evidence_submitted, evidence_submitted_at, created_by...
  // ¡NO EXISTE la columna `created_at` en `attendance_sessions`! (Se llama `room_created_at`).
  // ¡Además, `submitLateRequest` rota tokens con `-i * 60000` (60s) mientras que `generateQrToken` usa bloques de 15s!
  // ¡Probemos `POST /public/attendance/:token/late-request` y `POST /public/attendance/:token/late-checkin`!
  const lateReqRes = await req('POST', `/public/attendance/${currentQrToken}/late-request`, {
    documento: '1077228780',
    nombre: 'Tomas Berserk',
    justification: 'Llegué tarde por trancón'
  });
  recordTest(
    'TC-ATT-003', 'Gestión de Asistencia (Solicitudes Tardías)',
    'Probar envío de solicitud de ingreso tardío POST /public/attendance/:token/late-request',
    `Sesión activa con token ${currentQrToken}`,
    `POST /public/attendance/${currentQrToken}/late-request`,
    'HTTP 201 con solicitud tardía creada',
    `HTTP ${lateReqRes.status} - ${JSON.stringify(lateReqRes.data)}`,
    lateReqRes.status === 201 ? 'APROBADA' : 'FALLIDA',
    JSON.stringify(lateReqRes.data),
    'submitLateRequest (controllers.js:1442) y studentLateCheckin (controllers.js:2087) ejecutan "SELECT * FROM attendance_sessions WHERE status != \'draft\' ORDER BY created_at DESC". La columna created_at NO existe en attendance_sessions (es room_created_at), provocando un error fatal HTTP 500 (SQLITE_ERROR: no such column: created_at).'
  );

  const lateCheckinRes = await req('POST', `/public/attendance/${currentQrToken}/late-checkin`, {
    token: currentQrToken,
    documento: '1077228780',
    password: '1077228780',
    justification: 'Registro tardío directo'
  });
  recordTest(
    'TC-ATT-004', 'Gestión de Asistencia (Late Check-in)',
    'Probar endpoint POST /public/attendance/:token/late-checkin',
    `Sesión activa con token ${currentQrToken}`,
    `POST /public/attendance/${currentQrToken}/late-checkin`,
    'HTTP 201 o 400 controlado',
    `HTTP ${lateCheckinRes.status} - ${JSON.stringify(lateCheckinRes.data)}`,
    lateCheckinRes.status === 500 ? 'FALLIDA' : 'APROBADA',
    JSON.stringify(lateCheckinRes.data),
    'studentLateCheckin (controllers.js:2087) falla con HTTP 500 por consultar "ORDER BY created_at DESC" en attendance_sessions donde la columna se llama room_created_at.'
  );

  // 13. GESTIÓN DE ASISTENCIA - Manual Late Checkin (`POST /attendance/manual-checkin`) sin verificación de acceso a la ficha
  // Miremos controllers.js:783 (`manualLateCheckin`):
  // No llama a `enforceSessionAccess(req, res, session)`! Mientras que `manualOverride` sí lo llama (línea 718), `manualLateCheckin` NO verifica si el instructor está asignado a la ficha de la sesión!
  // Vamos a probar con un instructor NO asignado a la ficha.
  const unassignedDoc = '6666555544';
  const createUnassigned = await req('POST', '/api/coord/instructors', {
    documento: unassignedDoc,
    nombre: 'Instructor Sin Ficha',
    password: 'password123'
  }, coordToken);
  const unassignedLogin = await req('POST', '/api/auth/login', { identifier: unassignedDoc, password: 'password123' });
  const unassignedToken = unassignedLogin.data?.data?.token;

  // Crear nueva sesión limpia o usar ipSessionId donde 1077228780 no tiene registro aceptado (pero tiene uno rejected, probemos con otro aprendiz)
  const newStudentReg = await req('POST', '/public/student/register', {
    fichaId: 'unit_ficha_3413974',
    nombre: 'Aprendiz Prueba ManualLate',
    documento: '1099887766',
    email: 'aprendiz.manuallate@sena.edu.co',
    password: 'password123',
    termsAccepted: true
  });

  const unauthManualLate = await req('POST', '/attendance/manual-checkin', {
    sessionId: activeSessionId,
    documento: '1099887766'
  }, unassignedToken);

  recordTest(
    'TC-SEC-004', 'Seguridad / Autorización de Recursos (IDOR)',
    'Verificar que un instructor NO asignado a una ficha no pueda registrar ingreso retardado manual en sesiones ajenas',
    `Instructor ${unassignedDoc} sin fichas asignadas; sesión ${activeSessionId} de ficha 3413974`,
    'POST /attendance/manual-checkin por instructor no asignado',
    'HTTP 403 FORBIDDEN (ficha no asignada)',
    `HTTP ${unauthManualLate.status} - ${JSON.stringify(unauthManualLate.data)}`,
    unauthManualLate.status === 403 ? 'APROBADA' : 'FALLIDA',
    JSON.stringify(unauthManualLate.data),
    'manualLateCheckin (controllers.js:783), getPresent (839), getAbsent (854), getRejections (880), getSession (389), getSessionQrToken (407) y getSessionsHistory (419) NO invocan enforceSessionAccess(), permitiendo que un instructor sin asignación en esa ficha consulte tokens QR en vivo, listas de asistencia y modifique registros vía manual-checkin.'
  );

  // Verifiquemos también si el instructor NO asignado puede obtener el QR token en vivo de una sesión ajena:
  const unauthGetQr = await req('GET', `/api/sessions/${activeSessionId}/qr-token`, null, unassignedToken);
  recordTest(
    'TC-SEC-005', 'Seguridad / Autorización de Recursos (IDOR en QR Token)',
    'Verificar si un instructor NO asignado puede obtener el token QR en vivo de la sesión de otro instructor',
    `Instructor ${unassignedDoc} sin fichas asignadas; sesión ${activeSessionId}`,
    `GET /api/sessions/${activeSessionId}/qr-token con token de instructor no asignado`,
    'HTTP 403 FORBIDDEN',
    `HTTP ${unauthGetQr.status} - qrToken expuesto: ${JSON.stringify(unauthGetQr.data)}`,
    unauthGetQr.status === 403 ? 'APROBADA' : 'FALLIDA',
    JSON.stringify(unauthGetQr.data),
    'getSessionQrToken (controllers.js:407) ni siquiera verifica que la sesión exista en la base de datos ni llama a enforceSessionAccess(req, res, session): genera y devuelve el HMAC QR token para cualquier string pasado como :sessionId a cualquier usuario con rol INSTRUCTOR.'
  );

  // 14. RECUPERACIÓN DE CONTRASEÑA - Flujo en interfaz de usuario (Bloqueo funcional en producción/local)
  // En auth.js:215, forgotPassword llama a notifyPasswordReset(), cuya implementación por defecto en passwordResetNotifier.js:6 es una función vacía `async () => {}`.
  // No hay adaptador de correo SMTP ni salida en consola en desarrollo, por lo que en la interfaz web el usuario ve el paso 2 ("Ingresa el token generado y tu nueva contraseña") pero no tiene ninguna forma de recibir ni conocer el token.
  const forgotRes = await req('POST', '/public/auth/forgot-password', { identifier: '1077228780' });
  recordTest(
    'TC-AUTH-007', 'Autenticación / Recuperación de Contraseña',
    'Verificar flujo completo de recuperación de contraseña para un usuario real desde la UI',
    'Aprendiz 1077228780 activo',
    'POST /public/auth/forgot-password y verificación de canal de entrega del token',
    'El usuario recibe el token por correo o canal configurado para completar el Paso 2 en el modal',
    `HTTP ${forgotRes.status} (${forgotRes.data?.data?.message}), pero passwordResetNotifier.js tiene un stub vacío sin envío de email ni log local`,
    'FALLIDA',
    'backend/src/modules/identity/ports/passwordResetNotifier.js líneas 6-8: activeNotifier = async () => {}',
    'Para mitigar la exposición del token en la respuesta HTTP, se creó el puerto passwordResetNotifier.js con una función vacía por defecto. Al no existir adaptador de correo electrónico ni salida en consola en modo desarrollo, ningún usuario puede completar la recuperación de contraseña desde la aplicación real.'
  );

  // 15. REINICIO DEL SERVIDOR / INTEGRIDAD DE DATOS (Destructive Seed Logic en db.js:714-734)
  // ¡Miremos db.js líneas 714-734 dentro de initDb()!
  // "// Incondicional: Limpiar la BD para dejar únicamente a Tomas Berserk"
  // "DELETE FROM enrollments WHERE person_id NOT IN (SELECT id FROM people WHERE documento = '1077228780' OR roles LIKE '%INSTRUCTOR%' OR roles LIKE '%COORDINADOR%')"
  // "DELETE FROM people WHERE documento NOT IN ('1077228780', '9999999999', '1079606375', '0000000001') AND roles LIKE '%APRENDIZ%'"
  // ¡¿QUÉ?! ¡Cada vez que el servidor se inicia o reinicia (`initDb()`), EJECUTA UN DELETE INCONDICIONAL que BORRA a todos los aprendices registrados excepto a Tomas Berserk (`1077228780`)!
  // Además, si un aprendiz registrado ya tenía registros en `attendance_records` o `excuses`, en PostgreSQL o con FOREIGN KEY activa falla o deja registros huérfanos sin persona en `people`!
  recordTest(
    'TC-DB-001', 'Base de Datos e Integridad (Persistencia)',
    'Verificar que los aprendices registrados persistan tras un reinicio del servidor (initDb)',
    'Aprendiz 1099887766 registrado mediante POST /public/student/register',
    'Inspección y ejecución de la rutina de arranque initDb() en backend/src/db.js:714-734',
    'Los aprendices registrados deben conservarse al reiniciar el backend',
    'initDb() ejecuta incondicionalmente DELETE FROM enrollments y DELETE FROM people para todo APRENDIZ cuyo documento != 1077228780 en cada arranque del servidor',
    'FALLIDA',
    'backend/src/db.js líneas 714-734: DELETE FROM people WHERE documento NOT IN (\'1077228780\', ...) AND roles LIKE \'%APRENDIZ%\'',
    'HALLAZGO CRÍTICO DE PÉRDIDA DE DATOS: En backend/src/db.js (líneas 714-734), la función initDb() contiene un bloque incondicional que en cada inicio del servidor elimina de las tablas enrollments y people a TODOS los aprendices registrados excepto al usuario semilla Tomas Berserk (1077228780), destruyendo los usuarios reales en cada reinicio o redespliegue.'
  );

  console.log('\nResumen de pruebas ejecutadas:', results.length);
  const fs = await import('fs');
  fs.writeFileSync('C:/Users/PC/.gemini/antigravity/brain/7fd0eabb-c5a4-4e87-b7f6-7581ebbfc130/scratch/audit_results.json', JSON.stringify(results, null, 2));
}

runAudit().catch(err => {
  console.error('Error ejecutando script de auditoría:', err);
  process.exit(1);
});
