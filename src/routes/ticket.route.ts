import express from "express";
import { getTicket, bookTicket, validateTicket } from "../controllers/ticket.controller.ts";
import { isAuthenticated } from "../middlewares/isAuth.middleware.ts";

//router pour les tickets
const ticketRouter = express.Router();
ticketRouter.get("/", isAuthenticated, getTicket);
ticketRouter.post("/", isAuthenticated, bookTicket);
ticketRouter.put("/:id", isAuthenticated, validateTicket);

export default ticketRouter;