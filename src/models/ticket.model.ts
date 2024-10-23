//import de mongoose
import mongoose from "mongoose";

//impprt du model Train
import {Train} from "./train.model.ts";

//definition du schema de la collection Ticket
const ticketSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    trainName: {
        type: String,
        ref: Train,
        required: true
    },
    seat_number: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "validate","cancelled"],
        default: "pending"
    }
});


export const Ticket = mongoose.model("Ticket", ticketSchema);