import jwt from 'jsonwebtoken'
import userModel from '../../DB/model/User.model.js';
export const roles = {
    Admin:'Admin',
    User:'User',
}
export const auth=(accessRoles= [])=>{
    return async(req,res,next)=>{
        try{
        const {authorization} = req.headers;
        if(!authorization.startsWith(process.env.BEARERKEY)){
            return res.status(400).json({message:"invalid token"});
        }
        const token = authorization.split(process.env.BEARERKEY)[1];
        if(!token){
            return res.status(400).json({message:"invalid token"});
        }
        const decoded = jwt.verify(token,process.env.LOGINTOKEN);
        const user = await userModel.findById(decoded.id).select("userName email role");
        if(!user){
            return res.status(401).json({message:"not register user"});
        }
        if(!accessRoles.includes(user.role)){
            return res.status(403).json({message:"not authorized user"});
        }
        req.user=user;

        return next();
    }catch(error){
        return res.status(500).json({message:"catch error",error:error.stack});
    }
}
}
