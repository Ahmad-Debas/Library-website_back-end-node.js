import {Router} from 'express';
import * as UserController from './Controller/User.controller.js';
import { auth, roles } from '../../Middleware/Auth.middleware.js';
const router = Router();


router.get('/allUsers',auth(roles.Admin),UserController.getAllUsers);
router.patch('/updateUser/:userId',auth(roles.Admin),UserController.updateUser);
router.get('/admin',auth(roles.Admin),UserController.getAdminData);
router.get('/',UserController.getUsers);
router.get('/token',auth(roles.User),UserController.getUserToken)
router.post('/contact',UserController.contact);
router.get('/:id',UserController.getUser);
router.patch('/updateInfo',auth(roles.User),UserController.updateInfo)


export default router;
