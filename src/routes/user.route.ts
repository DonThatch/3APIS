import express from "express";

import {createUser, deleteUser, getAllUsers, getUserById, login, updateUser} from "../controllers/user.controller.ts";
import { isAuthenticated } from "../middlewares/isAuth.middleware.ts";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", isAuthenticated, getUserById);

userRouter.post("/register", createUser);
userRouter.post("/login", login);

userRouter.put("/:id", isAuthenticated, updateUser);
userRouter.delete("/:id", isAuthenticated, deleteUser);

export default userRouter;
