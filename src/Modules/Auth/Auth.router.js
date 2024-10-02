import {Router} from 'express';
import * as AuthController from './Controller/Auth.controller.js';
const router = Router();


router.post('/signup',AuthController.signup)
router.get('/confirmEmail/:token',AuthController.confirmEmail);
router.post('/login',AuthController.login);
router.patch('/sendCode',AuthController.sendCode);
router.patch('/forgotPassword',AuthController.forgotPassword);

export default router;
