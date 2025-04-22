import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  // Customer info
  email: {
    type: String,
    required: true,
  },

  // Unique order identifier
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  address : {
    type : String,
    required : true
  },

 

  // Items in the order
  orderItem: {
    type: [
      {
        product: {
          key: {
            type: String,
            required: true,
          },
           // Restaurant related
            restaurantId: {
            type: String,
            ref: "Restaurant",
            required: true,
  },
          name: {
            type: String,
            required: true,
          },
          image: {
            type: String,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    required: true,
  },

  // Order status
  status: {
    type: String,
    enum: ["pending", "confirmed", "preparing", "dispatched", "delivered"],
    default: "pending",
    required: true,
  },

  // Delivery assignment
  deliveryId: {
    type: String,
   
  },

  // Payment and pricing
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid",
    
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },

  // Admin approval (optional logic)
  isApprove: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
