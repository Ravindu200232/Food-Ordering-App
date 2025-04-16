import Order from "../models/order.js";
import { checkAdmin, checkCustomer, checkHasAccount } from "./authController.js";

export async function addOrder(req,res) {

   try{

    const data = req.body;
    data.userId = req.user.id;

    if(checkHasAccount(req)){
        if(checkAdmin(req) || checkCustomer(req)){
            const newOrder = new Order(data)
            await newOrder.save();
            res.json({
                message : "Order added successfully!"
            })
        }else{
            res.json({
                message : "can't access this task"
            })
        }
    }else{
        res.status(404).json({
            message : "Please login first!"
        })
    }

   }catch(err){
    res.status(500).json({
        err : "Order added unsuccessfully"
    })
   }

    

}