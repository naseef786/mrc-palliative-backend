import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "volunteer";
  // Optional fields
  phone?: string;
  bloodGroup?: string;
  dob?: string; // Date of birth (ISO string)
  address?: string;
  emergencyContact?: string;
  totalServices?: number; // Only relevant for volunteers
  createdAt: Date;
  updatedAt: Date;
}
