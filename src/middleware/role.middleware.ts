import { AuthRequest } from "./auth.middleware";
import { Response, NextFunction } from "express";

export const role =
  (roles: string[]) =>
    (req: AuthRequest, res: Response, next: NextFunction) => {
      if (!roles.includes(req.user.role))
        return res.status(403).json({ message: "Forbidden" });
      next();
    };
