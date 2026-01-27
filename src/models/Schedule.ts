import { Schema, model, Types } from "mongoose";

export interface ISchedule {
  patient: Types.ObjectId;
  assignedVolunteer?: Types.ObjectId | null;
  date: Date; // ✅ Date type
  info?: string;
  remarks?: string;
  message?: string;
  otherInfo?: string;
  status: "pending" | "in-progress" | "completed" | "expired";
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ScheduleSchema = new Schema<ISchedule>(
  {
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    assignedVolunteer: { type: Schema.Types.ObjectId, ref: "User", default: null },
    date: { type: Date, required: true }, // ✅ updated
    info: String,
    remarks: String,
    message: String,
    otherInfo: String,
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "expired"],
      default: "pending",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default model<ISchedule>("Schedule", ScheduleSchema);
