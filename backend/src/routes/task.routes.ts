import { Router } from 'express';
import { createTask, getTasks } from '../controllers/task.controller';
import { validate } from '../middlewares/validate';
import { createTaskSchema } from '../validators/task.validator';

const router = Router();

router.post('/', validate(createTaskSchema), createTask);
router.get('/', getTasks);

export default router;