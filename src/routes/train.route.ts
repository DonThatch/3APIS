import express  from "express";
import { getTrain, createTrain, deleteTrain, updateTrain } from "../controllers/train.controller.ts";
import { isAdminAuth} from "../middlewares/isAuth.middleware.ts";

//router pour les trains
const trainRouter = express.Router();
// @ts-ignore
trainRouter.get("/", getTrain);
trainRouter.post("/", isAdminAuth, createTrain);
trainRouter.put("/:id", isAdminAuth, updateTrain);
trainRouter.delete("/:id", isAdminAuth, deleteTrain);

export default trainRouter;