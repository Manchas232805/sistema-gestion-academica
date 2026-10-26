# Módulo de matrículas

Una matrícula vincula un alumno con un curso. Se puede inscribir al mismo alumno
en varios cursos en una operación: si alguno no existe o ya tiene matrícula,
se rechaza todo el lote sin guardar inscripciones parciales.

## Puesta en marcha

1. Crear la base `gestion_academica` y configurar MySQL en
   `backend/src/main/resources/application.properties`.
2. Con Java 21, desde `backend` ejecutar `./mvnw.cmd spring-boot:run`. Hibernate, con
   `ddl-auto=update`, crea `matriculas` y su restricción única automáticamente.
   `database/matriculas.sql` documenta la alternativa SQL; requiere que las tablas
   de alumnos y cursos ya existan. No es necesario ejecutarlo al usar Hibernate.
3. Desde `frontend`, ejecutar `npm ci` y `npm start`.
4. Abrir `http://localhost:4200/matriculas` y registrar primero alumnos y cursos
   si los selectores están vacíos.

## Operaciones

| Método | Ruta | Función |
| --- | --- | --- |
| GET | `/api/matriculas` | Listar con nombres de alumno y curso |
| POST | `/api/matriculas` | Registrar uno o varios cursos de forma atómica |
| PUT | `/api/matriculas/{id}` | Editar alumno, curso, fecha y estado |
| PATCH | `/api/matriculas/{id}/cancelar` | Cancelar conservando el historial |

Ejemplo de registro:

```json
{"alumnoId": 1, "cursosIds": [1, 2], "fecha": "2026-10-26"}
```

La fecha es obligatoria y no puede ser futura. Para editar se envían `alumnoId`,
`cursoId`, `fecha` y `estado` (`ACTIVA` o `CANCELADA`). Una matrícula cancelada
también ocupa la combinación alumno/curso: se reactiva con Editar, sin duplicarla.
No se implementan periodos académicos ni pagos en este alcance.

La cancelación es idempotente. Las claves foráneas impiden borrar alumnos o cursos
con matrículas; cancelar no elimina esa relación ni su historial.

## Comprobaciones

- Registrar dos cursos y comprobar que aparecen dos filas y aumenta el contador.
- Repetir alumno/curso: debe responder 409 y no crear filas.
- Enviar un lote con un curso inexistente: 404 sin guardar ninguna matrícula.
- Enviar fecha futura, alumno nulo o selección vacía: 400.
- Editar una inscripción, cancelarla y reactivarla: conserva su ID.
- Registrar simultáneamente la misma combinación: solo debe persistir una fila.
- Buscar por nombre y filtrar activas/canceladas; comprobar errores y lista vacía.

Pruebas del servicio: desde `backend`, `./mvnw.cmd -Dtest=MatriculaServiceTests test`.
Compilación de la interfaz: desde `frontend`, `npm run build`.

Pruebas aisladas de la interfaz: `npm run test:matriculas` (requiere Chrome).
El archivo `tsconfig.matriculas.spec.json` permite ejecutar este módulo sin incluir
los errores previos de las pruebas de alumnos.

## Validación realizada en esta entrega

- Compilación Angular en modo desarrollo: correcta.
- Seis pruebas del módulo Angular en ChromeHeadless: correctas.
- La compilación de producción alcanza la generación de los paquetes, pero falla
  por el presupuesto de estilos de la fuente externa Inter del proyecto existente.
- Las siete pruebas de servicio Java están añadidas, pero no se pudieron ejecutar
  porque el entorno no tiene un `JAVA_HOME` válido. Pendiente comprobar el backend
  y los flujos completos con MySQL antes de integrar.
