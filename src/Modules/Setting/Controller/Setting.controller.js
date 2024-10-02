import adModel from "../../../../DB/model/Ad.model.js";
import settingModel from "../../../../DB/model/Setting.model.js";
import cloudinary from "../../../Services/cloudinary.js";

export const create = async(req,res)=>{
    try{
        const {secure_url,public_id}= await cloudinary.uploader.upload(req.files.image[0].path,
            {folder:`${process.env.APP_NAME}/Setting/SocialMedia`})
        req.body.image = {secure_url,public_id};

        const setting = await settingModel.updateMany({
            $push:{
                socialMedia:req.body
            }
        });
        return res.status(201).json({message:"success",setting})

    }catch(error){

        return res.status(500).json({message:"error",error:error.stack});
    }
}

export const getSocialMedia = async(req,res)=>{

    const platforms = await settingModel.findOne({}).select('socialMedia');
    return res.status(200).json({message:"success",platforms:platforms.socialMedia});
}


