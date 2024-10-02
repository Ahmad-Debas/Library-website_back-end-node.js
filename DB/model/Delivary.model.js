import mongoose,{Types,Schema,model} from "mongoose";

const delivarySchema = new Schema({
    price:{
        type:Number,
        required:true,
    },
    discount:{
        type:Number,
        default:0,
    },
    finalPrice:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        default:'Active',
        enum:['Active','Not_Active'],
    },

},{
    timestamps:true
})



const delivaryModel = mongoose.models.Delivary || model('Delivary',delivarySchema);
export default delivaryModel;
