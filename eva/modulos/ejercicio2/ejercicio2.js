// ===============================
// ejercicio2.js
// Sistema de Validación y Procesamiento de Solicitudes de Acceso
// ===============================

// Arreglo original de solicitudes (NO se modifica → inmutabilidad)
const solicitudes = [ // Aquí definimos el arreglo base con todas las solicitudes que vamos a procesar
  { id: 1, nombre: "Ana", rol: "admin", nivelAccesoSolicitado: 5, activo: true, intentosPrevios: 1 }, // Solicitud válida con rol admin y nivel alto
  { id: 2, nombre: "Luis", rol: "invitado", nivelAccesoSolicitado: 3, activo: true, intentosPrevios: 0 }, // Solicitud con rol invitado que pide más nivel del permitido
  { id: 3, nombre: "Marta", rol: "empleado", nivelAccesoSolicitado: 2, activo: false, intentosPrevios: 2 }, // Usuario inactivo, lo cual generará error en la lógica
  { id: 4, nombre: 123, rol: "admin", nivelAccesoSolicitado: 4, activo: true, intentosPrevios: 0 } // solicitud con error en el tipo de nombre
];

// ===============================
// VALIDACIÓN DE TIPOS Y RANGOS
// ===============================
// Esta función revisa que los datos tengan sentido antes de procesarlos.
// Si algo está raro, lanzamos error de una vez.
function validarDatos(s) { // Función que valida los tipos y rangos de cada campo de la solicitud
  if (typeof s.id !== "number" || s.id <= 0) throw new Error("ID inválido (se esperaba number > 0)"); // Validamos que el ID sea un número positivo
  if (typeof s.nombre !== "string" || s.nombre.trim() === "") throw new Error("Nombre inválido (se esperaba string)"); // Validamos que el nombre sea texto y no esté vacío
  if (typeof s.rol !== "string" || s.rol.trim() === "") throw new Error("Rol inválido (se esperaba string)"); // Validamos que el rol sea un string válido
  if (typeof s.nivelAccesoSolicitado !== "number" || s.nivelAccesoSolicitado < 1 || s.nivelAccesoSolicitado > 5)
    throw new Error("Nivel de acceso fuera de rango (1 a 5)"); // Validamos que el nivel solicitado esté entre 1 y 5
  if (typeof s.activo !== "boolean") throw new Error("Campo 'activo' inválido (se esperaba boolean)"); // Validamos que activo sea true o false
  if (typeof s.intentosPrevios !== "number" || s.intentosPrevios < 0)
    throw new Error("Intentos previos inválidos (se esperaba number >= 0)"); // Validamos que los intentos previos sean un número no negativo
}

// ===============================
// VALIDACIÓN DE LÓGICA DE NEGOCIO
// ===============================
// Aquí revisamos reglas internas de la empresa.
// Nada fancy, pero sí importante.
function validarLogica(s) { // Función que valida reglas internas más allá de los tipos
  if (!s.activo) throw new Error("Usuario inactivo"); // Si el usuario está inactivo, no puede solicitar acceso
  if (s.intentosPrevios > 3) throw new Error("Demasiados intentos previos"); // Si ya intentó muchas veces, se bloquea
  if (s.rol === "invitado" && s.nivelAccesoSolicitado > 1)
    throw new Error("Rol invitado no puede solicitar niveles altos"); // Los invitados solo pueden pedir nivel 1
}

// ===============================
// VALIDACIÓN ASINCRÓNICA (CALLBACK)
// ===============================
// Simula un sistema externo que valida el rol.
// El callback es la versión “vieja escuela”.
function validarRolCallback(rol, callback) { // Función que usa callback para simular validación externa
  setTimeout(() => { // Simulamos un retraso como si fuera un sistema externo
    if (rol === "admin" || rol === "empleado") callback(null, true); // Si el rol es válido, devolvemos true sin error
    else callback(new Error("Rol no permitido por el sistema externo")); // Si no, devolvemos un error
  }, 300); // Tiempo de espera de 300 ms
}

// ===============================
// VALIDACIÓN ASINCRÓNICA (PROMESA)
// ===============================
// Aquí ya usamos promesas, más moderno y limpio.
function validarRolPromesa(rol) { // Función que retorna una promesa para validar el rol
  return new Promise((resolve, reject) => { // Creamos la promesa
    setTimeout(() => { // Simulamos el tiempo de respuesta
      if (rol === "admin") resolve("rol-validado"); // Solo el rol admin pasa esta validación
      else reject(new Error("Sistema externo rechazó el rol")); // Los demás roles son rechazados
    }, 400); // Tiempo de espera de 400 ms
  });
}

// ===============================
// VALIDACIÓN ASINCRÓNICA (ASYNC/AWAIT)
// ===============================
// La versión más cómoda: async/await.
// Simula otra validación externa.
async function validarRolAsync(rol) { // Función async que retorna una promesa
  return new Promise((resolve, reject) => { // Creamos la promesa
    setTimeout(() => { // Simulamos el tiempo de respuesta
      if (rol !== "invitado") resolve(true); // Todos los roles excepto invitado pasan esta validación
      else reject(new Error("Async/Await: rol no autorizado")); // Invitado es rechazado
    }, 500); // Tiempo de espera de 500 ms
  });
}

// ===============================
// FLUJO PRINCIPAL
// ===============================
// Aquí juntamos todo: validaciones, asincronía y manejo de errores.
// Procesa cada solicitud sin que una dañe a las demás.
export async function procesarSolicitudes() { // Función principal que coordina todo el proceso
  let aprobadas = 0; // Contador de solicitudes aprobadas
  let rechazadas = 0; // Contador de solicitudes rechazadas por reglas de negocio
  let errores = 0; // Contador de solicitudes rechazadas por errores de datos

  for (const original of solicitudes) { // Recorremos cada solicitud del arreglo
    const s = { ...original }; // copiamos para mantener inmutabilidad

    console.log(`\nProcesando solicitud ID: ${s.id}`); // Mostramos qué solicitud estamos procesando

    try {
      // Validaciones sincrónicas
      validarDatos(s); // Validamos tipos y rangos
      validarLogica(s); // Validamos reglas internas

      // Validación con callback (envuelta en promesa para usar await)
      await new Promise((resolve, reject) => { // Convertimos el callback en promesa para poder usar await
        validarRolCallback(s.rol, (err, ok) => { // Llamamos a la validación por callback
          if (err) reject(err); // Si hay error, rechazamos la promesa
          else resolve(ok); // Si todo bien, resolvemos la promesa
        });
      });

      // Validación con promesa
      await validarRolPromesa(s.rol); // Esperamos la validación basada en promesa

      // Validación con async/await
      await validarRolAsync(s.rol); // Esperamos la validación basada en async/await

      console.log("Resultado: APROBADA"); // Si llegó hasta aquí, la solicitud fue aprobada
      aprobadas++; // Sumamos una solicitud aprobada

    } catch (e) { // Si ocurre cualquier error en el proceso
      console.log("Resultado: RECHAZADA"); // Indicamos que fue rechazada
      console.log("Motivo:", e.message); // Mostramos el motivo del rechazo

      if (e.message.includes("inválido") || e.message.includes("rango"))
        errores++; // Si el error es por datos incorrectos, sumamos a errores
      else
        rechazadas++; // Si es por reglas de negocio o validaciones externas, sumamos a rechazadas
    }
  }

  // Resumen final
  console.log("\n===== RESUMEN GENERAL ====="); // Encabezado del resumen
  console.log("Total procesadas:", solicitudes.length); // Total de solicitudes procesadas
  console.log("Aprobadas:", aprobadas); // Total aprobadas
  console.log("Rechazadas:", rechazadas); // Total rechazadas por lógica
  console.log("Errores de datos:", errores); // Total rechazadas por errores de datos
}

