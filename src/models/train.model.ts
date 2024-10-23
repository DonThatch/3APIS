import mongoose, {Schema, models} from "mongoose";
import {TrainStation} from "./trainStation.model.ts";


const trainSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        maxlength: 10
    },
    start_station:{
        type: Schema.Types.ObjectId,
        ref: TrainStation,
        required: true
    },
    end_station:{
        type: Schema.Types.ObjectId,
        ref: TrainStation,
        required: true

    },
    departure_time:{
        type: Date,
        required: true
    },
});

export const Train = mongoose.model("Train", trainSchema);