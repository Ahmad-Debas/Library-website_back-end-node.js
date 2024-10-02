import mongoose,{Types,Schema,model} from "mongoose";

const bookSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    slug:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
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
    mainImage:{
        type:Object,
        required:true,
    },
    stock:{
        type:Number,
        required:true,
    },
    deleted:{
        type:Boolean,
        default:false,
    },
    author:{type:String,required:true},
    notes:{
        type:String,
    },
    hardCopy:{
        type:Boolean,
        default:false,
    },
    hardCopyPrice:{
        type:Number,
    },
    pdf:{
        type:Object,
    },
    numberBorrow:{type:Number,default:0},
    categoryId:{type:Types.ObjectId,ref:'Category',required:true},
    createdBy:{type:Types.ObjectId,ref:'User',required:true},
    updatedBy:{type:Types.ObjectId,ref:'User',required:true},

},{
    timestamps:true,
    toJSON:{virtuals:true},
toObject:{virtuals:true},
})


bookSchema.virtual('reviews',{
    localField:'_id',
    ref:'Review',
    foreignField:'bookId'
})

const bookModel = mongoose.models.Book || model('Book',bookSchema);
export default bookModel;
