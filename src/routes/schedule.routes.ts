import { Router } from "express";
import {
  createSchedule,
  getSchedules,
  updateSchedule,
  deleteSchedule,
  assignSelf,
  unassignSelf,
  getAssignedSchedules,
  updateScheduleStatus,
} from "../controllers/schedule.controller";
import { auth } from "../middleware/auth.middleware";


const router = Router();

router.get("/", auth, getSchedules);
router.post("/", auth, createSchedule);
router.put("/:id", auth, updateSchedule);
router.delete("/:id", auth, deleteSchedule);

router.post("/:id/assign", auth, assignSelf);
router.post("/:id/unassign", auth, unassignSelf);


// Get assigned schedules for volunteer (paginated)
router.get("/assigned", auth, getAssignedSchedules);

// Update schedule status
router.patch("/:id/status", auth, updateScheduleStatus);



export default router;
