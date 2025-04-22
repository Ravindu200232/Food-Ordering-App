import express from "express"
import { addOrder, deleteOrder, getOrder, getQuote } from "../controllers/orderController.js";

const orderRoute = express.Router();

orderRoute.post("/",addOrder);
orderRoute.get("/",getOrder)
orderRoute.delete("/delete/:id",deleteOrder)
orderRoute.post("/quote",getQuote)

export default orderRoute