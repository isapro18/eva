1. Documentación técnica completa – Ejercicio 2
Sistema de Validación y Procesamiento de Solicitudes de Acceso

1.1 Definición explícita de datos de entrada
o Tipo de dato esperado

Cada elemento del arreglo solicitudes es un objeto con estos campos:

id: number, mayor que 0.

nombre: string, no vacío.

rol: string, no vacío (por ejemplo: "admin", "empleado", "invitado").

nivelAccesoSolicitado: number entre 1 y 5.

activo: boolean, indica si el usuario está activo en el sistema.

intentosPrevios: number mayor o igual a 0.

o Validaciones realizadas

En validarDatos(s) se revisa:

id:

Condición: typeof s.id !== "number" || s.id <= 0

Acción: throw new Error("ID inválido (se esperaba number > 0)").

nombre:

Condición: typeof s.nombre !== "string" || s.nombre.trim() === ""

Acción: throw new Error("Nombre inválido (se esperaba string)").

rol:

Condición: typeof s.rol !== "string" || s.rol.trim() === ""

Acción: throw new Error("Rol inválido (se esperaba string)").

nivelAccesoSolicitado:

Condición: typeof s.nivelAccesoSolicitado !== "number" || s.nivelAccesoSolicitado < 1 || s.nivelAccesoSolicitado > 5

Acción: throw new Error("Nivel de acceso fuera de rango (1 a 5)").

activo:

Condición: typeof s.activo !== "boolean"

Acción: throw new Error("Campo 'activo' inválido (se esperaba boolean)").

intentosPrevios:

Condición: typeof s.intentosPrevios !== "number" || s.intentosPrevios < 0

Acción: throw new Error("Intentos previos inválidos (se esperaba number >= 0)").

En validarLogica(s) se revisa:

Usuario activo:

Condición: if (!s.activo)

Acción: throw new Error("Usuario inactivo").

Límite de intentos:

Condición: if (s.intentosPrevios > 3)

Acción: throw new Error("Demasiados intentos previos").

Restricción por rol invitado:

Condición: if (s.rol === "invitado" && s.nivelAccesoSolicitado > 1)

Acción: throw new Error("Rol invitado no puede solicitar niveles altos").

o Riesgos si el dato es incorrecto

id inválido: no se puede identificar correctamente la solicitud, se pierde trazabilidad.

nombre vacío o mal tipeado: el sistema no sabe quién está pidiendo acceso.

rol inválido: las validaciones externas (callback, promesa, async) pueden tomar decisiones erróneas.

nivelAccesoSolicitado fuera del rango: se puede conceder un nivel que no existe o no permitido.

activo incorrecto: se puede aprobar a un usuario inactivo o bloquear a uno activo.

intentosPrevios negativo o incorrecto: rompe la lógica de seguridad sobre intentos repetidos.

o Cómo se captura desde terminal

En este ejercicio, los datos no se capturan desde la terminal.

El arreglo solicitudes está definido directamente en el código, simulando registros almacenados en un sistema previo.

1.2 Descripción del proceso
o Variables creadas y su propósito

solicitudes: arreglo original con todas las solicitudes de acceso.

original: referencia a cada solicitud en el for...of.

s: copia de cada solicitud ({ ...original }) para mantener inmutabilidad.

aprobadas: contador de solicitudes aprobadas.

rechazadas: contador de solicitudes rechazadas por lógica/negocio.

errores: contador de solicitudes con error de datos (tipos/rangos).

o Explicación detallada de cada condicional

En validarDatos(s) se asegura que los datos básicos tengan sentido:

Se comprueba que id sea numérico y mayor que 0.

Se revisa que nombre y rol sean strings no vacíos, evitando cadenas vacías.

Se fuerza que nivelAccesoSolicitado esté entre 1 y 5, que es el rango permitido.

Se valida que activo sea estrictamente booleano.

Se revisa que intentosPrevios no sea negativo y sea de tipo numérico.

En validarLogica(s) se aplica la lógica de negocio:

Si el usuario no está activo, no tiene sentido procesar su acceso.

Si ha superado un cierto número de intentos (> 3), se considera que puede haber abuso del sistema.

Si el rol es invitado y pide un nivel mayor a 1, se considera una solicitud fuera de lo permitido.

En las validaciones asincrónicas:

En validarRolCallback, solo los roles "admin" y "empleado" son aceptados por el sistema externo simulado; cualquier otro rol dispara un error.

En validarRolPromesa, solo el rol "admin" recibe una respuesta de "rol-validado"; los demás son rechazados.

En validarRolAsync, se rechaza explícitamente el rol "invitado", indicando que no está autorizado.

o Justificación de los ciclos empleados

Se utiliza:

js
for (const original of solicitudes) {
  const s = { ...original };
  ...
}
Este ciclo es adecuado porque:

Recorre de forma clara cada objeto del arreglo.

No requiere manejar índices manuales.

Facilita el procesamiento independiente de cada solicitud.

Combina bien con la idea de copiar cada elemento para mantener inmutabilidad (const s = { ...original }).

o Análisis de mutabilidad e inmutabilidad

El arreglo solicitudes no se modifica en ningún momento.

En lugar de trabajar directamente con cada elemento, se crea una copia: const s = { ...original };

No se cambian propiedades ni se reasigna el arreglo.

Esto asegura un enfoque inmutable, donde los datos de entrada se respetan tal cual llegaron, lo que facilita el análisis y evita efectos secundarios no deseados.

o Operadores utilizados y motivo de uso

typeof: para verificar el tipo de cada campo (number, string, boolean).

|| (OR lógico): para agrupar condiciones que marcan un dato como inválido.

<, >, <=, >=: para validar rangos, por ejemplo en nivelAccesoSolicitado y intentosPrevios.

===: para comparar valores exactos de rol.

!: para negar el valor de activo (!s.activo indica usuario inactivo).

await: para esperar el resultado de las promesas (incluida la promesa que envuelve el callback).

o Justificación del tipo de función

validarDatos(s): función sincrónica clásica porque solo revisa tipos y rangos de forma inmediata.

validarLogica(s): también sincrónica, centrada en reglas de negocio internas.

validarRolCallback(rol, callback): usa callback para simular servicios externos antiguos.

validarRolPromesa(rol): retorna una promesa, representando servicios externos más modernos.

validarRolAsync(rol): usa async pero internamente retorna una promesa, simulando otra validación externa.

export async function procesarSolicitudes(): es async porque coordina todas las validaciones asincrónicas usando await, lo que hace el flujo más claro.

o Flujo de ejecución (paso a paso)

El programa tiene definido el arreglo solicitudes con varios casos de prueba, incluidos algunos con errores.

Se llama a procesarSolicitudes(), que recorre todas las solicitudes.

Para cada original del arreglo:

Se crea una copia: const s = { ...original };.

Se muestra en consola: Procesando solicitud ID: <id>.

Dentro de un try, se ejecuta:

validarDatos(s) → valida tipos y rangos.

validarLogica(s) → aplica reglas de negocio.

Se envuelve validarRolCallback en una promesa y se espera con await para usarlo como parte del flujo asincrónico.

Se llama await validarRolPromesa(s.rol).

Se llama await validarRolAsync(s.rol).

Si todo lo anterior pasa sin errores:

Se imprime "Resultado: APROBADA".

Se incrementa aprobadas.

Si ocurre algún error en cualquier punto del try (datos, lógica, validación externa), el catch:

Muestra "Resultado: RECHAZADA".

Muestra "Motivo:" con el mensaje de error.

Si el mensaje contiene "inválido" o "rango", se incrementa errores (errores de datos).

En caso contrario, se incrementa rechazadas (rechazo por reglas o validaciones externas).

Al final del ciclo, se imprime un resumen general con:

Total de solicitudes procesadas.

Cantidad aprobadas.

Cantidad rechazadas.

Cantidad con errores de datos.

1.3 Manejo de errores
o Escenarios donde el usuario puede fallar

Enviar id como string o número menor o igual a 0.

Dejar nombre vacío o usar un tipo distinto de string.

Enviar rol vacío o con tipo incorrecto.

Usar nivelAccesoSolicitado fuera del rango 1–5.

Mandar activo como "true" o "false" en texto en lugar de boolean.

Usar intentosPrevios negativo o no numérico.

Rol no permitido por el sistema externo (validarRolCallback, validarRolPromesa, validarRolAsync).

o Tipo de error que se genera

Todos los errores se generan como:

js
throw new Error("mensaje");
Estos errores son capturados en el try/catch de procesarSolicitudes().

o Mensaje claro al usuario

Ejemplos de mensajes:

"ID inválido (se esperaba number > 0)"

"Nombre inválido (se esperaba string)"

"Rol inválido (se esperaba string)"

"Nivel de acceso fuera de rango (1 a 5)"

"Campo 'activo' inválido (se esperaba boolean)"

"Intentos previos inválidos (se esperaba number >= 0)"

"Usuario inactivo"

"Demasiados intentos previos"

"Rol invitado no puede solicitar niveles altos"

"Rol no permitido por el sistema externo"

"Sistema externo rechazó el rol"

"Async/Await: rol no autorizado"

Todos explican qué falló y qué se esperaba.

o Garantía de que el programa NO se bloquea

Cada solicitud se procesa dentro de un try/catch.

Si una solicitud genera error, solo esa se marca como rechazada; el for continúa con la siguiente.

No hay ningún throw sin capturar en el nivel superior del flujo.

El resumen final siempre se imprime, aunque varias solicitudes fallen.

1.4 Datos de salida
o Tipo de dato

Salida por consola: mensajes en texto.

o Forma en que se presenta al usuario

Para cada solicitud se muestra:

Procesando solicitud ID: <id>

Si todo sale bien:

"Resultado: APROBADA"

Si hay error:

"Resultado: RECHAZADA"

"Motivo: <mensaje de error>"

Al final:

txt
===== RESUMEN GENERAL =====
Total procesadas: X
Aprobadas: Y
Rechazadas: Z
Errores de datos: W
o Cómo se valida que el programa funcionó correctamente

Todas las solicitudes del arreglo generan alguna salida en consola.

Las solicitudes con datos correctos y lógica válida terminan como "Resultado: APROBADA".

Las solicitudes con errores de datos se cuentan en errores.

Las solicitudes con lógica incorrecta o rol no permitido se cuentan en rechazadas.

El resumen final coincide con la cantidad de solicitudes del arreglo.