import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EHOST,
        port: process.env.EPORT,
        auth: {
          user: process.env.EUSER,
          pass: process.env.EPASS
        }
    });

    const { nombre, email, token } = datos;

    //Enviar email
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirma tu cuenta en BienesRaices.com',
        text: 'Confirma tu cuenta en BienesRaices.com',
        html: `
            <p>Hola ${nombre}, comprueba tu cuenta en BienesRaices.com</p>
            <p>Tu cuenta ya está lista en el siguiente enlace:
            <a href="">Confirmar Cuenta</a> </p>
            <p>Si tu no creaste esta cuenta puedes ignorar este mensaje</p>
        `
    });
}

export {
    emailRegistro
}