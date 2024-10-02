import mongoose, {Schema,model,Types} from 'mongoose';
const policySchema = new Schema({

    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    createdBy:{type:Types.ObjectId,ref:'User',required:true},
    updatedBy:{type:Types.ObjectId,ref:'User',required:true},


},{timestamps:true});
const policyModel = mongoose.models.Policy || model('Policy',policySchema);
export default policyModel;
