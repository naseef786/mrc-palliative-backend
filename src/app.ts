import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import patientRoutes from "./routes/patient.routes";
import volunteerRoutes from "./routes/volunteer.routes";
import scheduleRoutes from "./routes/schedule.routes";
import analyticsRoutes from "./routes/analytics.routes";
import { connectDB } from "./config/db";

const app = express();

app.use(cors());
app.use(express.json());
// app.use(async (req, res, next) => {
//     try {
//         await connectDB();
//         next();
//     } catch (err) {
//         res.status(500).json({ error: "Database connection failed" });
//     }
// });
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/analytics", analyticsRoutes);
// Add this to your Express app file (e.g., index.ts or app.ts)
app.get("/api/ipconfig", async (req, res) => {
    try {
        // Using native fetch to get the outbound IP address
        const response = await fetch('https://api.ipify.org?format=json');

        if (!response.ok) {
            throw new Error(`IP Check failed: ${response.statusText}`);
        }

        const data: any = await response.json();

        res.status(200).json({
            success: true,
            outbound_ip: data.ip,
            environment: process.env.NODE_ENV,
            message: "Add this IP to MongoDB Atlas Network Access. If it changes often, use 0.0.0.0/0."
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default app;
