import Patient from "../models/Patient";

export const getPatients = async (_: any, res: any) => {
  const patients = await Patient.find();
  res.json(patients);
};

export const createPatient = async (req: any, res: any) => {
  const patient = await Patient.create(req.body);
  res.json(patient);
};

export const updatePatient = async (req: any, res: any) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(patient);
};

export const deletePatient = async (req: any, res: any) => {
  await Patient.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
