import Schedule from "../models/Schedule";

export const getSchedules = async (_: any, res: any) => {
  const schedules = await Schedule.find()
    .populate("patient")
    .populate("volunteer");
  res.json(schedules);
};

export const createSchedule = async (req: any, res: any) => {
  const schedule = await Schedule.create(req.body);
  res.json(schedule);
};

export const updateSchedule = async (req: any, res: any) => {
  const schedule = await Schedule.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(schedule);
};

export const assignVolunteer = async (req: any, res: any) => {
  const schedule = await Schedule.findByIdAndUpdate(
    req.params.id,
    { volunteer: req.user.id, status: "in-progress" },
    { new: true }
  );
  res.json(schedule);
};

export const unassignVolunteer = async (req: any, res: any) => {
  const schedule = await Schedule.findByIdAndUpdate(
    req.params.id,
    { volunteer: null, status: "pending" },
    { new: true }
  );
  res.json(schedule);
};
