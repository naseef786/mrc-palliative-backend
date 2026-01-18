import bcrypt from "bcryptjs";
import Admin from "../models/Admin";
import Volunteer from "../models/Volunteer";
import { signToken } from "../utils/jwt";

export const login = async (req: any, res: any) => {
  const { email, password, role } = req.body;

  const Model = role === "admin" ? Admin : Volunteer;
  const user = await Model.findOne({ email });

  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ message: "Invalid credentials" });

  const token = signToken({
    id: user._id,
    role: user.role,
  });

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      role: user.role,
    },
  });
};

export const registerVolunteer = async (req: any, res: any) => {
  const { name, email, password } = req.body;

  const exists = await Volunteer.findOne({ email });
  if (exists)
    return res.status(400).json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const volunteer = await Volunteer.create({
    name,
    email,
    password: hashed,
  });

  res.json(volunteer);
};
