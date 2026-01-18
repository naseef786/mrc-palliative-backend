import jwt from "jsonwebtoken";

export const signToken = (payload: any) =>
  jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
