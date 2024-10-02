import {Router} from 'express';
import * as AdController from './Controller/Ad.controller.js';
import fileUpload, { fileValidation } from '../../Services/multer.js';
import { endPoint } from './Ad.endpoint.js';
import { auth } from '../../Middleware/Auth.middleware.js';
const router = Router();


router.post('/',auth(endPoint.create),fileUpload(fileValidation.image).fields([
    {name:'mainImage',maxCount:1},
]),AdController.create);

router.get('/',auth(endPoint.allAds),AdController.allAds);
router.get('/activeAds',AdController.activeAds);
router.get('/:id',AdController.getAd);

router.put('/:id',auth(endPoint.updateAds),fileUpload(fileValidation.image).fields([
    {name:'mainImage',maxCount:1},
]),AdController.updateAds)

router.delete('/:id',auth(endPoint.deleteAd),AdController.deleteAd);


export default router;
