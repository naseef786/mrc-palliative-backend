import { Router } from "express";
import { dashboardAnalytics } from "../controllers/analytics.controller";
import { auth } from "../middleware/auth.middleware";
import { role } from "../middleware/role.middleware";

const router = Router();

router.get("/", auth, role(["admin"]), dashboardAnalytics);

export default router;
