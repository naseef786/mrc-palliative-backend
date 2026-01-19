import Schedule from "../models/Schedule";
import Patient from "../models/Patient";
import User from "../models/User";


export const dashboardAnalytics = async (_: any, res: any) => {
  const totalPatients = await Patient.countDocuments();
  const totalVolunteers = await User.countDocuments({ role: "volunteer" });
  const totalSchedules = await Schedule.countDocuments();
  const completedSchedules = await Schedule.countDocuments({
    status: "completed",
  });

  res.json({
    totalPatients,
    totalVolunteers,
    totalSchedules,
    completedSchedules,
  });
};
