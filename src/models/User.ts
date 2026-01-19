import { Schema, model } from "mongoose";
import { IUser } from "../types/user";

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },

        email: { type: String, required: true, unique: true, lowercase: true, index: true },

        password: { type: String, required: true },

        role: { type: String, enum: ["admin", "volunteer"], default: "volunteer" },

        phone: { type: String },

        bloodGroup: { type: String },

        dob: { type: String },

        address: { type: String },

        emergencyContact: { type: String },

        totalServices: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default model<IUser>("User", UserSchema);
