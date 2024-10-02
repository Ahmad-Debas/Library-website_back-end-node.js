import mongoose,{Schema,model,Types} from 'mongoose';
const sliderSchema = new Schema({

    image:{
        type:Object,
        required:true
    },

    link :{
        type:String,
    },
    status:{
        type:String,
        default:'Active',
        enum:['Active','Not_Active'],
    },


    createdBy:{type:Types.ObjectId,ref:'User'},
    updatedBy:{type:Types.ObjectId,ref:'User'},
},
{
   timestamps:true,
});

const sliderModel = mongoose.models.Slider || model('Slider',sliderSchema);

export default sliderModel;
