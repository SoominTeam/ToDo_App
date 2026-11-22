import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTaskStatus,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";
import { validate } from "../middlewares/validate";
import {
  createTaskSchema,
  taskIdParamsSchema,
  updateTaskStatusSchema,
  updateTaskSchema,
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
router.put(
  "/:id",
  validate(taskIdParamsSchema, "params"),
  validate(updateTaskSchema),
  updateTask,
);
router.delete(
  "/:id",
  validate(taskIdParamsSchema, "params"),
  deleteTask,
);

export default router;
