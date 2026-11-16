# MiniBoard

MiniBoard es una aplicación web tipo Kanban para gestionar tareas, proyectos y trabajo colaborativo en tiempo real.
Este proyecto es una version ajustada del proyecto de fin de curso de DAW.

## Descripción general

MiniBoard está pensado para escenarios donde varios usuarios necesitan colaborar en la misma planificación visual. En lugar de usar un único listado de tareas, el sistema ofrece una vista tipo tablero con columnas y tarjetas, muy similar a herramientas de gestión ágil.

Cada tablero puede representar un proyecto o un espacio de trabajo concreto, y dentro de él los usuarios pueden:

- crear columnas con distintos estados.
- añadir tarjetas con contenido, títulos y color.
- editar tarjetas y columnas.
- mover tarjetas entre columnas.
- reordenar columnas y elementos.
- invitar a otros usuarios.
- controlar permisos según el rol del usuario.
- actualizar los cambios en tiempo real.

## Objetivo del proyecto

El objetivo principal de MiniBoard es ofrecer una solución ligera y funcional para gestionar tareas colaborativas. Y aplicar conceptos de desarrollo web:

- separación de codigo por modulos segun su funcion.
- autenticación con JWT.
- comunicación en tiempo real con WebSockets.
- persistencia de datos con PostgreSQL.
- gestión de permisos por usuario.
- Aislamiento basico en el desarrollo (docker para la DB).

## Stack tecnológico

### Frontend
- HTML5
- CSS3
- Bootstrap 5
- JavaScript ES Modules
- SortableJS para drag-and-drop
- Socket.IO client para comunacion en tiempo real.

### Backend
- Node.js
- Express
- Socket.IO
- Sequelize como modelo de datos.
- JWT (JSON Web Tokens) para autenticacion.
- PostgreSQL en contenedor
- API en contenedor separado

### Frontend
El cliente web se estructura en módulos para separar claramente la vista de los controladores y modelos. La app inicia determinando si el usuario tiene sesión activa y, según esa condición, renderiza la pantalla de login o la home del usuario.

La lógica del frontend se divide en:

- view: componentes visuales y renderizado DOM
- controller: manejo de eventos y coordinación de acciones
- model: llamadas a la API y comunicación con sockets
- utilities: apoyo para cookies, autenticación y utilidades generales

### Backend
El backend está construido con Express y expone una API REST para gestionar usuarios, tableros, invitaciones y permisos. Además, utiliza Socket.IO para sincronizar cambios en tiempo real entre clientes conectados al mismo tablero.

Esto permite que una acción como mover una tarjeta o editar un título se refleje inmediatamente para todos los usuarios del mismo proyecto.


## Funcionalidades principales

### Registro e inicio de sesión
El usuario puede crear una cuenta y luego iniciar sesión usando correo y contraseña. El backend valida las credenciales y genera un token JWT si la autenticación es correcta.

### Home de tableros
La home principal muestra los tableros disponibles para el usuario. Desde aquí se puede:

- crear un tablero nuevo,
- abrir un tablero existente,
- marcar tableros como favoritos,
- eliminar tableros,
- consultar invitaciones pendientes.

### Gestión de columnas
Dentro del tablero, el usuario puede:

- crear nuevas columnas,
- eliminar columnas,
- cambiar el título de una columna,
- reorganizar el orden de las columnas.

### Gestión de tarjetas
Las tarjetas representan las tareas. Se pueden:

- crear nuevas tarjetas,
- editar su contenido,
- cambiar su título,
- cambiar su color,
- moverlas entre columnas,
- eliminar tarjetas,
- reordenarlas dentro de una columna.

### Invitaciones y colaboración
Los usuarios pueden invitar a otros miembros a un tablero. La invitación se gestiona desde la aplicación y puede aceptarse o rechazarse. Esto permite crear un entorno colaborativo con varios participantes.

### Vista colaborativa en tiempo real
Los cambios en el tablero se reflejan inmediatamente en todos los clientes conectados. Si un usuario cambia el contenido de un tablero, otros usuarios pueden verlo sin tener que refrescar la pantalla.