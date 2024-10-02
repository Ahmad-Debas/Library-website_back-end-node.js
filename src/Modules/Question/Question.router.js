import { Router } from 'express';
import * as questionController from './Controller/Question.controller.js';
import { auth } from '../../Middleware/Auth.middleware.js';
import { endPoint } from './Question.endpoint.js';

const router = Router();

router.post('/', auth(endPoint.create), questionController.createQuestion);

router.get('/', questionController.getAllQuestions);
router.get('/:id', questionController.getQuestion);

router.put('/:id', auth(endPoint.update), questionController.updateQuestion);

router.delete('/:id', auth(endPoint.delete), questionController.deleteQuestion);

export default router;
