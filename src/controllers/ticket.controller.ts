//import du Model Ticket
import {Ticket} from "../models/ticket.model.ts";

//import des utilitaires
import type {Request, Response} from "express";
import jwt from "jsonwebtoken";
import {JWT_SECRET_KEY} from "../config/env.config.ts";
import {Train} from "../models/train.model.ts";

export const getTicket = async (req: Request, res: Response) => {

    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        res.status(401).json({message: "Access denied. No token provided."});
        return;
    }
    try {
        const key = JWT_SECRET_KEY || "your_secret";
        const decoded = jwt.verify(token, key);
        console.log("decoded:" ,decoded);
        (req as any).user = decoded
       const ticket = await Ticket.find({ userId: (req as any).user._id });
        if (ticket) {
            res.json(ticket);
        } else {
            res.status(404).json({message: "Ticket not found"});
        }
    } catch (error: any) {
        res.status(401).json({error:"Invalid Token"});
    }
}

export const bookTicket = async (req: Request, res: Response) => {
    const { trainName, seat_number, price} = req.body;
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Access denied. No token provided." });
        return;
    }
    try {
        const key = JWT_SECRET_KEY || "your_secret";
        const decoded = jwt.verify(token, key);
        (req as any).user = decoded
        const user = (req as any).user;

        const userId = user._id;
        console.log(user)

        const ticket = new Ticket({
            userId,
            trainName,
            seat_number,
            price,
        });
        const train = await Train.findOne({name : trainName});
        if(!train){
            res.status(404).json({message: "Train not found"});
        }
        const newTicket = await ticket.save();
        res.status(201).json(newTicket);
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
}

export const validateTicket = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const ticket = await Ticket.findById(id);
        if (ticket) {
            ticket.status = "validate";
            await ticket.save();
            res.status(200).json(ticket);
        } else {
            res.status(404).json({message: "Ticket not found"});
        }
    } catch (error: any) {
        res.status(500).json({error: error.message});
    }
}