import {Router} from 'express';
import * as PolicyController from './Controller/Policy.controller.js';
import { auth } from '../../Middleware/Auth.middleware.js';
import { endPoint } from './Policy.endpint.js';
const router = Router();


router.post('/',auth(endPoint.create),PolicyController.create);
router.get('/',PolicyController.get);
router.patch('/',auth(endPoint.update),PolicyController.update);


export default router;
