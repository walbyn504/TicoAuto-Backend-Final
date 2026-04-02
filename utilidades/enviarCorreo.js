const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const enviarCorreoVerificacion = async (correo, nombre, linkVerificacion) => {
    const mensaje = {
        to: correo,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: 'Verificación de cuenta',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                <h2>Hola ${nombre}</h2>
                <p>Gracias por registrarte en el sistema.</p>
                <p>Para activar tu cuenta, haz clic en el siguiente botón:</p>

                <p style="text-align: center;">
                    <a href="${linkVerificacion}" 
                       style="display:inline-block;padding:12px 20px;background:#2563eb;color:white;text-decoration:none;border-radius:6px;">
                        Verificar cuenta
                    </a>
                </p>

                <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
                <p>${linkVerificacion}</p>

                <p>Este enlace expirará en 24 horas.</p>
            </div>
        `
    };

    await sgMail.send(mensaje);
};

module.exports = enviarCorreoVerificacion;