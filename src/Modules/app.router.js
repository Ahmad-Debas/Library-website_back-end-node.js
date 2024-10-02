import connectDB from '../../DB/connection.js';
import AuthRouter from './Auth/Auth.router.js';
import AdRouter from './Ad/Ad.router.js';
import CategoryRouter from './Category/Category.router.js';
import BookRouter from './Book/Book.router.js';
import UserRouter from './User/User.router.js';
import CartRouter from './Cart/Cart.router.js';
import SettingRouter from './Setting/Setting.router.js';
import SliderRouter from './Slider/Slider.router.js';
import OrderRouter from './Order/Order.router.js';
import PolicyRouter from './Policy/Policy.router.js';
import DelivaryRouter from './Delivary/Delivary.router.js';
import ReviewRouter from './Review/Review.router.js';
import QuestionRouter from './Question/Question.router.js';
import cors from 'cors';
import sendReminderEmail from '../Services/reminder.js';
import cron from 'node-cron';
const initApp = (app,express)=>{
    connectDB();
    const corsOptions = {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
      };

    app.use(cors(corsOptions));
    app.use(express.json());
    cron.schedule('0 8 * * *', async () => {
        await sendReminderEmail();
    }, {
        scheduled: true,
        timezone: 'Asia/Hebron',
    });
    app.get('/',(req,res)=>{
        return res.status(200).json({message:"welcome ..."});
    });
    app.use('/auth',AuthRouter);
    app.use('/ad',AdRouter);
    app.use('/category',CategoryRouter);
    app.use('/book',BookRouter);
    app.use('/user',UserRouter);
    app.use('/cart',CartRouter);
    app.use('/setting',SettingRouter);
    app.use('/slider',SliderRouter);
    app.use('/order',OrderRouter);
    app.use('/policy',PolicyRouter);
    app.use('/delivary',DelivaryRouter);
    app.use('/review',ReviewRouter);
    app.use('/question',QuestionRouter);




    app.use('*',(req,res)=>{
        return res.status(404).json({message:"page not found"});
    });

}

export default initApp;
