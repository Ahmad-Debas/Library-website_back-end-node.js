import mongoose ,{Schema,model,Types} from 'mongoose'
const orderSchema = new Schema({
    userId:{
        type:Types.ObjectId,ref:'User',required:true,
    },
    books:[{
      name:{type:String},
      bookId:{type:Types.ObjectId,ref:'Book',required:true},
      quantity:{type:Number,default:1,required:true},
      unitPrice:{type:Number,required:true},
      finalPrice:{type:Number,required:true},
    }],
    finalPrice:{
        type:Number,required:true
    },
    address:{type:String,required:true},
    phone:{type:String,required:true},
    paymentType:{
        type:String,
        default:'cash',
        enum:['cash','card'],
    },
    status:{
        type:String,
        default:'pending',
        enum:['pending','cancelled','confirmed','onWay','deliverd','return'],
    },
    reasonRejected:{tppe:String},
    note:{type:String},
    duration:{
        type:Number
    },
    type:{
        type:String,
        enum:['borrow','purchase'],
    },
},{
    timestamps:true
})
const orderModel = mongoose.models.Order || model('Order',orderSchema);
export default orderModel;
