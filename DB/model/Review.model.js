import mongoose,{Schema,model,Types} from 'mongoose';
const reviewSchema = new Schema({
    content:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,required:true,min:1,max:5,
    },
    userId:{type:Types.ObjectId,ref:'User',required:true},
    bookId:{type:Types.ObjectId,ref:'Book',required:true},
},
{
    timestamps:true,
   
});


const reviewModel = mongoose.models.Review || model('Review',reviewSchema);

export default reviewModel;
