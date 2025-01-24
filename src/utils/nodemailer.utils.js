import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'johathan.stehr@ethereal.email',
        pass: 'MPkVkVGtJMawxuEUNG'
    }
});

const sendWelcomeEmail = async (userEmail) => {
    const mailOptions = {
        from: 'shahzaibalijamro@gmail.com',
        to: userEmail,
        subject: 'Welcome to Our App!',
        html: '<h1>Welcome!</h1><p>Thank you for registering with our app.</p>',
    };
    await transporter.sendMail(mailOptions);
};

export {sendWelcomeEmail}