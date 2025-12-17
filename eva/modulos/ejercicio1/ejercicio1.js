//Sistema de Gestión lógica de solicitudes de soporte técnico
// Arreglo de solicitudes (datos de entrada)
const solicitudes = [ // Aqui declaramos un arreglo llamado solicitudes que contiene varias solicitudes de soporte
{ id: 1, area: "infraestructura", nivelUrgencia: 4, descripcion: "el servidor esta caído", reportadoPorSistema: true, intentosPrevios: 1 }, // Constantes las cuales son los datos con los que probraremos el codigo
{ id: 2, area: "desarrollo", nivelUrgencia: 2, descripcion: "error en el módulo", reportadoPorSistema: false, intentosPrevios: 0 }, // Segunda solicitud con datos válidos y urgencia media
{ id: 3, area: "general", nivelUrgencia: 5, descripcion: "sin descripcion", reportadoPorSistema: true, intentosPrevios: 0 } // Tercera solicitud, con urgencia alta, usada para probar casos límite
];

//Estas son las validaciones de los datos 
function validar(s) { // Funcion que recibe una solicitud y valida que todos sus campos sean correctos
if (typeof s.id !== "number" || s.id <= 0) throw new Error("id inválido"); // Aqui validamos que el ID sea un numero mayor a 0 o que no sea diferente de un numero, de lo contrario lanzamos un error
if (typeof s.area !== "string" || s.area.trim() === "") throw new Error("area inválida"); // Aqui validamos que el area sea un texto y que no esté vacío
if (typeof s.nivelUrgencia !== "number" || s.nivelUrgencia < 1 || s.nivelUrgencia > 5) throw new Error("Urgencia fuera de rango"); // Validamos que la urgencia sea un numero y que este entre 1 y 5
if (typeof s.descripcion !== "string" || s.descripcion.trim() === "") throw new Error("Descripción vacía"); // Validamos que la descripción sea texto y que no quede en blanco
if (typeof s.reportadoPorSistema !== "boolean") throw new Error("reportadoPorSistema debe ser booleano"); // Validamos que reportadoPorSistema solo sea true o false (un boolean)
if (typeof s.intentosPrevios !== "number" || s.intentosPrevios < 0) throw new Error("intentosPrevios inválido"); // Validamos que los intentos previos sean un numero y no sea negativo
}

// Con una callback vemos si tiene atencion inmediata o queda en espera
function decidirConCallback(solicitud, callback) { // Funcion que decide con una callback si la solicitud se atiende ya o queda en espera
setTimeout(() => { // Simulamos un proceso asincrono con un pequeño retraso
if (solicitud.nivelUrgencia >= 4) callback(null, "atender"); // Si la urgencia es 4 o 5, devolvemos por el callback que se debe atender de inmediato
else callback(null, "espera"); // Si la urgencia es menor, devolvemos por el callback que queda en espera
}, 300); // El tiempo de espera de la simulación es de 300 milisegundos
}

// utilizando la promesa se decide si se puede autoresolver
function analizarPromesa(solicitud) { // Funcion que devuelve una promesa para decidir si la solicitud se puede resolver automaticamente
return new Promise((resolve) => { // Creamos y devolvemos una nueva promesa
setTimeout(() => { // Simulamos otro proceso asincrono con un tiempo de espera
if (solicitud.reportadoPorSistema) resolve("auto"); // Si fue reportado por el sistema, consideramos que se puede autoresolver y devolvemos "auto"
else resolve("manual"); // Si no fue reportado por el sistema, marcamos que requiere resolución manual devolviendo "manual"
}, 400); // La simulación tarda 400 milisegundos
});
}

// El flujo principal con async/await
export async function procesar() { // Funcion principal asincrona que orquesta todo el procesamiento de las solicitudes
for (const s of solicitudes) { // Recorremos cada solicitud del arreglo una por una
console.log("\nProcesando solicitud:", s.id); // Mostramos en consola el ID de la solicitud que estamos procesando

try { // Iniciamos un bloque try para capturar cualquier error de validación o proceso
validar(s); // Llamamos a la función validar para asegurar que los datos estén correctos
console.log("✓ Validación correcta"); // Si no hubo error, mostramos que la validación fue exitosa

//Aca usamos callback
decidirConCallback(s, (err, r1) => { // Llamamos a la función con callback para decidir si se atiende o queda en espera
if (!err) console.log("Resultado callback:", r1); // Si no hay error, mostramos el resultado del callback en consola
});

// Ahora usamos promesas
const r2 = await analizarPromesa(s); // Esperamos el resultado de la promesa que indica si es auto o manual
console.log("Resultado promesa:", r2); // Mostramos el resultado de la promesa en consola

console.log("✓ Solicitud procesada sin errores"); // Indicamos que toda la solicitud se procesó correctamente

} catch (e) { // Si en algún punto se lanza un error, cae aquí
    console.log("✗ Error en solicitud", s.id, "-", e.message); // Mostramos que hubo un error en esa solicitud y el motivo
    }
}
}

