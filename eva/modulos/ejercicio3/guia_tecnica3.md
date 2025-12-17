1. Documentación técnica completa – Ejercicio 3
Sistema de Gestión Asíncrona de Solicitudes de Servicio

1.1 Definición explícita de datos de entrada
o Tipo de dato esperado

El sistema trabaja con un arreglo llamado solicitudes, donde cada elemento es un objeto con estos campos:

id: number, mayor que 0.

usuario: string, no vacío (nombre de la persona que reporta el problema).

tipo: string, con valores esperados "software" o "hardware".

prioridad: number entre 1 y 5 (1 = baja, 5 = muy alta).

descripcion: string, explicación del problema.

estado: string, por ejemplo "pendiente".

En el código se incluye intencionalmente una solicitud con errores para probar las validaciones.

o Validaciones realizadas

La función validar(s) aplica estas reglas:

Sobre id:

Condición: typeof s.id !== "number" || s.id <= 0

Acción: throw new Error("ID inválido");

Sobre usuario:

Condición: typeof s.usuario !== "string" || s.usuario.trim() === ""

Acción: throw new Error("Usuario inválido");

Sobre tipo:

Condición: s.tipo !== "software" && s.tipo !== "hardware"

Acción: throw new Error("Tipo inválido");

Sobre prioridad:

Condición: typeof s.prioridad !== "number" || s.prioridad < 1 || s.prioridad > 5

Acción: throw new Error("Prioridad fuera de rango");

(En tu código pusiste new error(...), pero lo correcto en JavaScript es new Error(...) con E mayúscula.)

o Riesgos si el dato es incorrecto

id inválido: no se puede identificar ni rastrear la solicitud.

usuario vacío o mal tipeado: no hay responsable claro del reporte.

tipo incorrecto: la solicitud no entra en ninguna categoría válida de servicio.

prioridad fuera de rango: la clasificación de prioridad pierde sentido y puede atender mal los casos.

descripcion vacía (aunque no se valida): el equipo de soporte no tiene contexto de lo que pasa.

o Cómo se captura desde terminal

En este ejercicio no se capturan datos desde la terminal:

El arreglo solicitudes se define directamente en el código fuente.

Esto simula que ya existen solicitudes registradas en el sistema y solo se van a procesar.

1.2 Descripción del proceso
o Variables creadas y su propósito

solicitudes: Arreglo base con todas las solicitudes que el sistema va a procesar.

s (en el for): Representa cada solicitud individual que se está procesando en ese momento.

nivel: Resultado textual de la función clasificar(s) ("alta prioridad", "media prioridad" o "baja prioridad").

resultado: Resultado devuelto por la promesa atender(s), que en este caso siempre devuelve "atendida".

o Explicación detallada de cada condicional

En la función validar(s):

if (typeof s.id !== "number" || s.id <= 0)

Se asegura de que el ID sea un número positivo.

Evita IDs vacíos, negativos o de tipo incorrecto.

if (typeof s.usuario !== "string" || s.usuario.trim() === "")

Verifica que el nombre del usuario sea texto y no esté vacío.

Evita solicitudes anónimas o mal formateadas.

if (s.tipo !== "software" && s.tipo !== "hardware")

Solo permite los tipos "software" o "hardware".

Cualquier otro valor se considera inválido.

if (typeof s.prioridad !== "number" || s.prioridad < 1 || s.prioridad > 5)

Obliga a que la prioridad esté en un rango lógico (1 a 5).

Evita valores extremos o sin sentido (como prioridad 10).

En la función clasificar(s):

if (s.prioridad >= 4) return "alta prioridad";

Prioridades 4 y 5 se consideran críticas.

if (s.prioridad >= 2) return "media prioridad";

Prioridades 2 y 3 entran en la mitad del rango.

return "baja prioridad";

Prioridad 1 se considera mínima urgencia.

o Justificación de los ciclos empleados

Se utiliza este ciclo:

js
for (const s of solicitudes) {
  ...
}
Justificación:

Recorre directamente cada objeto del arreglo sin necesidad de índices numéricos.

Hace el código más legible al trabajar con s como solicitud completa.

Encaja bien con el enfoque de “procesar cada solicitud de forma independiente”.

o Análisis de mutabilidad e inmutabilidad

El arreglo solicitudes no se modifica dentro del flujo.

A cada elemento se le aplica validación, clasificación y atención, pero no se cambia su contenido original (no se reasignan sus propiedades).

Todo el procesamiento se hace en base a la lectura de los datos, no a su modificación.

→ El enfoque es básicamente inmutable: se leen los datos, se ejecutan procesos sobre ellos, pero la estructura original se mantiene intacta.

o Operadores utilizados y motivo de uso

typeof

Se usa para validar el tipo de cada campo (number, string).

Protege contra errores de tipo antes de seguir con el flujo.

|| (OR lógico)

Se usa para construir condiciones compuestas donde cualquiera de las partes hace que el dato sea inválido (por ejemplo: tipo incorrecto o valor fuera de rango).

&& (AND lógico)

Se utiliza cuando se necesita que ambas condiciones se cumplan para marcar algo como inválido (ejemplo: tipo !== "software" && tipo !== "hardware").

Comparadores <, >, >=, <=

Se usan para limitar rangos de prioridad y validar valores numéricos.

await

Se usa en procesar2() para esperar el resultado de la promesa atender(s) sin bloquear todo el programa.

o Justificación del tipo de función

validar(s):

Es una función sincrónica.

Se limita a revisar tipos y rangos; no necesita esperar nada externo.

clasificar(s):

También sincrónica.

Solo calcula un texto de prioridad en base a un número.

atender(s):

Retorna una promesa.

Simula un proceso externo (por ejemplo, un sistema de soporte) que tarda un tiempo en marcar la solicitud como atendida.

iniciarAtencion(s, callback):

Usa un callback clásico.

Representa una forma antigua de asincronía donde se llama a una función cuando el mensaje está listo.

export async function procesar2():

Es la función principal del flujo.

Está marcada como async para poder usar await con la promesa atender(s) y mantener el código legible.

o Flujo de ejecución (paso a paso)

El programa define el arreglo solicitudes con tres solicitudes, una de ellas con errores intencionales.

Se llama a la función procesar2().

Dentro de procesar2() se recorre el arreglo con for (const s of solicitudes).

Para cada solicitud:

Se imprime: Procesando solicitud: <id>.

Dentro del try:

Se llama a validar(s).

Si los datos son incorrectos, se lanza un error y se salta al catch.

Si la validación es correcta, se imprime "Validación correcta".

Se llama a clasificar(s) y se guarda el resultado en nivel.

Se imprime "Prioridad: <nivel>".

Se llama a iniciarAtencion(s, callback):

Después de un pequeño tiempo, el callback imprime: "Iniciando la atención de la solicitud <id>".

Se llama a await atender(s):

La promesa tarda 500 ms y luego resuelve con "atendida".

Ese valor se guarda en resultado y se imprime "Resultado: atendida".

Si en cualquier parte del try ocurre un error, se pasa al catch:

Se imprime: "Error en la solicitud <id> - <mensaje de error>".

El ciclo sigue con la siguiente solicitud sin detener el programa, aunque alguna falle.

1.3 Manejo de errores
o Escenarios donde el usuario puede fallar

Poner un id que no sea número o que sea menor o igual a 0.

Dejar usuario vacío o enviar un tipo distinto de string.

Escribir un tipo diferente de "software" o "hardware".

Poner una prioridad menor que 1 o mayor que 5.

Dejar descripciones vacías (aunque no se valida explícitamente, es una mala práctica).

o Tipo de error que se genera

Se usan errores de tipo Error:

js
throw new Error("mensaje");
(De nuevo: en tu código está como new error, pero debe ser new Error.)

o Mensaje claro al usuario

Ejemplos de mensajes:

"ID inválido"

"Usuario inválido"

"Tipo inválido"

"Prioridad fuera de rango"

Estos mensajes indican claramente cuál campo está mal y qué tipo de problema se encontró.

o Garantía de que el programa NO se bloquea

Cada solicitud se procesa dentro de un try { ... } catch (e) { ... }.

Si una solicitud genera error en validar(s):

Se imprime el mensaje.

El ciclo continúa con la siguiente solicitud.

No hay ningún error sin capturar que pueda detener el flujo completo.

El uso de await está dentro del try, así que incluso si algo falla en la parte asíncrona, el catch lo captura.

1.4 Datos de salida
o Tipo de dato

Toda la salida del programa es texto enviado a la consola mediante console.log().

o Forma en que se presenta al usuario

Para una solicitud válida, la consola muestra algo como:

txt
Procesando solicitud: 1
Validación correcta
Prioridad: media prioridad
Iniciando la atención de la solicitud 1
Resultado: atendiда
Para una solicitud con errores (por ejemplo, usuario vacío, tipo incorrecto o prioridad 10):

txt
Procesando solicitud: 3
Error en la solicitud 3 - Usuario inválido
(o el primer error que se dispare en validar(s)).

o Cómo se valida que el programa funcionó correctamente

Todas las solicitudes del arreglo generan alguna salida en consola.

Las solicitudes con datos válidos:

Pasan por validación.

Se clasifican por prioridad.

Muestran el mensaje de inicio de atención.

Muestran el resultado "atendida".

Las solicitudes con datos erróneos:

No avanzan al resto del flujo.

Muestran un mensaje de error claro.

El programa termina de procesar todas las solicitudes sin bloquearse.