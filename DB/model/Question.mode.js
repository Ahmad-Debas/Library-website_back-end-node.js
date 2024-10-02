import mongoose, {Schema,model,Types} from 'mongoose';
const questionSchema = new Schema({
    question:{
        type:String,
        required:true,
    },
    answer:{
        type:String,
        required:true,
    },
    createdBy:{type:Types.ObjectId,ref:'User',required:true},
    updatedBy:{type:Types.ObjectId,ref:'User',required:true},


},{timestamps:true});
const QuestionModel = mongoose.models.Question || model('Question',questionSchema);
export default QuestionModel;
