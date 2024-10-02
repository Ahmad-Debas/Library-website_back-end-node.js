import {Router} from 'express'
import * as cartController from './Controller/Cart.controller.js'
import { auth, roles } from '../../Middleware/Auth.middleware.js';
import { endPoint } from './Cart.endpoint.js';
const router =Router();


router.post('/',auth(endPoint.add),cartController.AddToCart);
router.get('/',auth(endPoint.show),cartController.showCart);
router.patch('/removeItem',auth(endPoint.remove),cartController.removeItemFromCart);
router.patch('/clear',auth(endPoint.remove),cartController.clear);
router.patch('/updateQuantity',auth(endPoint.updateQuantity),cartController.updateQuantity);

export default router;
