import User from "../models/User";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt";
import { Request, Response } from "express";
import { connectDB } from "../config/db";
export const signup = async (req: Request, res: Response) => {
  await connectDB();

  const { name, email, password, role, phone, bloodGroup, dob, address, emergencyContact } = req.body;
  console.log(process.env.DB_NAME, process.env.MONGO_URI,);

  try {
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "Name, email, password and phone required" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const safeRole: "admin" | "volunteer" = role === "admin" ? "admin" : "volunteer";

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: safeRole,
      phone,
      bloodGroup,
      dob,
      address,
      emergencyContact,
      totalServices: role === "volunteer" ? 0 : undefined,
    });

    const { password: _pass, ...userSafe } = user.toObject();

    return res.status(201).json({ message: "User created", user: userSafe });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  await connectDB();
  const { email, password } = req.body;
  console.log(email, password);
  // console.log("Mongoose readyState:", mongoose.connection.readyState);
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken({ id: user._id, role: user.role });

    const { password: _pass, ...userSafe } = user.toObject();
    return res.json({ token, user: userSafe });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
