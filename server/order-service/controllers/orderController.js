import Collection from "../models/collection.js";
import Order from "../models/order.js";
import { checkAdmin, checkCustomer, checkHasAccount, checkRestaurant } from "./authController.js";

export async function addOrder(req,res) {

    const data = req.body;
    console.log(data)
  const orderInfo = {
    orderItem: [],
  };

  if (req.user == null) {
    res.status(401).json({
      message: "please login and try again",
    });
    return;
  }

  orderInfo.email = req.user.email;
  orderInfo.address = req.user.address;

  const lastOrder = await Order.find().sort({ orderId: -1 }).limit(1);
  if (lastOrder.length == 0) {
    orderInfo.orderId = "ORD0001";
  } else {
    const lastOrderId = lastOrder[0].orderId; // ORD0065
    const lastOrderNumberString = lastOrderId.replace("ORD", ""); // 0065
    const lastOrderNumber = parseInt(lastOrderNumberString); // 65
    const formattedNumber = (lastOrderNumber + 1).toString().padStart(4, "0"); // 0066
    orderInfo.orderId = "ORD" + formattedNumber; // ORD0066
  }



  for (let i = 0; i < data.orderItem.length; i++) {
    try {
      const product = await Collection.findOne({ _id : data.orderItem[i].key });
      console.log(data.orderItem[i].key)
      if (product == null) {
        res.status(404).json({
          message: "Product with key " + data.orderItem[i].key + "not found",
        });
        console.log("product","hisadasd")

        return;
      }

      if (product.available == false) {
        res.status(400).json({
          message:
            "Product with key " + data.orderItem[i].key + "is not available",
        });
        return;
      }

      orderInfo.orderAddress = req.user.address
      

      orderInfo.orderItem.push({
        product: {
          key: product._id, // ✅ use correct casing
          name: product.name,
          image: product.images[0],
          price: product.price,
          restaurantId : product.restaurantId
        },
        quantity: data.orderItem[i].qty,
      });
      

      

      orderInfo.totalAmount = product.price * data.orderItem[i].qty;

     
    } catch (err) {
      res.status(500).json({
        message: "Failed to create order",
      });
    }
  }




  try {
    const newOrder = new Order(orderInfo);
    const result = await newOrder.save();
    res.json({
      message: "Order created successfully",
      result: result,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Failed to create order",
    });
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



export async function getQuote(req, res) {
  const data = req.body;
  const orderInfo = {
    orderItem: [],
    totalAmount: 0,
  };

  for (let i = 0; i < data.orderItem.length; i++) {
    const item = data.orderItem[i];

    try {
      const product = await Collection.findOne({ _id: item.key });

      if (!product) {
        return res.status(404).json({
          message: `Product with key ${item.key} not found`,
        });
      }

      if (product.available === false) {
        return res.status(400).json({
          message: `Product with key ${item.key} is not available`,
        });
      }

      const quantity = item.qty;
      const itemTotal = product.price * quantity;

      orderInfo.orderItem.push({
        product: {
          key: product._id,
          name: product.name,
          image: product.images[0],
          price: product.price,
          restaurantId : product.restaurantId
        },
        quantity: quantity,
      });

      orderInfo.totalAmount += itemTotal;

    } catch (err) {
      
      return res.status(500).json({
        message: "Something went wrong while processing order quote",
      });
    }
  }

  return res.json({
    message: "Order quotation",
    total: orderInfo.totalAmount,
    orderItems: orderInfo.orderItem,
  });
}
