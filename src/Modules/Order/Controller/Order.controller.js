import bookModel from "../../../../DB/model/Book.model.js";
import cartModel from "../../../../DB/model/Cart.model.js";
import delivaryModel from "../../../../DB/model/Delivary.model.js";
import orderModel from "../../../../DB/model/Order.model.js";
import userModel from "../../../../DB/model/User.model.js";
import paypal from 'paypal-rest-sdk';
paypal.configure({
    'mode': "sandbox",
    'client_id':"AWouyjEhFeytnaeTx304E042sjiIa4V5MU_FaoeCNWY850cSWpDGVi-rM3tecP7GxgRfx_WiA0mSz0vN",
    'client_secret': "EOJ6xQSvRa-rGlG5nAL8kAv8LRSkBZa1Oz9WtqcRFEYYLQ-YVBNH1u6MXgZdme9TXSlJRssi-icnyp8A",
  });

export const create = async(req,res)=>{
try{
    const {type} = req.body.type;
        if(await orderModel.findOne({status:'pending',userId:req.user._id})){
        return res.status(409).json({message:"can't create order now,you have panding order"});
        }

    const user = await userModel.findById(req.user._id);
    if(type=='borrow'){


    if(user.numberBook == 2){
        return res.status(400).json({message:"can't add a new order"});
    }
}
    const cart = await cartModel.findOne({userId:req.user._id});
    if(!cart || cart.books.length == 0){
        return res.status(404).json({message:`cart is empty`});
    }
    req.body.books = cart.books;

    if(user.numberBook + req.body.books.length > 2){
        return res.status(400).json({message:"can't add a new order"});
    }


    let subTotals = 0;
    let finalBookList = [];
    for(let book of req.body.books){
        const checkBook = await bookModel.findOne({
            _id:book.bookId,
            stock:{$gte:book.quantity}
        })

        if(!checkBook){
            return res.status(400).json({message:"book quantity not available"});
        }
        book = book.toObject();
        book.name = checkBook.name;
        book.discount=checkBook.discout;
        book.unitPrice = checkBook.price;

        book.finalPrice = book.quantity * (cart.type=='borrow'?checkBook.finalPrice:checkBook.hardCopyPrice);

        subTotals+=book.finalPrice;
        finalBookList.push(book);
    }

    if(!req.body.address || !req.body.phone){
        const user = await userModel.findById(req.user._id);
        if(!req.body.address){
            req.body.address = user.address;
        }
        if(!req.body.phone){
            req.body.phone = user.phone;
        }
    }


    const delivaryPrice = await delivaryModel.findOne().select("finalPrice");

    if (req.body.paymentType === 'card') {
        try {
            const create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": "http://localhost:3000/order/success",
                    "cancel_url": "http://localhost:3000/order/cancel"
                },
                "transactions": [{
                    "amount": {
                        "currency": "USD",
                        "total": subTotals + delivaryPrice.finalPrice
                    },
                    "description": "This is the payment description."
                }]
            };

            paypal.payment.create(create_payment_json,function(error,payment){
                if(error){
                    throw error;
                }else{
                   for(let i=0;i<payment.links.length;i++){
                    if(payment.links[i].rel === 'approval_url'){
                        console.log(payment.links[i].href);
                       return res.redirect(payment.links[i].href);
                    }
                   }
                }
            })


        } catch (error) {
            console.error("Error creating PayPal payment:", error);

            // يمكنك التعامل مع الخطأ هنا وإرسال رسالة تنبيه إلى المستخدم
           return res.status(500).send("حدث خطأ أثناء محاولة الدفع. يرجى المحاولة مرة أخرى.");
        }
    }
    const order = await orderModel.create({
        userId: req.user._id,
        books:finalBookList,
        finalPrice:subTotals + delivaryPrice.finalPrice,
        address: req.body.address,
        phone:req.body.phone,
        note:req.body.note,
        paymentType:req.body.paymentType,
        type:type,
    });

    if(!order){
        return res.status(404).json({message:"error while creating order"});
    }

    for(const book of req.body.books){
        await bookModel.findByIdAndUpdate({_id:book.bookId},
            {$inc:{
                stock:-book.quantity
            },
            $inc:{
                numberBorrow:1,
            }
        })
    }

    await cartModel.findOneAndUpdate({userId:req.user._id},{
        books:[]
    })

    if(type=='borrow'){
        await userModel.findOneAndUpdate(
        { _id: req.user._id },
        { $inc: { numberBook: order.books.length } }
      );
        }

    return res.json({message:"success",order});
}
catch(error){
    return res.status(500).json({message:"error",error:error.stack});
}
}

export const getOrders = async(req,res)=>{

    const orders = await orderModel.find({userId:req.user._id}).populate('books.bookId');;

    return res.status(200).json({message:"success",orders});
}

export const cancel = async(req,res)=>{

    const order = await orderModel.findOneAndUpdate({_id:req.params.id,status:'pending'},{status:'cancelled',note:req.body.note},{new:true});
    if(!order){
        return res.status(400).json({message:"can't cancel this order"});
    }


    for(const book of order.books){
        await bookModel.findByIdAndUpdate({_id:book.bookId},
            {$inc:{
                stock:book.quantity
            },
            $inc:{
                numberBorrow:-1,
            }
        })
    }

    return res.status(200).json({message:"success"})
}

export const allOrders = async(req,res)=>{

    const orders = await orderModel.find({}).populate('userId');
    return res.status(200).json({message:"success",orders});

}
export const changeStatus = async(req,res)=>{

    const {orderId} = req.params;

    const order =await orderModel.findById(orderId);
    if(!order){
        return res.status(404).json({message:"order not found"});
    }

    if(order.status=='cancelled'){
        return res.status(400).json({message:"this order has been cancelled"});
    }

    const newOrder = await orderModel.findByIdAndUpdate(orderId,{status:req.body.status},{new:true})


    if(newOrder.status=='cancelled'){
        for(const book of order.books){
            await bookModel.findByIdAndUpdate({_id:book.bookId},
                {$inc:{
                    stock:book.quantity
                },
                $inc:{
                    numberBorrow:-1,
                }
            })
        }
    }


    if (newOrder.status == 'return') {

        for (const book of newOrder.books) {
            const { bookId, quantity } = book;
            await bookModel.findByIdAndUpdate(bookId, {
                $inc: {
                    stock: quantity
                }
            });
        }


        await userModel.findByIdAndUpdate(newOrder.userId, {
            $inc: {
                numberBook: -newOrder.books.length
            },
        });


        return res.json(newOrder);
    }

    return res.status(200).json({message:"success",order:newOrder});

}

export const getOrder = async(req,res)=>{

    const order = await orderModel.findOne({_id:req.params.orderId,status:'pending'});
    return res.status(200).json({message:"success",order});

}

export const getPendingOrder = async(req,res)=>{

    const order = await orderModel.findOne({status:'pending',userId:req.user._id});
    return res.status(200).json({message:"success",order});

}
export const userOrder = async(req,res)=>{

    const order = await orderModel.findOne({status:'deliverd',userId:req.params.userId}).populate('userId');
    return res.status(200).json({message:"success",order});

}

export const addDuration = async(req,res)=>{

    const {duration} = req.body;
    const order = await orderModel.findByIdAndUpdate(req.params.orderId,{duration});
    return res.status(200).json({message:"success",order});

}



//reports

export const calculateTotalProfit = async (req, res) => {
    try {
        const totalProfitAggregate = await orderModel.aggregate([
            {
                $match: {
                    status: "deliverd" // تحديد الطلبيات التي تم تسليمها
                }
            },
            {
                $group: {
                    _id: null,
                    totalProfit: { $sum: "$finalPrice" }
                }
            }
        ]);

        // التحقق مما إذا كانت هناك نتائج للأرباح
        if (totalProfitAggregate.length > 0) {
            const totalProfit = totalProfitAggregate[0].totalProfit;
            return res.json({ totalProfit });
        } else {
            return res.json({ totalProfit: 0 }); // في حالة عدم وجود أي بيانات للطلبيات
        }
    } catch (error) {
        console.error("Error calculating total profit:", error);
        return res.status(500).json({ error: "حدث خطأ أثناء حساب الأرباح الإجمالية" });
    }
};


export const getUserOrdersCount = async (req, res) => {
    try {
        const userOrdersCount = await orderModel.aggregate([
            {
                $group: {
                    _id: "$userId",
                    totalOrders: { $sum: 1 },
                    borrowOrders: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "borrow"] }, 1, 0]
                        }
                    },
                    purchaseOrders: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "purchase"] }, 1, 0]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "users", // اسم الموديل الخاص بالمستخدمين
                    localField: "_id",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            {
                $project: {
                    _id: 0,
                    userId: "$_id",
                    totalOrders: 1,
                    borrowOrders: 1,
                    purchaseOrders: 1,
                    user: {
                        $arrayElemAt: ["$userData", 0]
                    }
                }
            }
        ]);

        return res.json({ userOrdersCount });
    } catch (error) {
        console.error("Error getting user orders count:", error);
        return res.status(500).json({ error: "حدث خطأ أثناء جلب بيانات الطلبات للمستخدمين" });
    }
};
export const getBookOrderStatistics = async (req, res) => {
    try {
        const bookOrderStatistics = await bookModel.aggregate([
            {
                $lookup: {
                    from: "orders",
                    localField: "_id",
                    foreignField: "books.bookId",
                    as: "orders"
                }
            },
            {
                $unwind: "$orders"
            },
            {
                $group: {
                    _id: {
                        bookId: "$_id",
                        bookName: "$name",
                        orderType: "$orders.type"
                    },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    bookId: "$_id.bookId",
                    bookName: "$_id.bookName",
                    orderType: "$_id.orderType",
                    orderCount: 1
                }
            }
        ]);

        return res.json({ bookOrderStatistics });
    } catch (error) {
        console.error("Error getting book order statistics:", error);
        return res.status(500).json({ error: "حدث خطأ أثناء جلب بيانات طلبات الكتب" });
    }
};

