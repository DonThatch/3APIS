import { Train } from "../models/train.model";
import type { Request, Response } from "express";




export const getTrain = async (req: Request, res: Response)  => {
    try {
        const { name, start_station, end_station, departure_time } = req.query ;

        const filters: any = {};

        if (name) {
            filters.name = name;
        }

        if (start_station) {
            filters.start_station = start_station;
        }

        if (end_station) {
            filters.end_station = end_station;
        }

        if (departure_time) {
            filters.departure_time = new Date(departure_time as string);
        }

        const trains = await Train.find(filters);

        if (trains.length === 0) {
            return res.status(404).json({ message: "Train not found" });
        }

        res.json(trains);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createTrain = async (req: Request, res: Response) => {
    const { name, start_station, end_station, departure_time } = req.body;

    try {
        const train = new Train({
            name,
            start_station,
            end_station,
            departure_time
        });

        const newTrain = await train.save();
        res.status(201).json(newTrain);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteTrain = async (req: Request, res: Response) => {
    try {
        const train = await Train.findByIdAndDelete(req.params.id);
        if (train) {
            res.json(train);
        } else {
            res.status(404).json({ message: "Cannot delete : Train not found" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateTrain = async (req: Request, res: Response) => {
    try {
        const train = await Train.findByIdAndUpdate(req.params.id, req.body);
        if (train) {
            res.status(200).json(train);
        } else {
            res.status(404).json({message: "Cannot update : Train not found"});
        }
    }
    catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
