import { Router } from "express";
import {
  getVolunteers,
  updateVolunteer,
  deleteVolunteer,
} from "../controllers/volunteer.controller";
import { auth } from "../middleware/auth.middleware";
import { role } from "../middleware/role.middleware";

const router = Router();

router.get("/", auth, role(["admin"]), getVolunteers);
router.put("/:id", auth, role(["admin"]), updateVolunteer);
router.delete("/:id", auth, role(["admin"]), deleteVolunteer);

export default router;
