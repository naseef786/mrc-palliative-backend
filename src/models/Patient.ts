import { Schema, model } from "mongoose";

const PatientSchema = new Schema(
  {
    name: String,
    dob: String,
    address: String,
    emergencyContact: String,
    medicalHistory: String,
    totalVisits: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default model("Patient", PatientSchema);
