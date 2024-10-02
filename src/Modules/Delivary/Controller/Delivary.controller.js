import delivaryModel from "../../../../DB/model/Delivary.model.js";
export const create = async(req,res)=>{


    req.body.finalPrice =  req.body.price -  req.body.price * (( req.body.discount || 0) / 100);
    const delivary = await delivaryModel.create(req.body);
    return res.status(201).json({message:"success",delivary});
}

export const get = async(req,res)=>{

    const delivary = await delivaryModel.findOne();

    return res.status(200).json({message:"success",delivary});
}

export const update = async(req,res)=>{

    req.body.finalPrice =  req.body.price -  req.body.price * (( req.body.discount || 0) / 100);
    await delivaryModel.updateMany(req.body);
    return res.status(200).json({message:"success"});

}
