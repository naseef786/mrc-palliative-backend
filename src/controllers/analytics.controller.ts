import { Request, Response } from "express";
import Schedule from "../models/Schedule";
import Patient from "../models/Patient";
import User from "../models/User";
import { connectDB } from "../config/db";

export const dashboardAnalytics = async (req: Request, res: Response) => {
  try {
    await connectDB();
    const monthQuery = req.query.month as string; // 1-12
    const yearQuery = req.query.year as string;

    const selectedMonth = monthQuery ? Number(monthQuery) : new Date().getMonth() + 1;
    const selectedYear = yearQuery ? Number(yearQuery) : new Date().getFullYear();

    // Month range
    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59);

    const [
      totalPatients,
      totalVolunteers,
      totalStaffs,
      totalSchedules,
      statusStats,
      monthlySchedules,
    ] = await Promise.all([
      Patient.countDocuments(),
      User.countDocuments({ role: "volunteer" }),
      User.countDocuments({ role: "admin" }),
      Schedule.countDocuments(),

      // Status counts (selected month)
      Schedule.aggregate([
        {
          $match: {
            date: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      // Monthly chart (selected month only – consistent with filter)
      Schedule.aggregate([
        {
          $match: {
            date: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.month": 1 } },
      ]),
    ]);

    // ✅ Safe status map (prevents undefined)
    const statusMap = {
      pending: 0,
      "in-progress": 0,
      completed: 0,
      expired: 0,
    };

    statusStats.forEach((item) => {
      if (item._id && statusMap.hasOwnProperty(item._id)) {
        statusMap[item._id as keyof typeof statusMap] = item.count;
      }
    });

    res.json({
      cards: {
        totalPatients,
        totalVolunteers,
        totalStaffs,
        totalSchedules,
        completedSchedules: statusMap.completed,
      },

      // 👇 Explicit counts (what you asked for)
      scheduleCounts: {
        pending: statusMap.pending,
        inProgress: statusMap["in-progress"],
        completed: statusMap.completed,
        expired: statusMap.expired,
      },

      schedulesByStatus: statusMap,

      schedulesByMonth: monthlySchedules.map((m) => ({
        year: m._id.year,
        month: m._id.month,
        count: m.count,
      })),
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Analytics failed" });
  }
};
