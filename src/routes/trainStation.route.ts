import express from "express";
import {createTrainStation, deleteTrainStation, getAllTrainStations, modifyTrainStation, getTrainStationByName} from "../controllers/trainStation.controller.ts";
import {isAdminAuth} from "../middlewares/isAuth.middleware.ts";
import {upload} from "../middlewares/addImage.middleware.ts";
const trainStationRouter = express.Router();

trainStationRouter.post("/",isAdminAuth, upload, createTrainStation);
trainStationRouter.get("/", getAllTrainStations);
trainStationRouter.get("/:name", getTrainStationByName);
trainStationRouter.put("/:id",isAdminAuth, modifyTrainStation);
trainStationRouter.delete("/:id",isAdminAuth, deleteTrainStation);

export default trainStationRouter;