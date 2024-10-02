import slugify  from 'slugify'
;
import categoryModel from '../../../DB/model/Category.model.js';
import cloudinary from '../../Services/cloudinary.js';
export const createCategory = async(req,res)=>{
try{
    const name = req.body.name.toLowerCase();
    const {secure_url,public_id}= await cloudinary.uploader.upload(req.files.mainImage[0].path,{folder:`${process.env.APP_NAME}/Category`})
    const catagory = await categoryModel.create({name,slug:slugify(name),image:{secure_url,public_id}})
    return res.status(201).json({message:"success",catagory});
}catch(err){
    return res.status(500).json({message:"catch error",error:err.stack});
}
}

export const getCategories = async(req,res)=>{
    try{

        const category = await categoryModel.find({});
        return res.status(200).json({message:"success",category});

    }
    catch(err){
        return res.status(500).json({message:"catch error",error:err.stack})
    }
}


export const getCategory = async(req,res)=>{
    try{

        const {id} = req.params;
        const category = await categoryModel.findById(id).populate('books');
        return res.status(200).json({message:"success",category});

    }
    catch(err){
        return res.status(500).json({message:"catch error",error:err.stack})
    }
}
export const getActiveCategories=async(req,res)=>{
    try{

        const category = await categoryModel.find({status:'Active'});
        return res.status(200).json({message:"success",category});

    }
    catch(err){
        return res.status(500).json({message:"catch error",error:err.stack})
    }

}

export const updateCategory = async(req,res)=>{
try{

    const category = await categoryModel.findById(req.params.categoryId);
    if(!category){
        return res.status(404).json({message:"category not found"});
    }

   if(req.body.name){
     if(category.name==req.body.name && req.params.categoryId!=category.id){

        return res.status(409).json({message:"old name match new name"});
     }


     if(  await categoryModel.findOne({name:req.body.name}) && req.params.categoryId!=category.id   ){
        return res.status(409).json({message:`category name ${req.body.name} already exists`});
     }

     category.name = req.body.name;
     category.slug = slugify(req.body.name);
   }

   if(req.body.status){


     category.status = req.body.status;
   }


   if(req.body.can_borrow=='true' || req.body.can_borrow=='false'){


       category.can_borrow=req.body.can_borrow;

    }

   if(req.files.mainImage){
    const {secure_url,public_id}= await cloudinary.uploader.upload(req.files.mainImage[0].path,{folder:`${process.env.APP_NAME}/Category`})
    await cloudinary.uploader.destroy(category.image.public_id)
    category.image={secure_url,public_id}
}
await category.save();

return res.status(200).json({message:"success",category});
}catch(error){
    return res.status(500).json({message:"error",error:error.stack});
}
}

export const deleteCategory = async(req,res)=>{
try{

    const {categoryId} = req.params;
    const category = await categoryModel.findByIdAndDelete(categoryId);
    if(!categoryId){
        return res.status(400).json({message:"fail to delete category "});

    }
   await cloudinary.uploader.destroy(category.image.public_id)

    return res.json({message:"success",category});

}catch(error){
    return res.status(500).json({message:"error",error:error.stack});
}
}
