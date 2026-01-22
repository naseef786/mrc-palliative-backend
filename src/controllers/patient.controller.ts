import { Request, Response } from "express";
import Patient from "../models/Patient";

/**
 * GET /patients
 * Pagination + Search
 */
export const getPatients = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search as string) || "";

    const query = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const [patients, total] = await Promise.all([
      Patient.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Patient.countDocuments(query),
    ]);

    res.json({
      data: patients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch patients" });
  }
};

/**
 * GET /patients/:id
 */
export const getPatientById = async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(patient);
  } catch {
    res.status(400).json({ message: "Invalid patient ID" });
  }
};

/**
 * POST /patients
 */
export const createPatient = async (req: Request, res: Response) => {
  try {
    const { name, dob, emergencyContact } = req.body;

    if (!name || !dob || !emergencyContact) {
      return res
        .status(400)
        .json({ message: "Required fields missing" });
    }

    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch {
    res.status(500).json({ message: "Failed to create patient" });
  }
};

/**
 * PUT /patients/:id
 */
export const updatePatient = async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(patient);
  } catch {
    res.status(400).json({ message: "Failed to update patient" });
  }
};

/**
 * DELETE /patients/:id
 */
export const deletePatient = async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ success: true });
  } catch {
    res.status(400).json({ message: "Failed to delete patient" });
  }
};
