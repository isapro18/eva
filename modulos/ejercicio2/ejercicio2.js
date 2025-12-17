// ===============================
// ejercicio2.js
// Sistema de Validación y Procesamiento de Solicitudes de Acceso
// ===============================

// Arreglo original de solicitudes (NO se modifica → inmutabilidad)
const solicitudes = [
  { id: 1, nombre: "Ana", rol: "admin", nivelAccesoSolicitado: 5, activo: true, intentosPrevios: 1 },
  { id: 2, nombre: "Luis", rol: "invitado", nivelAccesoSolicitado: 3, activo: true, intentosPrevios: 0 },
  { id: 3, nombre: "Marta", rol: "empleado", nivelAccesoSolicitado: 2, activo: false, intentosPrevios: 2 },
  { id: 4, nombre: 123, rol: "admin", nivelAccesoSolicitado: 4, activo: true, intentosPrevios: 0 } // solicitud con error
];

// ===============================
// VALIDACIÓN DE TIPOS Y RANGOS
// ===============================
// Esta función revisa que los datos tengan sentido antes de procesarlos.
// Si algo está raro, lanzamos error de una vez.
function validarDatos(s) {
  if (typeof s.id !== "number" || s.id <= 0) throw new Error("ID inválido (se esperaba number > 0)");
  if (typeof s.nombre !== "string" || s.nombre.trim() === "") throw new Error("Nombre inválido (se esperaba string)");
  if (typeof s.rol !== "string" || s.rol.trim() === "") throw new Error("Rol inválido (se esperaba string)");
  if (typeof s.nivelAccesoSolicitado !== "number" || s.nivelAccesoSolicitado < 1 || s.nivelAccesoSolicitado > 5)
    throw new Error("Nivel de acceso fuera de rango (1 a 5)");
  if (typeof s.activo !== "boolean") throw new Error("Campo 'activo' inválido (se esperaba boolean)");
  if (typeof s.intentosPrevios !== "number" || s.intentosPrevios < 0)
    throw new Error("Intentos previos inválidos (se esperaba number >= 0)");
}

// ===============================
// VALIDACIÓN DE LÓGICA DE NEGOCIO
// ===============================
// Aquí revisamos reglas internas de la empresa.
// Nada fancy, pero sí importante.
function validarLogica(s) {
  if (!s.activo) throw new Error("Usuario inactivo");
  if (s.intentosPrevios > 3) throw new Error("Demasiados intentos previos");
  if (s.rol === "invitado" && s.nivelAccesoSolicitado > 1)
    throw new Error("Rol invitado no puede solicitar niveles altos");
}

// ===============================
// VALIDACIÓN ASINCRÓNICA (CALLBACK)
// ===============================
// Simula un sistema externo que valida el rol.
// El callback es la versión “vieja escuela”.
function validarRolCallback(rol, callback) {
  setTimeout(() => {
    if (rol === "admin" || rol === "empleado") callback(null, true);
    else callback(new Error("Rol no permitido por el sistema externo"));
  }, 300);
}

// ===============================
// VALIDACIÓN ASINCRÓNICA (PROMESA)
// ===============================
// Aquí ya usamos promesas, más moderno y limpio.
function validarRolPromesa(rol) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (rol === "admin") resolve("rol-validado");
      else reject(new Error("Sistema externo rechazó el rol"));
    }, 400);
  });
}

// ===============================
// VALIDACIÓN ASINCRÓNICA (ASYNC/AWAIT)
// ===============================
// La versión más cómoda: async/await.
// Simula otra validación externa.
async function validarRolAsync(rol) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (rol !== "invitado") resolve(true);
      else reject(new Error("Async/Await: rol no autorizado"));
    }, 500);
  });
}

// ===============================
// FLUJO PRINCIPAL
// ===============================
// Aquí juntamos todo: validaciones, asincronía y manejo de errores.
// Procesa cada solicitud sin que una dañe a las demás.
export async function procesarSolicitudes() {
  let aprobadas = 0;
  let rechazadas = 0;
  let errores = 0;

  for (const original of solicitudes) {
    const s = { ...original }; // copiamos para mantener inmutabilidad

    console.log(`\nProcesando solicitud ID: ${s.id}`);

    try {
      // Validaciones sincrónicas
      validarDatos(s);
      validarLogica(s);

      // Validación con callback (envuelta en promesa para usar await)
      await new Promise((resolve, reject) => {
        validarRolCallback(s.rol, (err, ok) => {
          if (err) reject(err);
          else resolve(ok);
        });
      });

      // Validación con promesa
      await validarRolPromesa(s.rol);

      // Validación con async/await
      await validarRolAsync(s.rol);

      console.log("Resultado: APROBADA");
      aprobadas++;

    } catch (e) {
      console.log("Resultado: RECHAZADA");
      console.log("Motivo:", e.message);

      if (e.message.includes("inválido") || e.message.includes("rango"))
        errores++;
      else
        rechazadas++;
    }
  }

  // Resumen final
  console.log("\n===== RESUMEN GENERAL =====");
  console.log("Total procesadas:", solicitudes.length);
  console.log("Aprobadas:", aprobadas);
  console.log("Rechazadas:", rechazadas);
  console.log("Errores de datos:", errores);
}
