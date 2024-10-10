import express  from "express";
import { getTrain, createTrain, deleteTrain, updateTrain } from "../controllers/train.controller.ts";
import { isAdminAuth} from "../middlewares/isAuth.middleware.ts";

const trainRouter = express.Router();


trainRouter.get("/", isAdminAuth, getTrain);
trainRouter.post("/", isAdminAuth, createTrain);
trainRouter.put("/:id", isAdminAuth, updateTrain);
trainRouter.delete("/:id", isAdminAuth, deleteTrain);

export default trainRouter;