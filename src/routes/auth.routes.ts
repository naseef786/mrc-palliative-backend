import { Router } from "express";
import { login, registerVolunteer } from "../controllers/auth.controller";

const router = Router();

router.post("/login", login);
router.post("/register/volunteer", registerVolunteer);

export default router;
