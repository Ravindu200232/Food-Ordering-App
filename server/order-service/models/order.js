import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type : String,
    required : true
  },
  restaurantId: {
    type : String,
    ref: "Restaurant",
    required: true,
  },
  items: [
    {
      menuItemId: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "preparing", "dispatched", "delivered"],
    default: "pending",
    required: true,
  },
  deliveryId: {
    type: String,
    required : true
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  isApprove :{
    type : Boolean,
    required : true,
    default : false,
  }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;