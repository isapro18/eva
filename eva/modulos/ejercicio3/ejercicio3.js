//Sistema de Gestión Asíncrona de Solicitudes de Servicio
// Datos de entrada
const solicitudes = [ // Arreglo de solicitudes que vamos a procesar en el sistema
{ id: 1, usuario: "Ana", tipo: "software", prioridad: 3, descripcion: "Error en app", estado: "pendiente" }, // Primera solicitud, con datos válidos y prioridad media
{ id: 2, usuario: "Carlos", tipo: "hardware", prioridad: 5, descripcion: "Pantalla dañada", estado: "pendiente" }, // Segunda solicitud, prioridad alta por el valor 5
{ id: 3, usuario: "", tipo: "otro", prioridad: 10, descripcion: "", estado: "pendiente" } // solicitud con errores para probar las validaciones
];

// Validar las solicitudes
function validar(s) { // Función que valida que los datos básicos de la solicitud sean correctos
if (typeof s.id !== "number" || s.id <= 0) throw new error("ID inválido"); // Validamos que el ID sea un número mayor que 0
if (typeof s.usuario !== "string" || s.usuario.trim() === "") throw new error("Usuario inválido"); // Validamos que el usuario sea texto y no esté vacío
if (s.tipo !== "software" && s.tipo !== "hardware") throw new error("Tipo inválido"); // Solo aceptamos solicitudes de tipo software o hardware
if (typeof s.prioridad !== "number" || s.prioridad < 1 || s.prioridad > 5) throw new error("Prioridad fuera de rango"); // Validamos que la prioridad esté entre 1 y 5
}

// clasificación por prioridad
function clasificar(s) { // Función que clasifica la prioridad en alta, media o baja
if (s.prioridad >= 4) return "alta prioridad"; // Si la prioridad es 4 o 5, la marcamos como alta
if (s.prioridad >= 2) return "media prioridad"; // Si la prioridad es 2 o 3, la marcamos como media
return "baja prioridad"; // Si es menor a 2 (en este caso 1), la marcamos como baja
}

// Promesa: simula la atención
function atender(s) { // Función que simula el proceso de atención usando una promesa
return new Promise((resolve) => { // Creamos y devolvemos una nueva promesa
setTimeout(() => resolve("atendida"), 500); // Después de 500 ms resolvemos la promesa con el texto "atendida"
});
}

// hacemos una callback para el mensaje de inicio
function iniciarAtencion(s, callback) { // Función que usa un callback para mostrar el mensaje de inicio de atención
setTimeout(() => callback(`Iniciando la atención de la solicitud ${s.id}`), 200); // Después de 200 ms llamamos al callback con un mensaje personalizado
}

//flujo principal con async/await
export async function procesar2() { // Función principal asincrónica que coordina todo el flujo
for (const s of solicitudes) { // Recorremos cada solicitud dentro del arreglo
console.log("\nProcesando solicitud:", s.id); // Mostramos en consola qué solicitud estamos procesando

try { // Iniciamos un bloque try para atrapar cualquier error en la validación o el proceso
validar(s); // Llamamos a la función validar para comprobar que los datos estén correctos
console.log("Validación correcta"); // Si no se lanzó error, mostramos que la validación fue exitosa

const nivel = clasificar(s); // Obtenemos el nivel de prioridad (alta, media o baja)
console.log("Prioridad:", nivel); // Mostramos la prioridad calculada en consola

iniciarAtencion(s, (msg) => console.log(msg)); // Llamamos a la función con callback para mostrar el mensaje de inicio de atención

const resultado = await atender(s); // Esperamos a que la promesa atender() se resuelva
console.log("Resultado:", resultado); // Mostramos el resultado de la atención (en este caso "atendida")

} catch (e) { // Si ocurre algún error en la validación o durante el proceso
console.log("Error en la solicitud", s.id, "-", e.message); // Mostramos el ID de la solicitud y el mensaje de error
}
}
}

