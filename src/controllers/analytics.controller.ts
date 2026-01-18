import Schedule from "../models/Schedule";
import Patient from "../models/Patient";
import Volunteer from "../models/Volunteer";

export const dashboardAnalytics = async (_: any, res: any) => {
  const totalPatients = await Patient.countDocuments();
  const totalVolunteers = await Volunteer.countDocuments();
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
