import policyModel from "../../../../DB/model/Policy.model.js";

export const create = async (req,res)=>{

    req.body.createdBy=req.user._id
    req.body.updatedBy=req.user._id

    const policy = await policyModel.create(req.body);

    if(!policy) {
        return res.status(400).json({message:"error while creating policy"});
    }

    return res.status(201).json({message:"success",policy});

}
export const get = async(req,res)=>{

    const policy = await policyModel.findOne();
    return res.status(200).json({message:"success",policy});
}

export const update = async(req,res)=>{

    const newPolicy = await policyModel.findOneAndUpdate({},req.body,{new:true});

    return res.status(200).json({message:"success",policy:newPolicy});

}


