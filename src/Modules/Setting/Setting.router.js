import {Router} from 'express';
import * as SettingController from './Controller/Setting.controller.js';
import fileUpload, { fileValidation } from '../../Services/multer.js';
import { endPoint } from './Setting.endpoint.js';
import { auth } from '../../Middleware/Auth.middleware.js';
const router = Router();


router.post('/',auth(endPoint.create),fileUpload(fileValidation.image).fields([
    {name:'image',maxCount:1},
]),SettingController.create);

router.get('/',SettingController.getSocialMedia)

// router.get('/',auth(endPoint.allAds),AdController.allAds);
// router.get('/activeAds',AdController.activeAds);
// router.get('/:id',AdController.getAd);

// router.put('/:id',auth(endPoint.updateAds),fileUpload(fileValidation.image).fields([
//     {name:'mainImage',maxCount:1},
// ]),AdController.updateAds)

// router.delete('/:id',auth(endPoint.deleteAd),AdController.deleteAd);


export default router;
