const twilio = require('twilio');

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const enviarCodigoSMS = async (telefono, codigo) => {
    const numeroDestino = telefono.startsWith('+') ? telefono : `+506${telefono}`;

    await client.messages.create({
        body: `Tu código de verificación de TicoAuto es: ${codigo}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: numeroDestino
    });
};

module.exports = enviarCodigoSMS;