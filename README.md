# TicoAuto-Backend REST API

## Descripción

Este proyecto corresponde al backend de **TicoAuto**, una plataforma para la publicación y búsqueda de vehículos en venta. Los usuarios pueden registrarse, iniciar sesión, publicar vehículos, realizar búsquedas con filtros, y comunicarse mediante preguntas y respuestas asociadas a cada vehículo.

El sistema utiliza una Arquitectura Orientada a Servicios (SOA) con un backend REST y un frontend desacoplado. La autenticación y las validaciones de seguridad son gestionadas a través de JWT y 2FA.

---

## Tecnologías utilizadas

- **Node.js**: JavaScript runtime environment para backend.
- **Express.js**: Framework web para Node.js.
- **MongoDB**: Base de datos NoSQL para almacenamiento.
- **Mongoose**: ORM para MongoDB.
- **JWT (JSON Web Token)**: Para la autenticación de usuarios.
- **bcrypt**: Para la encriptación de contraseñas.
- **dotenv**: Para manejar variables de entorno.
- **cors**: Middleware para habilitar solicitudes de origen cruzado.
- **SendGrid**: Para la verificación por correo electrónico.
- **Google OAuth2**: Para autenticación mediante Google.
- **Twilio**: Para el envío de mensajes SMS para 2FA.

---

## Funcionalidades principales

- **Registro de usuarios**:
  - Validación de cédula (verificación con un API externo).
  - Envío de correo de verificación con enlace único.
  - Autenticación mediante Google OAuth2.

- **Autenticación**:
  - Login mediante correo electrónico y 2FA con número de teléfono.
  - Integración con Google para login y registro.

- **Gestión de vehículos**:
  - Crear, leer, actualizar y eliminar vehículos.
  - Marcar vehículos como vendidos.
  
- **Filtros de búsqueda**:
  - Búsqueda por marca, modelo, precio, año, y estado del vehículo.

- **Sistema de preguntas y respuestas**:
  - Los usuarios pueden realizar preguntas sobre los vehículos y recibir respuestas.

---

## Diagrama arquitectura de servicios

![Diagrama de Arquitectura de Servicios](diagrama/Diagrama%20de%20servicios.png)

---

## Instalación

### 1. Clonar el repositorio

Primero, debes clonar el repositorio:

```bash
git clone https://github.com/walbyn504/TicoAuto-Backend-Final
```

Segundo, debes inicializar node.js:

```bash
npm install 
```

Luego, Tienes que crear un archivo .env, donde van todas tus variables de entorno.

---

### Ejemplo:

```bash
PORT=3001
MONGO_URI=mongodb://localhost:27001/auto
JWT_SECRET=your_jwt_secret_key
SENDGRID_API_KEY=your_sendgrid_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```