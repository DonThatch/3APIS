import type {NextFunction, Request, Response} from "express";
import { User } from "../models/user.model.ts";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, username, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const userCount = await User.countDocuments();
        const role = userCount === 0 ? "admin" : "user";

        const newUser = await User.create({
            email,
            username,
            password: hashedPassword,
            role
        });

        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
};

export const getAllUsers = async (_: Request, res: Response) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid email or password." });
            return;
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            res.status(400).json({ message: "Invalid email or password." });
            return;
        }

        const secretKey = process.env.JWT_SECRET_KEY || "secret_key";
        const token = jwt.sign({ _id: user._id, email: user.email }, secretKey, { expiresIn: "1h" });

        res.json({ token });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const { username, password, role } = req.body;
        const user = await User.findById(id);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const reqUser = (req as any).user;
        if (reqUser.role !== "admin" && reqUser._id !== id) {
            res.status(403).json({ message: "Access denied. You can only update your own profile." });
            return;
        }

        user.username = username || user.username;

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        if (role && reqUser.role === "admin") {
            user.role = role;
        } else if (role) {
            res.status(403).json({ message: "Access denied. Only admins can update roles." });
            return;
        }

        await user.save();
        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error });
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
};
