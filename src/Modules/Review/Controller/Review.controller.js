import bookModel from "../../../../DB/model/Book.model.js";
import cartModel from "../../../../DB/model/Cart.model.js";
import delivaryModel from "../../../../DB/model/Delivary.model.js";
import orderModel from "../../../../DB/model/Order.model.js";
import reviewModel from "../../../../DB/model/Review.model.js";
import userModel from "../../../../DB/model/User.model.js";


export const create = async(req,res)=>{

    const {content,rating} = req.body;
    const {bookId} = req.params;

    const book =await  bookModel.findById(bookId);
    if(!book){
        return res.status(404).json({message:"book not found"});
    }

    const review = await reviewModel.create({
        content,rating,userId:req.user._id,bookId
    });

    if(!review){
        return res.status(400).json({message:"error while creating review"});
    }

    return res.status(201).json({message:"success"});
}
