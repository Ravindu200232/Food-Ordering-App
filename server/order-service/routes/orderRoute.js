import express from "express"
import { addOrder, deleteOrder, getOrder } from "../controllers/orderController.js";

const orderRoute = express.Router();

orderRoute.post("/",addOrder);
orderRoute.get("/",getOrder)
orderRoute.delete("/delete/:id",deleteOrder)

export default orderRoute