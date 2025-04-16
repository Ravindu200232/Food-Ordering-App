import express from "express"
import { addOrder } from "../controllers/orderController.js";

const orderRoute = express.Router();

orderRoute.post("/",addOrder);

export default orderRoute