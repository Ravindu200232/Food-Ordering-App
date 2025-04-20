import Order from "../models/order.js";
import { checkAdmin, checkCustomer, checkHasAccount, checkRestaurant } from "./authController.js";

export async function addOrder(req,res) {

   try{

    const data = req.body;
    data.userId = req.user.id;

    if(checkHasAccount(req)){
        
            const newOrder = new Order(data)
            await newOrder.save();
            res.json({
                message : "Order added successfully!"
            })
            return
       
       
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

export async function getOrder(req,res) {

    try{

       
        if(checkHasAccount(req)){

            if(checkAdmin(req)){
               const result = await Order.find();
               res.json(result)
               return 
            }

            if(checkRestaurant(req) || checkCustomer(req)){

                const result = await Order.find({
                    userId : req.user.id 
                })
                res.json(result)
                return
            }

            else{
                res.status(401).json({
                    message : "cant access this task"
                })
                return
            }


        }else{
            res.status(401).json({
                message : "cant access this task"
            })
            return
        }

    }catch(err){
        res.status(500).json({
            error : "Internal Server error" || err
        })
    }
    
}

export async function deleteOrder(req,res) {

    try{

        const id = req.params.id;
        if(checkHasAccount(req)){

            if(checkAdmin(req)){
                await Order.deleteOne({
                    _id : id
                })
                res.json({
                    message : "Order deleted successfully"
                })
                return
            }else{

                await Order.deleteOne({
                    _id : id,
                    userId : req.user.id
                })
                res.json({
                    message : "Order deleted successfully"
                })
                return
            }
        }else{
            res.status(401).json({
                message : "Please login"
            })
            return
        }
    }catch(err){
        res.status(500).json({
            error : "Internal Server error" || err
        })
    }
    
}