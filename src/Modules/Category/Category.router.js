import {Router } from 'express';
import * as categoryController from './Category.controller.js';
import fileUpload, { fileValidation } from '../../Services/multer.js';
const router = Router();

router.post('/',fileUpload(fileValidation.image).fields([
    {name:'mainImage',maxCount:1},
]),categoryController.createCategory);

router.get('/',categoryController.getCategories);

router.get('/active',categoryController.getActiveCategories);
router.get('/:id',categoryController.getCategory);


router.put('/:categoryId',
fileUpload(fileValidation.image).fields([
    {name:'mainImage',maxCount:1},
]),categoryController.updateCategory);

router.delete('/:categoryId',categoryController.deleteCategory);
export default router;
