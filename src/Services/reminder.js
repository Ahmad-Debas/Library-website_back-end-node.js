import orderModel from "../../DB/model/Order.model.js";
import userModel from "../../DB/model/User.model.js";
import { sendEmail } from "./email.js";
async function sendAllReminders() {
    try {

        const orders = await orderModel.find({ status: 'deliverd' });


      for (const order of orders) {

        const daysDifference = Math.floor((Date.now() - new Date(order.createdAt)) / (1000 * 60 * 60 * 24));


        if (order.duration - daysDifference === 7) {
          const user = await userModel.findById(order.userId);


          const emailSubject = 'تذكير بخصوص طلبك';
          const emailHTML = `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>تذكير بخصوص طلبك</title>
              </head>
              <body>
                <p>عزيزي ${user.userName},</p>
                <p>نود تذكيرك بأن لديك طلب قيد التوصيل تبقى 7 أيام للوصول.</p>
                <p>تفقد حسابك للمزيد من التفاصيل.</p>
                <p>شكرًا لاختيارك!</p>
              </body>
            </html>`;

          await sendEmail(user.email, emailSubject, emailHTML);
        }
      }
    } catch (error) {
      console.error('Error sending reminders:', error.message);
    }
  }
  export default sendAllReminders();
