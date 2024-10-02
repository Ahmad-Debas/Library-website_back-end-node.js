import {Router} from 'express';
import { auth } from '../../Middleware/Auth.middleware.js';
import { endPoint } from './Delivary.endpoint.js';
import * as delivaryController from './Controller/Delivary.controller.js';
const router =Router();


router.post('/',auth(endPoint.create),delivaryController.create);
router.get('/',delivaryController.get);
router.put('/',delivaryController.update);

export default router;
