import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import patientRoutes from "./routes/patient.routes";
import volunteerRoutes from "./routes/volunteer.routes";
import scheduleRoutes from "./routes/schedule.routes";
import analyticsRoutes from "./routes/analytics.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/analytics", analyticsRoutes);

export default app;
