import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Access denied. No token provided." });
        return;
    }

    try {
        const secretKey = process.env.JWT_SECRET_KEY || "secret_key";
        const decoded = jwt.verify(token, secretKey);

        (req as any).user = decoded;

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
