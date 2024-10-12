import mongoose from "mongoose";

const trainSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        maxlength: 10
    },
    start_station:{
        type: String,
        required: true,
        maxlength: 50
    },
    end_station:{
        type: String,
        required: true,
        maxlength: 50

    },
    departure_time:{
        type: Date,
        required: true
    },
});

export const Train = mongoose.model("Train", trainSchema);