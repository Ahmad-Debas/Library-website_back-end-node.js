import {Router} from 'express';
import { auth, roles } from '../../Middleware/Auth.middleware.js';
import { endPoint } from './Review.endpoint.js';
import * as reviewController from './Controller/Review.controller.js';
const router =Router();


router.post('/:bookId',auth(endPoint.create),reviewController.create);

export default router;
