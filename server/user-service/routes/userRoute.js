import express from 'express'
import { createUser, userLogin } from '../controllers/userController.js';

const userRoute = express.Router();

userRoute.post("/",createUser);
userRoute.post("/login",userLogin)

export default userRoute