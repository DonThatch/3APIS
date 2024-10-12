import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {JWT_SECRET_KEY} from "../config/env.config.ts";

dotenv.config();

interface RequestWithUser extends Request {
    user?: string | jwt.JwtPayload;
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const secretKey = JWT_SECRET_KEY || "your_secret_key";
        const decoded = jwt.verify(token, secretKey);

        (req as RequestWithUser).user = decoded;

        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token." });
    }
};
