import mongoose,{Schema,Types,model} from "mongoose";
const cartSchema = new Schema({
    userId:{
        type:Types.ObjectId,
        ref:'User',
        required:true,
        unique:true,
    },
    type:{
        type:String,
        enum:['borrow','purchase'],
    },

    books:[{
        bookId:{type:Types.ObjectId, required:true,ref:'Book'},
        quantity:{type:Number,default:1,required:true,min:1},
    }]
},{
    timestamps:true
});

const cartModel = mongoose.models.Cart || model('Cart',cartSchema);
export default cartModel;
