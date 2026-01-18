import { Schema, model } from "mongoose";
import { IUser } from "../types/user";

const VolunteerSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: String,

    bloodGroup: String,

    role: {
      type: String,
      default: "volunteer",
      enum: ["volunteer"],
    },

    totalServices: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("Volunteer", VolunteerSchema);
