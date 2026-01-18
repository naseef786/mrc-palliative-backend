import Volunteer from "../models/Volunteer";

export const getVolunteers = async (_: any, res: any) => {
  const volunteers = await Volunteer.find().select("-password");
  res.json(volunteers);
};

export const updateVolunteer = async (req: any, res: any) => {
  const volunteer = await Volunteer.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  ).select("-password");

  res.json(volunteer);
};

export const deleteVolunteer = async (req: any, res: any) => {
  await Volunteer.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
