import mongoose from "mongoose";
import { Counter } from "./counter.js";

const OrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique:true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Customer",
        required:true
    },
    deliveryPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"DeliveryPartner",
        required:true
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Branch",
        required:true
    },
    items: [
        {
            id:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required:true
            },
            item:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required:true
            },
            count:{
                type:Number,
                required:true
            }
        }
    ],
    deliveryLocation: {
        latitude: {
            type: String,
            required:true,
        },
        longitude: { 
            type: String,
            required:true,
        },
        address: { 
            type: String,
        }
    },
    pickUpLocation: {
        latitude: {
            type: String,
            required:true,
        },
        longitude: { 
            type: String,
            required:true,
        },
        address: { 
            type: String,
        }
    },
    deliveryPersonLocation: {
        latitude: {
            type: String,
            required:true,
        },
        longitude: { 
            type: String,
            required:true,
        },
        address: { 
            type: String,
        }
    },
    status:{
        type:String,
        enum:["available","confirmed","arriving","delivered","cancelled"],
        default:"available"
    },
    totalPrice:{
        type:Number,
        required:true
    },

},{
    timestamps:true,
});


async function nextSequenceGenerator(seqName){
    const seqDoc = await Counter.findOneAndUpdate(
        {name:seqName},
        {$inc:{sequence_value:1}},
        {
            new:true,
            upsert:true
        }
    );
    return seqDoc.sequence_value;
}

OrderSchema.pre("save",async function(next) {
    if(this.isNew){
        const seqValue = await nextSequenceGenerator("orderId")
        this.orderId=`ORDER${seqValue.toString().padStart(5,"0")}`
    }
    next()
})

export const Order = mongoose.model("Order",OrderSchema);