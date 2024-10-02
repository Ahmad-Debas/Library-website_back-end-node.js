import userModel from "../../../../DB/model/User.model.js";
import { sendEmail } from "../../../Services/email.js";
import { generateToken, verifyToken } from "../../../Services/generateAndVerifyToken.js";
import bcrypt from 'bcryptjs';
import { customAlphabet, nanoid } from 'nanoid'
export const signup = async(req,res)=>{

    try{
        const {userName,email,password,phone,role='User'} = req.body;

        const user = await userModel.findOne({email});
        if(user){
            return res.status(409).json({message:"email already exists"});
        }

        const token = generateToken({email},process.env.SIGNUP_TOKEN);
        const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;        const html = `

        <!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تأكيد البريد الإلكتروني</title>
    <style>
        /* Reset CSS */
        body, html {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            direction: rtl;
            text-align: right;
        }
        /* Container */
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #f8f8f8;
            border-radius: 5px;
            border: 1px solid #ddd;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        /* Heading */
        h1 {
            color: #333;
        }
        /* Paragraph */
        p {
            color: #666;
            line-height: 1.6;
        }
        /* Button */
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>تأكيد البريد الإلكتروني</h1>
        <p>شكرًا لتسجيلك في موقعنا، لإكمال عملية التسجيل، الرجاء تأكيد عنوان بريدك الإلكتروني عبر الضغط على الزر أدناه:</p>
        <a href="${link}" class="button">تأكيد البريد الإلكتروني</a>
        <p>إذا لم تقم بتسجيل، يمكنك تجاهل هذا البريد.</p>
    </div>
</body>
</html>

        `;
       const emailSend= await sendEmail(email,'confirm email',html);

       if(!emailSend.accepted.length > 0){
        return res.status(400).json({message:"fail to send confirmation email"});
       }


       const hashedPassword = await bcrypt.hash(password,parseInt(process.env.SALT_ROUND));
       const createUser = await userModel.create({userName,email,phone,password:hashedPassword,role});
        return res.status(201).json({message:'success'});

    }catch(error){
        return res.status(500).json({message:'catch error',error:error.stack});
    }


}

export const confirmEmail = async(req,res)=>{

    try{


    const {token} = req.params;
    const decoded = verifyToken(token,process.env.SIGNUP_TOKEN);

    if(!decoded){
        return res.status(400).json({message:"invalid token"});
    }

    const user = await userModel.updateOne({email:decoded.email},{confirmEmail:true});

    if(user.modifiedCount ){

        return res.redirect(`${process.env.FE}`);
    }else {
        return res.status(500).json({message:"error"});
    }
}
catch(error){
    return res.status(500).json({message:'catch error',error:error.stack})
}
}


export const login = async(req,res)=>{

    const {email,password} = req.body;

    const user = await userModel.findOne({email});

    if(!user){

        return res.status(400).json({message:"invalid login data"});
    }else{

        if(!user.confirmEmail){
            return res.status(400).json({message:'plz verify your email'});
        }else if(user.status=='Not_Active'){
            return res.status(400).json({message:"your account is blocked"})
        }

        const match = await bcrypt.compare(password,user.password);
        if(!match){
            return res.status(400).json({message:"invalid login data"});
        }

        const token = await generateToken({id:user._id,role:user.role},process.env.LOGINTOKEN);
        // user.online = true;
        // await user.save();
              await userModel.findOneAndUpdate({_id:user._id},{online:true});

        return res.status(200).json({message:'success',token});

    }
}

export const sendCode = async(req,res)=>{

    const {email} = req.body;
    const nanoid = customAlphabet('1234567890abcdef', 4)
    const code = nanoid();
    const user = await userModel.findOneAndUpdate({email},{code},{new:true});
    if(!user){
        return res.status(401).json({message:"not register user"})
    }

    const html =
    `
    <!DOCTYPE html>
    <html lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تأكيد البريد الإلكتروني</title>
        <style>
            /* Reset CSS */
            body, html {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                direction: rtl;
                text-align: right;
            }
            /* Container */
            .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #f8f8f8;
                border-radius: 5px;
                border: 1px solid #ddd;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            /* Heading */
            h1 {
                color: #333;
            }
            /* Paragraph */
            p {
                color: #666;
                line-height: 1.6;
            }
            /* Button */
            .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
            }
            .button:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    <body>
        <div class="container">
        <h1>إعادة تعيين كلمة المرور</h1>
        <p>لقد طلبت إعادة تعيين كلمة المرور الخاصة بك. يرجى استخدام الرمز التالي لإعادة تعيين كلمة المرور الخاصة بك:</p>
        <div class="code">
            <pre>${code}</pre>
        </div>
        <p>إذا لم تطلب إعادة تعيين كلمة المرور، فلا داعي لاتخاذ أي إجراء آخر.</p>
        </div>
    </body>
    </html>
    `
    ;
    await sendEmail(email,"reset password",`${html}`);
    return res.status(200).json({message:"success"});
}

export const forgotPassword = async(req,res)=>{

    const {email,password,code} = req.body;
    const user = await userModel.findOne({email});
    if(!user){
        return res.status(401).json({message:"not register user"});
    }

    if(user.code != code){
        return res.status(400).json({message:"plz insert valid code"});
    }

    user.password = await bcrypt.hash(password,parseInt(process.env.SALT_ROUND));
    user.code = null;
    await user.save();

    return res.status(200).json({message:"success"});
}
