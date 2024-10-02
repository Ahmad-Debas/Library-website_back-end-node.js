import orderModel from "../../../../DB/model/Order.model.js";
import userModel from "../../../../DB/model/User.model.js";
import { sendEmail } from "../../../Services/email.js";
import bcrypt from 'bcryptjs';

export const getAdminData = async(req,res)=>{
    try{
        return res.json({message:'success',user:req.user});
    }
    catch(error){
        return res.status(500).json({message:"catch error",error:error.stack});
    }
}

export const getUsers = async(req,res)=>{

    try{

        const users = await userModel.find({});
        return res.status(200).json({message:"success",users});
    }
    catch(error){
        return res.status(500).json({message:"catch error",error:error.stack});
    }
}

export const getUser = async(req,res)=>{

    try{

        const user = await userModel.findById(req.params.id);
        return res.status(200).json({message:"success",user});
    }
    catch(error){
        return res.status(500).json({message:"catch error",error:error.stack});
    }
}
export const getUserToken = async(req,res)=>{

    try{
        const user = await userModel.findById(req.user._id);
        return res.status(200).json({message:"success",user:user});
    }
    catch(error){
        return res.status(500).json({message:"catch error",error:error.stack});
    }
}

export const getAllUsers = async(req,res)=>{

    const orders = await orderModel.find({status:'deliverd'});
    const userIds = orders.map(order => order.userId);
    const users = await userModel.find({ _id: { $in: userIds } });


      return res.status(200).json({message:"success",users});

    }


export const updateUser = async(req,res)=>{

    const {userId} = req.params;
    const user = await userModel.findById(userId);
    if(!userId){
        return res.status(404).json({message:"user not found"});
    }

    if(req.body.phone){


    if(await userModel.findOne({phone:req.body.phone})){
        return res.status(409).json({message:"phone already exists"});
    }
}

    const newUser = await userModel.findByIdAndUpdate(userId,req.body,{new:true});

    return res.status(200).json({message:"success",user:newUser});
}


export const contact = async(req,res)=>{

    const {email,name,message} = req.body;
    const html = `<div>
    <p>from : ${name}</p>
    <p>${message}</p>
    </div>`;


    if(!email && !name && !message){

        return res.status(400).json({message:"invalid contact info"});

    }
    await sendEmail('tariqshreem00@gmail.com','contact email',html,email);

    return res.status(200).json({message:"success"});

}


export const updateInfo = async(req,res)=>{

    const userId = req.user._id;
    const {password} = req.body;
    const user = await userModel.findById(userId);
    if(!password){
        req.body.password = user.password;
    }else {
        req.body.password = await bcrypt.hash(password,parseInt(process.env.SALT_ROUND));


    }

   const update = await userModel.updateOne({_id:userId},req.body);
    if(!update){

        return res.status(400).json({message:"can't update contact"});
    }

    return res.status(200).json({message:"success"});

}
