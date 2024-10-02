import slugify from "slugify";
import categoryModel from "../../../../DB/model/Category.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import bookModel from "../../../../DB/model/Book.model.js";
import { pagination } from "../../../Services/pagination.js";
import { query } from "express";
import orderModel from "../../../../DB/model/Order.model.js";
import userModel from "../../../../DB/model/User.model.js";

export const createBook = async (req, res) => {
  try {
    let {
      name,
      price,
      discount,
      categoryId,
    } = req.body;

    const checkCategory = await categoryModel.findOne({ _id: categoryId });
    if (!checkCategory) {
      return res.status(404).json({ message: "category not found" });
    }
    req.body.slug = slugify(name);
    req.body.finalPrice = price - price * ((discount || 0) / 100);
    req.body.hardCopyPrice = req.body.finalPrice;
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.files.mainImage[0].path,
      { folder: `${process.env.APP_NAME}/Books` }
    );
    req.body.mainImage = { secure_url, public_id };
    (req.body.createdBy = req.user._id), (req.body.updatedBy = req.user._id);

    if(req.files.pdf){
        const { secure_url, public_id } = await cloudinary.uploader.upload(
            req.files.pdf[0].path,
            { folder: `${process.env.APP_NAME}/Books/pdf/${req.body.name}` }
          );

          req.body.pdf = {secure_url, public_id}
    }
    const book = await bookModel.create(req.body);

    if (!book) {
      return res.status(400).json({ message: "fail to create book" });
    }

    return res.status(201).json({ message: "success", book });
  } catch (error) {
    return res.status(500).json({ message: "catch error", error: error.stack });
  }
};
export const getBooks = async (req, res) => {
  const books = await bookModel
    .find({ deleted: false })
    .sort({ _id: -1 })
    .limit(10).populate('reviews');
  return res.status(200).json({ message: "success", books });
};

export const allBooks = async (req, res) => {
  const {skip,limit } = pagination(req.query.page, req.query.limit);
  let queryObj = { ...req.query };
  const execludeQuery = ["page", "size", "limit", "sort", "search","fields"];

  execludeQuery.map((ele) => {
    delete queryObj[ele];
  });

  queryObj = JSON.stringify(queryObj);
  queryObj = queryObj.replace(
    /\b(gt|gte|lt|lte|in|nin|eq|neq)\b/g,
    (match) => `$${match}`
  );
  queryObj = JSON.parse(queryObj);
  let mongooseQuery = bookModel.find(queryObj).limit(limit).skip(skip);
  if (req.query.sort) {
    mongooseQuery = mongooseQuery.sort(req.query.sort.replaceAll(",", " "));
  }

  if (req.query.search) {
    mongooseQuery.find({
      $or: [

        {name: { $regex: req.query.search, $options: "i" }},
        {author: { $regex: req.query.search, $options: "i" }},

      ],
    });
  }

  if(req.query.fields){

      mongooseQuery.select(req.query.fields.replaceAll(","," "));
  }
  const books = await mongooseQuery.populate('reviews');

  const total = await bookModel.estimatedDocumentCount();
  return res
    .status(200)
    .json({ message: "success", count: books.length, total, books });
};

export const getBook = async (req, res) => {
  let book = await bookModel.findById(req.params.id).populate({
    path:'reviews',
    populate:{
        path:'userId',
    }
  });

    let calcRating = 0;
    for(let i=0;i<book.reviews.length;i++){
        calcRating+=book.reviews[i].rating;
    }
    let avgRating = calcRating / book.reviews.length;
    book = book.toObject();
    book.avgRating = avgRating;


  if (!book) {
    return res.status(404).json({ message: "book not found" });
  }

  return res.status(200).json({ message: "success", book });
};



export const deleteBook = async(req,res)=>{
    try{

        const {id} = req.params;
        const book = await bookModel.findByIdAndDelete(id);
        if(!book){
            return res.status(400).json({message:"fail to delete book "});

        }
       await cloudinary.uploader.destroy(book.mainImage.public_id)

        return res.json({message:"success",book});

    }catch(error){
        return res.status(500).json({message:"error",error:error.stack});
    }
}


export const update = async(req,res)=>{
    const {id} = req.params;
    const { price, discount } = req.body;
    req.body.slug = slugify(req.body.name);

    req.body.finalPrice = price - (price * (discount || 0)) / 100;
    let book  = await bookModel.findById(id);
    if(!book){
        return res.status(404).json({message:"book not found"});
    }



    if(req.files.mainImage){


        const { secure_url, public_id } = await cloudinary.uploader.upload(
            req.files.mainImage[0].path,
            { folder: `${process.env.APP_NAME}/Books` }
          );

          req.body.mainImage = { secure_url, public_id };

          cloudinary.uploader.destroy(book.mainImage.public_id);
    }else {
        req.body.mainImage = book.mainImage
    }


    req.body.updatedBy = req.user._id;

   book  = await bookModel.findByIdAndUpdate(id,req.body,{new:true});


return res.json({message:"success",book});





}




