import mongoose,{Schema,Types,model} from "mongoose";
const settingSchema = new Schema({
    socialMedia : [
        {
        image:{
            type:Object,
            required:true,
        },
        link:{
            type:String,
            required:true,
        }
    }
],
    createdBy:{type:Types.ObjectId,ref:'User'},
    updatedBy:{type:Types.ObjectId,ref:'User'},

},{
    timestamps:true
});

const settingModel = mongoose.models.Setting || model('Setting',settingSchema);
export default settingModel;
