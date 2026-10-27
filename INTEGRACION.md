# Integración en el fork

Esta rama integra el ZIP actualizado del equipo y conserva el módulo de matrículas.
No modifica el repositorio de SebastianCabezas03 ni la rama de su pull request.

## Ejecutar en Windows

Requisitos: PostgreSQL, JDK 21 y Node.js compatible con Angular 20.
Crear una base vacía llamada `gestion_academica`. Desde PowerShell, en `backend`:

```powershell
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = Read-Host "Contraseña de PostgreSQL" -MaskInput
$env:ADMIN_PASSWORD = Read-Host "Contraseña para el administrador inicial" -MaskInput
./mvnw.cmd spring-boot:run
```

`ADMIN_PASSWORD` solo se usa si no existe el usuario `admin`. No cambia su clave
si ya existe. Sin esta variable, no se crea una cuenta nueva y se informa al iniciar.
`DB_URL` permite cambiar servidor/base y `SERVER_PORT` el puerto del backend.
Spring Boot no carga archivos `.env` automáticamente.

Hibernate crea/actualiza el esquema al iniciar. Como alternativa manual,
`database/gestion_academica.sql` contiene el esquema PostgreSQL sin datos de muestra.
`CREATE TABLE IF NOT EXISTS` no migra estructuras existentes ni convierte MySQL.
Para una base ya existente, revisar sus cambios de esquema antes de aplicarlos.

Desde `frontend`: `npm ci`, luego `npm start`.
Abrir http://localhost:4200/login e ingresar con el administrador configurado.
Registrar alumnos y cursos antes de crear matrículas.

## Cambios

- Conserva el login y las mejoras visuales de alumnos/cursos del archivo del equipo.
- Restaura la ruta `/matriculas` y sus operaciones de registro, edición y cancelación.
- Inicio consulta alumnos, docentes, cursos y matrículas de forma independiente.
  El total de matrículas incluye activas y canceladas. Un fallo muestra un guion,
  sin convertir un error de conexión en un total cero.
- Activa los accesos rápidos de los cuatro módulos.
- Elimina el driver MySQL y usa configuración PostgreSQL mediante variables.
- Adapta ambos scripts SQL a PostgreSQL, sin contraseñas ni datos personales.
- Desactiva la incorporación de fuentes remotas durante la compilación. Las fuentes
  externas del HTML siguen requiriendo conexión en el navegador.

## Validación

`npm run build` compila producción. `npm run test:ci` ejecuta las pruebas Angular
en ChromeHeadless. El navegador Chrome debe estar instalado.
`./mvnw.cmd -Dtest=MatriculaServiceTests test` ejecuta las pruebas Java del servicio.
La prueba de contexto completa requiere PostgreSQL y las variables de conexión.

## Limitación heredada de autenticación

El login verifica credenciales, pero SecurityConfig aún permite las solicitudes de
la API y el guard solo protege la navegación del navegador. Esta integración no
implementa JWT ni sesiones autenticadas. Se debe completar la autorización del
backend antes de desplegar el sistema fuera de un entorno local de desarrollo.

Verificación de esta entrega: compilación de producción correcta y 13 pruebas Angular correctas. Quedan advertencias de tamaño de estilos. No se ejecutó Java ni la conexión PostgreSQL por falta de JDK configurado en este entorno.
