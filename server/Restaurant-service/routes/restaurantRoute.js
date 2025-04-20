import express from 'express'
import { createRestaurant, deleteRestaurant, getRestaurant, isOpen, updateRestaurant, verification } from '../controllers/resturantsController.js';

const restaurantRoute = express.Router();

restaurantRoute.post("/",createRestaurant);
restaurantRoute.get("/",getRestaurant)
restaurantRoute.put("/update/:id",updateRestaurant);
restaurantRoute.delete("/delete/:id",deleteRestaurant);
restaurantRoute.post("/isOpen/:id",isOpen);
restaurantRoute.post("/isVerify/:id",verification)


export default restaurantRoute