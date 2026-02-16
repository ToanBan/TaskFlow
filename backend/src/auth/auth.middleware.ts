import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyResetToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.query.token as string;

  if (!token) {
    return res.redirect("/forgot");
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.RESET_PASSWORD_SECRET!
    );

    // gắn thông tin userId vào request để dùng tiếp
    (req as any).resetUser = decoded;

    next();
  } catch (err) {
    return res.redirect("/forgot");
  }
};