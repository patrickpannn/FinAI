import nodemailer from 'nodemailer';

export default class EmailService {

    public static async sendMail(
        provider: string,
        appEmail: string,
        appPassword: string,
        userEmail: string,
        reset_code: string
    ): Promise<void> {
        try {
            const transporter = nodemailer.createTransport({
                service: provider,
                secure: true,
                auth: {
                    user: appEmail,
                    pass: appPassword
                }
            });
            const mailOptions = {
                from: appEmail,
                to: userEmail,
                subject: "Smart Portfolio: Password Reset",
                html: `<h2> Your reset code: ${reset_code} </h2>
            <h3>The code will expire in 30 minutes</h3>
            `,
            };
            await transporter.sendMail(mailOptions);
        } catch (e) {
            throw new Error('Error from email service');
        }
    }
};