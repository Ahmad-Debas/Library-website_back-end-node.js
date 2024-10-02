import {Router} from 'express';
import { auth } from '../../Middleware/Auth.middleware.js';
import { endPoint } from './Order.endpoint.js';
import * as orderController from './Controller/Order.controller.js';
const router =Router();


router.post('/',auth(endPoint.create),orderController.create);
router.get('/allOrders',auth(endPoint.allOrders),orderController.allOrders);
router.get('/calculateTotalProfit',auth(endPoint.admin),orderController.calculateTotalProfit);
router.get('/getUserOrdersCount',auth(endPoint.admin),orderController.getUserOrdersCount);
router.get('/getOrderStatistics',auth(endPoint.admin),orderController.getBookOrderStatistics);



router.get('/pendingOrder',auth(endPoint.getPendingOrder),orderController.getPendingOrder);
router.get('/',auth(endPoint.getOrders),orderController.getOrders);
router.patch('/cancel/:id',auth(endPoint.cancel),orderController.cancel);
router.get('/:orderId',auth(endPoint.getOrder),orderController.getOrder);
router.patch('/changeStatus/:orderId',auth(endPoint.changeStatus),orderController.changeStatus);

router.get('/userOrder/:userId',auth(endPoint.userOrders),orderController.userOrder);

router.patch('/addDuration/:orderId',auth(endPoint.addDuration),orderController.addDuration),


router.get('/success',(req,res)=>{
    return res.json("ok");
})
router.get('/cancel',(req,res)=>{
    return res.json("cancel");
})

export default router;
