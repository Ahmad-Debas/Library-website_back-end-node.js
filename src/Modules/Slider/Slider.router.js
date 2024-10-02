import {Router} from 'express';
import * as SliderController from './Controller/Slider.controller.js';
import fileUpload, { fileValidation } from '../../Services/multer.js';
import { endPoint } from './Slider.endpoint.js';
import { auth } from '../../Middleware/Auth.middleware.js';
const router = Router();


router.post('/',auth(endPoint.create),fileUpload(fileValidation.image).single('image'),SliderController.create);
router.get('/',auth(endPoint.getAll),SliderController.getAll);
router.get('/active',SliderController.getActive);
router.delete('/:id',auth(endPoint.delete),SliderController.deleteSlider);
router.get('/details/:id',SliderController.getSlide);
router.patch('/:id',auth(endPoint.update),fileUpload(fileValidation.image).single('image'),SliderController.update);

export default router;
