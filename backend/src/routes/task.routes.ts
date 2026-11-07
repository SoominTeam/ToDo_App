import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTaskStatus,
} from "../controllers/task.controller";
import { validate } from "../middlewares/validate";
import {
  createTaskSchema,
  taskIdParamsSchema,
  updateTaskStatusSchema,
} from "../validators/task.validator";

const router = Router();

router.post("/", validate(createTaskSchema), createTask);
router.get("/", getTasks);
router.patch(
  "/:id/status",
  validate(taskIdParamsSchema, "params"),
  validate(updateTaskStatusSchema),
  updateTaskStatus,
);

export default router;
