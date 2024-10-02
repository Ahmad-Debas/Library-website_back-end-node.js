import {Router} from 'express';
import { endPoint } from './Book.endpoint.js';
import fileUpload, { fileValidation } from '../../Services/multer.js';
import * as bookController from './Controller/Book.controller.js'
import { auth } from '../../Middleware/Auth.middleware.js';
const router =Router();


router.post('/',auth(endPoint.create),fileUpload(fileValidation.imgAndPdf).fields([
    {name:'mainImage',maxCount:1},
    {name:'pdf',maxCount:1},
]),bookController.createBook);

router.get('/',bookController.getBooks);
// router.get('/activeAds',AdController.activeBooks);
router.get('/all',bookController.allBooks);
router.get('/:id',bookController.getBook);
router.delete('/:id',auth(endPoint.delete),bookController.deleteBook);
router.put('/:id',auth(endPoint.update),fileUpload(fileValidation.image).fields([
    {name:'mainImage',maxCount:1},
]),bookController.update);


export default router;
