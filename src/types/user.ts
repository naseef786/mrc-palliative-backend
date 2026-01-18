import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "volunteer";
  phone?: string;
  bloodGroup?: string;
  totalServices?: number;
}
