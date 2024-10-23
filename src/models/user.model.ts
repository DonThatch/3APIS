//import de mongoose
import mongoose from "mongoose";

//définition du schéma de la collection User
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ["user", "employee", "admin"],
        default: "user"
    }
});

export const User = mongoose.model("User", userSchema);
