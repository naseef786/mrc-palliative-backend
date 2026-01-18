import { Router } from "express";
import {
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
} from "../controllers/patient.controller";
import { auth } from "../middleware/auth.middleware";
import { role } from "../middleware/role.middleware";

const router = Router();

router.get("/", auth, getPatients);
router.post("/", auth, role(["admin"]), createPatient);
router.put("/:id", auth, role(["admin"]), updatePatient);
router.delete("/:id", auth, role(["admin"]), deletePatient);

export default router;
