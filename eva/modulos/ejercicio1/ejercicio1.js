//Sistema de Gestión lógica de solicitudes de soporte técnico
// Arreglo de solicitudes (datos de entrada)
const solicitudes = [
{ id: 1, area: "infraestructura", nivelUrgencia: 4, descripcion: "el servidor esta caído", reportadoPorSistema: true, intentosPrevios: 1 },
{ id: 2, area: "desarrollo", nivelUrgencia: 2, descripcion: "error en el módulo", reportadoPorSistema: false, intentosPrevios: 0 },
{ id: 3, area: "general", nivelUrgencia: 5, descripcion: "sin descripcion", reportadoPorSistema: true, intentosPrevios: 0 } // solicitud con errores corregidos
];
//Validar los datos
function validar(s) {
if (typeof s.id !== "number" || s.id <= 0) throw new Error("id inválido");
if (typeof s.area !== "string" || s.area.trim() === "") throw new Error("area inválida");
if (typeof s.nivelUrgencia !== "number" || s.nivelUrgencia < 1 || s.nivelUrgencia > 5) throw new Error("Urgencia fuera de rango");
if (typeof s.descripcion !== "string" || s.descripcion.trim() === "") throw new Error("Descripción vacía");
if (typeof s.reportadoPorSistema !== "boolean") throw new Error("reportadoPorSistema debe ser booleano");
if (typeof s.intentosPrevios !== "number" || s.intentosPrevios < 0) throw new Error("intentosPrevios inválido");
}
// Con callback vemos si tiene atencion inmediata o queda en espera
function decidirConCallback(solicitud, callback) {
setTimeout(() => {
if (solicitud.nivelUrgencia >= 4) callback(null, "atender");
else callback(null, "espera");
}, 300);
}
// utilizando la promesa se decide si se puede autoresolver
function analizarPromesa(solicitud) {return new Promise((resolve) => {
setTimeout(() => {
if (solicitud.reportadoPorSistema) resolve("auto");
else resolve("manual");
}, 400);
});
}
// El flujo principal con async/await
export async function procesar() {
for (const s of solicitudes) {
console.log("\nProcesando solicitud:", s.id);

try {
validar(s);
console.log("✓ Validación correcta");

//Aca usamos callback
decidirConCallback(s, (err, r1) => {
if (!err) console.log("Resultado callback:", r1);
});

// Ahora usamos promesas
const r2 = await analizarPromesa(s);
console.log("Resultado promesa:", r2);

console.log("✓ Solicitud procesada sin errores");

} catch (e) {
    console.log("✗ Error en solicitud", s.id, "-", e.message);
    }
}
}
procesar();
