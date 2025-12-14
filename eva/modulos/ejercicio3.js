//Sistema de Gestión Asíncrona de Solicitudes de Servicio
// Datos de entrada
const solicitudes = [
{ id: 1, usuario: "Ana", tipo: "software", prioridad: 3, descripcion: "Error en app", estado: "pendiente" },
{ id: 2, usuario: "Carlos", tipo: "hardware", prioridad: 5, descripcion: "Pantalla dañada", estado: "pendiente" },
{ id: 3, usuario: "", tipo: "otro", prioridad: 10, descripcion: "", estado: "pendiente" } // solicitud con errores
];
// Validar las solicitudes
function validar(s) {
if (typeof s.id !== "number" || s.id <= 0) throw new error("ID inválido");
if (typeof s.usuario !== "string" || s.usuario.trim() === "") throw new error("Usuario inválido");
if (s.tipo !== "software" && s.tipo !== "hardware") throw new error("Tipo inválido");
if (typeof s.prioridad !== "number" || s.prioridad < 1 || s.prioridad > 5) throw new error("Prioridad fuera de rango");
}
// clasificación por prioridad
function clasificar(s) {
if (s.prioridad >= 4) return "alta prioridad";
if (s.prioridad >= 2) return "media prioridad";
return "baja prioridad";
}
// Promesa: simula la atención
function atender(s) {
return new Promise((resolve) => {
setTimeout(() => resolve("atendida"), 500);
});
}
// hacemos una callback para el mensaje de inicio

function iniciarAtencion(s, callback) {
setTimeout(() => callback(`Iniciando la atención de la solicitud ${s.id}`), 200);
}

//flujo principal con async/await
async function procesar() {
for (const s of solicitudes) {
console.log("\nProcesando solicitud:", s.id);

try {
validar(s);
console.log("Validación correcta");

const nivel = clasificar(s);
console.log("Prioridad:", nivel);

iniciarAtencion(s, (msg) => console.log(msg));

const resultado = await atender(s);
console.log("Resultado:", resultado);

} catch (e) {
console.log("Error en la solicitud", s.id, "-", e.message);
}
}
}

procesar();