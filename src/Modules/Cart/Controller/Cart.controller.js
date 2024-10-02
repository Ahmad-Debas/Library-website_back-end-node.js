import bookModel from "../../../../DB/model/Book.model.js";
import cartModel from "../../../../DB/model/Cart.model.js";
import categoryModel from "../../../../DB/model/Category.model.js";

export const AddToCart = async (req, res) => {

    const { bookId, type } = req.body;

    const book = await bookModel.findById(bookId);
    if (!book) {
        return res.status(404).json({ message: `Book not found` });
    }
    const category = await categoryModel.findById(book.categoryId);
    if (!category.can_borrow) {
        return res.status(400).json({ message: "can't borrow this book" });
    }
    const cart = await cartModel.findOne({ userId: req.user._id });
    if (!cart) {
        const newCart = await cartModel.create({
            userId: req.user._id,
            books: { bookId },
            type
        });

        return res.status(200).json({ message: "success", count: newCart.books.length, cart: newCart })
    }

    if(cart.books.length==0){
        cart.type = type;
        await cart.save();
    }
    for (let i = 0; i < cart.books.length; i++) {
        if (cart.books[i].bookId == bookId) {
            return res.status(409).json({ message: `book already added to cart` });
        }
        if(cart.type != type){
            return res.status(400).json({ message: `this cart for ${cart.type} book` });

        }
    }

    cart.books.push({ bookId })

    await cart.save();

    return res.status(201).json({ message: "success", count: cart.books.length, cart });
}

export const showCart = async (req, res) => {

    const cart = await cartModel.findOne({ userId: req.user._id });
    if (cart) {
        const booksDetails = await Promise.all(
            cart.books.map(async (cartBook) => {
                const book = await bookModel.findById(cartBook.bookId);

                return {
                    ...cartBook.toObject(),
                    details: book.toObject(),
                }
            })
        )
        return res.json({ message: "success", type: cart.type, count: cart.books.length, cart: booksDetails });

    }
}

export const removeItemFromCart = async (req, res) => {

    const { bookId } = req.body;
    const cart = await cartModel.findOneAndUpdate({ userId: req.user._id }, {
        $pull: {
            books: {
                bookId
            }
        }
    }, { new: true })


    return res.status(200).json({ message: "success", count: cart.books.length, cart })
}

export const clear = async (req, res) => {
    await cartModel.updateOne({ userId: req.user._id }, {
        books: []
    })

    return res.status(200).json({ message: "success" })
}

export const updateQuantity = async (req, res) => {
    const { bookId, operation } = req.body;
    const inc = (operation == '+' ? 1 : -1);
    console.log(bookId);
    const cart = await cartModel.findOneAndUpdate({
        userId: req.user._id,
        "books.bookId": bookId
    }, {
        $inc: {
            "books.$.quantity": inc
        }
    }, { new: true });

    return res.json({ message: "success", cart });

}
