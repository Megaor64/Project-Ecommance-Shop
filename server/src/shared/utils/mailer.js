import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:
    {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

async function verificationMail(to, code) {
    await transporter.sendMail({
        from: `my website ${process.env.EMAIL_USER}`,
        to: to,
        subject: "Your Verification Code:",
        text: `This is the Verification code: ${code}`,
        html: `<h2>This is the Verification code:<h2> 
            <h1>${code}<h1>
            <h3>This code expires in 5 hours`
    })
}

async function resetPasswordMail(to) {
    const baseUrl =
    "http://localhost:3005";
  const resetUrl = `${baseUrl}/reset-password?={token}`;
    await transporter.sendMail({
        from: `my website ${process.env.EMAIL_USER}`,
        to: to,
        subject: "Password reseting link:",
        text: `Enter this link to reset your password ${resetUrl}`,
        html: `<h2>This is the link:<h2> 
            <h1>${resetUrl}<h1>`
    })
}

export default { verificationMail, resetPasswordMail }