import jwt from 'jsonwebtoken';

export const generateToken  = (payload,signature) =>{

    const token = jwt.sign(payload,signature);

    return token;
}

export const verifyToken = (token,signature)=>{

    const decoded = jwt.verify(token,signature);

    return decoded;
}
