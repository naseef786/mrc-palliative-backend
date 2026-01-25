import { Router } from "express";
import {
  createSchedule,
  getSchedules,
  updateSchedule,
  deleteSchedule,
  assignSelf,
  unassignSelf,
} from "../controllers/schedule.controller";
import { auth } from "../middleware/auth.middleware";


const router = Router();

router.get("/", auth, getSchedules);
router.post("/", auth, createSchedule);
router.put("/:id", auth, updateSchedule);
router.delete("/:id", auth, deleteSchedule);

router.post("/:id/assign", auth, assignSelf);
router.post("/:id/unassign", auth, unassignSelf);

export default router;
