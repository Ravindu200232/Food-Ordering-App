import mongoose from "mongoose";

const deliverySchema = mongoose.Schema({
    driverId : {
        type : String,
        required : true
    },
    orderId : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true,
        enum : ["picked up","on the way","delivered"],
        default : "picked up"
    },
    estimatedTime : {

    },
    traking : [
        {
            lat: {
                type: Number,
                required: true
            },
            innerHeight: {
                type: Number,
                required: true
            },
            timestamp: {
                type: Date,
                required: true
            }
        }
    ]
})


const Delivery = mongoose.model("delivery",deliverySchema);

export default Delivery