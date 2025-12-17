1. Documentación técnica completa – ejercicio1.js
Sistema de Gestión lógica de solicitudes de soporte técnico

1.1 Definición explícita de datos de entrada
• Tipo de dato esperado

Cada elemento del arreglo solicitudes es un objeto con estos campos:

id: number, mayor que 0.

area: string, no vacío, representa el área de la empresa.

nivelUrgencia: number, entre 1 y 5.

descripcion: string, no vacío.

reportadoPorSistema: boolean, indica si el sistema detectó el problema.

intentosPrevios: number, mayor o igual a 0.

• Validaciones realizadas

En la función validar(s) se revisa:

id:

Condición:

typeof s.id !== "number" || s.id <= 0

Acción:

throw new Error("id inválido");

area:

Condición:

typeof s.area !== "string" || s.area.trim() === ""

Acción:

throw new Error("area inválida");

nivelUrgencia:

Condición:

typeof s.nivelUrgencia !== "number" || s.nivelUrgencia < 1 || s.nivelUrgencia > 5

Acción:

throw new Error("Urgencia fuera de rango");

descripcion:

Condición:

typeof s.descripcion !== "string" || s.descripcion.trim() === ""

Acción:

throw new Error("Descripción vacía");

reportadoPorSistema:

Condición:

typeof s.reportadoPorSistema !== "boolean"

Acción:

throw new Error("reportadoPorSistema debe ser booleano");

intentosPrevios:

Condición:

typeof s.intentosPrevios !== "number" || s.intentosPrevios < 0

Acción:

throw new Error("intentosPrevios inválido");

• Riesgos si el dato es incorrecto

id inválido: difícil rastreo de la solicitud, posible confusión entre casos.

area vacía o inválida: no se sabe a qué equipo asignar la solicitud.

nivelUrgencia fuera de rango: el flujo de prioridad (atender/espera) deja de tener sentido.

descripcion vacía: no hay contexto claro del problema para soporte.

reportadoPorSistema mal tipeado: la lógica de la promesa puede tomar decisiones incorrectas.

intentosPrevios negativo o incorrecto: afecta el análisis de historial del caso.

• Cómo se captura desde terminal

En este ejercicio, los datos no se capturan desde terminal.

El arreglo solicitudes está definido directamente en el código, simulando datos ya registrados en el sistema.

1.2 Descripción del proceso
• Variables creadas y su propósito

solicitudes:

Arreglo base con todas las solicitudes a procesar.

s:

Referencia a cada solicitud dentro del ciclo for...of.

r1:

Resultado del callback que indica "atender" o "espera".

r2:

Resultado de la promesa que indica "auto" o "manual".

• Explicación detallada de cada condicional

En validar(s):

typeof s.id !== "number" || s.id <= 0 Verifica que el ID sea numérico y positivo.

typeof s.area !== "string" || s.area.trim() === "" Se asegura de que el área exista y no sea una cadena vacía.

typeof s.nivelUrgencia !== "number" || s.nivelUrgencia < 1 || s.nivelUrgencia > 5 Se obliga a que la urgencia esté entre 1 y 5, evitando valores sin sentido.

typeof s.descripcion !== "string" || s.descripcion.trim() === "" Evita descripciones vacías o no textuales.

typeof s.reportadoPorSistema !== "boolean" Garantiza que la lógica de autoresolución funcione bien.

typeof s.intentosPrevios !== "number" || s.intentosPrevios < 0 Evita valores negativos o no numéricos en el historial de intentos.

En decidirConCallback:

if (solicitud.nivelUrgencia >= 4)

Si la urgencia es alta (4 o 5), el callback responde "atender".

Si es menor, responde "espera".

En analizarPromesa:

if (solicitud.reportadoPorSistema)

Si el sistema detectó el problema, se considera "auto" (posible autoresolución).

Si no, se marca "manual" (requiere intervención humana).

• Justificación de los ciclos empleados

Se usa:

js
for (const s of solicitudes) {
  ...
}
Justificación:

Es más legible para recorrer arreglos de objetos.

No necesita índices manuales (i), se trabaja directo con cada solicitud.

Evita errores de índice fuera de rango.

Se adapta bien a la idea de “procesar uno por uno”.

• Análisis de mutabilidad e inmutabilidad

Arreglo solicitudes:

No se reasigna ni se modifica su estructura.

Se procesa tal como está definido.

Objetos internos:

No se cambian sus propiedades, solo se leen.

Conclusión: El ejercicio trabaja de manera inmutable sobre los datos, solo lectura, sin alterarlos durante el flujo.

• Operadores utilizados y motivo de uso

typeof:

Para comprobar el tipo de cada campo (number, string, boolean).

|| (OR lógico):

Para agrupar varias condiciones que vuelven inválido un campo.

>=, <, >:

Para comparar rangos (urgencia, intentosPrevios).

=== y !==:

Para comparaciones estrictas de tipos y valores.

await:

Para esperar el resultado de la promesa analizarPromesa(s) dentro de una función async.

• Justificación del tipo de función

validar(s):

Función normal sincrónica.

Se justifica porque solo hace verificaciones inmediatas, sin esperar nada externo.

decidirConCallback(solicitud, callback):

Función asincrónica con setTimeout y callback.

Se usa para simular sistemas antiguos que trabajan con callbacks.

analizarPromesa(solicitud):

Función que retorna una Promise.

Representa sistemas más modernos que ya usan promesas.

export async function procesar():

Función principal marcada como async.

Permite usar await con promesas y mantener el código más limpio y lineal.

• Flujo de ejecución (paso a paso)

Se define el arreglo solicitudes con las solicitudes de soporte.

Se llama a la función procesar().

Dentro de procesar(), se recorre cada s del arreglo con for...of.

Para cada s:

Se ejecuta validar(s).

Si falla, se va al catch y muestra el error.

Si pasa la validación:

Se llama decidirConCallback(s, ...), que después de un tiempo devuelve "atender" o "espera".

Se espera el resultado de analizarPromesa(s) con await, obteniendo "auto" o "manual".

Se imprimen los resultados en consola.

Si ocurre cualquier error en validación o durante el proceso, se captura en el catch.

Al terminar el for, todas las solicitudes fueron procesadas, hayan tenido errores o no.

1.3 Manejo de errores
• Escenarios donde el usuario puede fallar

Enviar un id como texto o número negativo.

Dejar area o descripcion vacías.

Definir nivelUrgencia fuera del rango 1–5.

Enviar reportadoPorSistema como "true" o "false" string en lugar de boolean.

Mandar intentosPrevios como texto o número negativo.

• Tipo de error que se genera

Todos los errores se manejan con:

js
throw new Error("mensaje");
Son errores controlados, con mensajes personalizados.

• Mensaje claro al usuario

Ejemplos de mensajes:

"id inválido"

"area inválida"

"Urgencia fuera de rango"

"Descripción vacía"

"reportadoPorSistema debe ser booleano"

"intentosPrevios inválido"

Estos mensajes indican claramente qué campo falló y por qué.

• Garantía de que el programa NO se bloquea

Todo el procesamiento de cada solicitud está dentro de:

js
try {
  ...
} catch (e) {
  console.log("✗ Error en solicitud", s.id, "-", e.message);
}
Si una solicitud lanza error:

Se muestra el mensaje.

El programa no se detiene, sigue con la siguiente solicitud del arreglo.

1.4 Datos de salida
• Tipo de dato

La salida son mensajes por consola, es decir, cadenas de texto.

• Forma en que se presenta al usuario

Ejemplo de salida para una solicitud válida:

txt
Procesando solicitud: 1
✓ Validación correcta
Resultado callback: atender
Resultado promesa: auto
✓ Solicitud procesada sin errores
Ejemplo de salida para una solicitud con error:

txt
Procesando solicitud: 3
✗ Error en solicitud 3 - Descripción vacía
• Cómo se valida que el programa funcionó correctamente

Todas las solicitudes del arreglo muestran algún resultado en consola.

Las válidas muestran:

Validación correcta.

Resultado del callback.

Resultado de la promesa.

Las inválidas muestran:

Mensaje de error claro.

No detienen el procesamiento de las demás.