//import des utilitaires
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {User} from "../models/user.model.ts";
dotenv.config();

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Access denied. No token provided." });
        return;
    }
    try {
        const secretKey = process.env.JWT_SECRET_KEY || "your_secret_key";
        const decoded = jwt.verify(token, secretKey) as { _id: string };

        const user = await User.findById(decoded._id);
        if (!user) {
            res.status(401).json({ message: "User not found." });
            return;
        }

        (req as any).user = { _id: user._id, role: user.role };
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token." });
        return;
    }
};

export const isAdminAuth = (req: Request, res: Response, next: NextFunction): void => {

    isAuthenticated(req, res, () => {
        const user = (req as any).user;
        if (user && user.role === "admin") {
            next();
        } else {
            res.status(403).json({ message: "Access denied. Admins only." });
        }
    });
};

export const isEmployeeAuth = (req: Request, res: Response, next: NextFunction): void => {

    isAuthenticated(req, res, () => {
        const user = (req as any).user;
        if (user && (user.role === "employee" || user.role === "admin")) {
            next();
        } else {
            res.status(403).json({ message: "Access denied. Admins only." });
        }
    });
};
