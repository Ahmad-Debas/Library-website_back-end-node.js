import adModel from "../../../../DB/model/Ad.model.js";
import cloudinary from "../../../Services/cloudinary.js";

export const create = async(req,res)=>{
try{
 const {secure_url,public_id}= await cloudinary.uploader.upload(req.files.mainImage[0].path,{folder:`${process.env.APP_NAME}/Ad`})
 req.body.image = {secure_url,public_id};
 const ad = await adModel.create(req.body);
 if(!ad){
    return res.status(400).json({message:"fail to create ad"});
 }
 return res.status(201).json({message:"success"});
}catch(error){

    return res.status(500).json({message:'catch error',error:error.stack});
}
}
export const allAds = async(req,res)=>{
    const ads = await adModel.find({});
    return res.status(200).json({message:'success',ads});
}
export const activeAds = async(req,res)=>{
    const ads = await adModel.find({status:"Active"});
    return res.status(200).json({message:'success',ads});
}

export const updateAds = async(req,res)=>{
try{

    const {id} = req.params;

    const ad = await adModel.findById(id);
    if(!ad){
        return res.status(400).json({message:"ad not found"});
    }

    if(req.files.mainImage ){

        const {secure_url,public_id}= await cloudinary.uploader.upload(req.files.mainImage[0].path,{folder:`${process.env.APP_NAME}/Ad`})
         req.body.image = {secure_url,public_id};
         cloudinary.uploader.destroy(ad.image.public_id);
    }
    const newAd = await adModel.findByIdAndUpdate(id,req.body,{new:true});
  
    return res.status(200).json({message:"success",newAd});
}catch(error){
    return res.status(500).json({message:"catch error",error:error.stack});
}
}


export const getAd = async(req,res)=>{
    try{

        const {id} = req.params;
        const ad = await adModel.findById(id);
        return res.status(200).json({message:"success",ad});

    }
    catch(err){
        return res.status(500).json({message:"catch error",error:err.stack})
    }
}

export const deleteAd = async(req,res)=>{
    const {id} = req.params;
    const ad = await adModel.findById(id);
    if(!ad){
        return res.status(400).json({message:"ad not found"});
    }

    if(!await adModel.findByIdAndDelete(id)){
        return res.status(400).json({message:"fail to delete ad "});
    }

    cloudinary.uploader.destroy(ad.image.public_id);
    return res.status(200).json({message:"success"});




}

