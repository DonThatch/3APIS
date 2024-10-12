// @ts-ignore
import type { Request, Response } from "express";
import { User } from "../models/user.model.ts";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {JWT_SECRET_KEY} from "../config/env.config.ts";

export const createUser = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            email,
            username,
            password: hashedPassword
        });

        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
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

export const login = async (req: Request, res: Response) : Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
             res.status(400).json({ message: "Invalid email or password." });
             return
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
             res.status(400).json({ message: "Invalid email or password." });
             return
        }

        const secretKey = JWT_SECRET_KEY || "your_secret_key";
        const token = jwt.sign({ _id: user._id, email: user.email, role: user.role }, secretKey, { expiresIn: "1h" });

        res.json({ token });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req: Request, res: Response) : Promise<void> => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
             res.status(404).json({ message: "User not found" });
            return
        }
        res.json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteUser = async (req: Request, res: Response) : Promise<void> => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
             res.status(404).json({ message: "User not found" });
            return
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
