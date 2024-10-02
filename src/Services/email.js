import nodemailer from "nodemailer";

export async function sendEmail(to,subject,html,from=`Library " <${process.env.EMAIL}>`){


const transporter = nodemailer.createTransport({
  service:'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILPASS
  }
});

  const info = await transporter.sendMail({
    from , // sender address
    to, // list of receivers
    subject, // Subject line
    html, // html body
  });

  return info;
}
