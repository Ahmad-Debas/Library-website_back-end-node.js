import mongoose,{Schema,Types,model} from "mongoose";
const adSchema = new Schema({
    position :{
        type:Number,
        unique:true,
    },
    url:{
        type:String,
    },
    image:{type:Object},

    status:{
        type:String,
        default:'Active',
        enum:['Active','Not_Active'],
    },

    createdBy:{type:Types.ObjectId,ref:'User'},
    updatedBy:{type:Types.ObjectId,ref:'User'},

},{
    timestamps:true
});

const adModel = mongoose.models.Ad || model('Ad',adSchema);
export default adModel;
