import type { Request, Response } from "express";
import { TrainStation } from "../models/trainStation.model.ts";
import {Train} from "../models/train.model.ts";

export const createTrainStation = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, open_hour, close_hour } = req.body;

        const newTrainStation = await TrainStation.create({
            name,
            open_hour,
            close_hour,
            image: req.file ? req.file.path : "stationImages\\default.jpg"
        });

        res.status(201).json({ message: "Train station created successfully", trainStation: newTrainStation });
    } catch (error) {
        res.status(500).json({ message: "Error creating train station", error });
    }
};

export const getAllTrainStations = async (_: Request, res: Response) => {
    try {
        const trainStations = await TrainStation.find();
        res.json(trainStations);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getTrainStationByName = async (req: Request, res: Response) => {
    try {
        const trainStation = await TrainStation.findById(req.params.name);
        if (trainStation) {
            res.json(trainStation);
        } else {
            res.status(404).json({ error: "Train station not found" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const modifyTrainStation = async (req: Request, res: Response): Promise<void> => {
    const trainStation = await TrainStation.findByIdAndUpdate(req.params.id, req.body);
    try {
        if (!trainStation) {
            throw { status: 404, message: "Train station not found" };
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });;
    }
};

export const deleteTrainStation = async (req: Request, res: Response) => {
    try {
        const stationId = req.params.id;

        // Delete the train station
        const trainStation = await TrainStation.findByIdAndDelete(stationId);

        if (trainStation) {
            // Delete all trains where the station is either start_station or end_station
            await Train.deleteMany({
                $or: [
                    { start_station: stationId },
                    { end_station: stationId }
                ]
            });
            res.json({ message: "Train station and associated trains deleted successfully" });
        } else {
            res.status(404).json({ message: "Train station not found" });
        }
    } catch (error: any) {
        res.status(error.status).json({ error: error.message });
    }
};
