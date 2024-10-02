import mongoose,{Schema,model,Types} from 'mongoose';
const categorySchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    slug:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:'Active',
        enum:['Active','Not_Active'],
    },
    can_borrow:{
        type:Boolean,
        default:true,
    },
    image:{
        type:Object,
        required:true
    },
    createdBy:{type:Types.ObjectId,ref:'User'},
    updatedBy:{type:Types.ObjectId,ref:'User'},
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
});

categorySchema.virtual('books',{
    localField:'_id',
    ref:'Book',
    foreignField:'categoryId'
})
const categoryModel = mongoose.models.Category || model('Category',categorySchema);

export default categoryModel;
