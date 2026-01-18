import { Schema, model, Types } from "mongoose";

const ScheduleSchema = new Schema(
  {
    patient: { type: Types.ObjectId, ref: "Patient" },
    task: String,
    date: String,
    time: String,
    notes: String,
    priority: {
      type: String,
      enum: ["low", "medium", "critical"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "expired"],
      default: "pending",
    },
    volunteer: { type: Types.ObjectId, ref: "Volunteer", default: null },
  },
  { timestamps: true }
);

export default model("Schedule", ScheduleSchema);
