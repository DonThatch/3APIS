import express from "express";

import {createUser, deleteUser, getAllUsers, getUserById, login, updateUser} from "../controllers/user.controller.ts";
import {isAdminAuth, isAuthenticated, isEmployeeAuth} from "../middlewares/isAuth.middleware.ts";

//router pour les utilisateurs
const userRouter = express.Router();

userRouter.get("/",isEmployeeAuth, getAllUsers);
userRouter.get("/:id", isEmployeeAuth, getUserById);

userRouter.post("/register", createUser);
userRouter.post("/login", login);

userRouter.put("/:id", isAuthenticated, updateUser);
userRouter.delete("/:id", isAuthenticated, deleteUser);

export default userRouter;
