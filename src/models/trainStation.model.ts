//import de mongoose
import mongoose from "mongoose";

//definition du schema de la collection TrainStation
const trainStationSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    open_hour: {
        type: String,
        required: true
    },
    close_hour: {
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    }
});

export const TrainStation = mongoose.model("TrainStation", trainStationSchema);