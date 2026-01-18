import { Router } from "express";
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  assignVolunteer,
  unassignVolunteer,
} from "../controllers/schedule.controller";
import { auth } from "../middleware/auth.middleware";
import { role } from "../middleware/role.middleware";

const router = Router();

router.get("/", auth, getSchedules);

router.post("/", auth, role(["admin"]), createSchedule);
router.put("/:id", auth, role(["admin"]), updateSchedule);

router.post("/:id/assign", auth, role(["volunteer"]), assignVolunteer);
router.post("/:id/unassign", auth, role(["volunteer"]), unassignVolunteer);

export default router;
