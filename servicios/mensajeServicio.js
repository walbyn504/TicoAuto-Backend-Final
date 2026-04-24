// Servicio para enviar código de verificación por SMS utilizando Twilio
const twilio = require('twilio');

// Crea un cliente de Twilio utilizando las credenciales de la cuenta
const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// Función para enviar un código de verificación por SMS al número de teléfono del usuario
const enviarCodigoSMS = async (telefono, codigo) => {
    // Asegura que el número de teléfono tenga el formato correcto
    const numeroDestino = telefono.startsWith('+') ? telefono : `+506${telefono}`;

    // Envía el código de verificacion de 2FA
    await client.messages.create({
        body: `Tu código de verificación de TicoAuto es: ${codigo}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: numeroDestino
    });
};

module.exports = enviarCodigoSMS;