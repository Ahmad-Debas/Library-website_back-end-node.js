import adModel from "../../../../DB/model/Ad.model.js";
import settingModel from "../../../../DB/model/Setting.model.js";
import sliderModel from "../../../../DB/model/Slider.model.js";
import cloudinary from "../../../Services/cloudinary.js";


export const create = async(req,res)=>{


    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,
        {folder:`${process.env.APP_NAME}/sliders`});


    req.body.image = {secure_url,public_id};
    req.body.createdBy = req.user._id;
    req.body.updatedBy = req.user._id;

    const slider = await sliderModel.create(req.body);

    return res.status(201).json({message:"success",slider});
}

export const getAll = async(req,res)=>{
    const sliders = await sliderModel.find({});
    return res.status(200).json({message:"success",count:sliders.length,sliders});
}

export const getActive = async(req,res)=>{

    const sliders = await sliderModel.find({status:'Active'});

    return res.status(200).json({message:"success",count:sliders.length,sliders});
}



export const deleteSlider = async(req,res)=>{
    try{

        const {id} = req.params;
        const slider = await sliderModel.findByIdAndDelete(id);
        if(!slider){
            return res.status(400).json({message:"fail to delete image "});

        }
       await cloudinary.uploader.destroy(slider.image.public_id)

        return res.json({message:"success",slider});

    }catch(error){
        return res.status(500).json({message:"error",error:error.stack});
    }
}



export const getSlide = async(req,res)=>{
    try{

        const {id} = req.params;
        const slide = await sliderModel.findById(id);
        return res.status(200).json({message:"success",slide});

    }
    catch(err){
        return res.status(500).json({message:"catch error",error:err.stack})
    }
}

export const update= async(req,res)=>{
    try{

        const {id} = req.params;

        const slider = await sliderModel.findById(id);
        if(!slider){
            return res.status(400).json({message:"image not found"});
        }

            if(req.file){
            const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/sliders`})
             req.body.image = {secure_url,public_id};
             cloudinary.uploader.destroy(slider.image.public_id);
        }else {
            req.body.image = slider.image
        }

        const newSlide = await sliderModel.findByIdAndUpdate(id,req.body,{new:true});

        return res.status(200).json({message:"success",newSlide});
    }catch(error){
        return res.status(500).json({message:"catch error",error:error.stack});
    }
    }
