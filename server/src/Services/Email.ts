import nodemailer from 'nodemailer'

export const sendEmail = async (email_message: any) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    return await transporter.sendMail(email_message).then(() => {
        return true
    }).catch((error: Error) => {
        console.log(error);
        return false
    })
}