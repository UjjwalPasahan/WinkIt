import mongoose from "mongoose";

const BranchSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    liveLocation: {
        latitude: {
            type: String,
        },
        longitude: { 
            type: String,
        }
    },
    address: {
        type: String,
    },
    DeliveryPartners:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"DeliveryPartner"
        }
    ]
});


export const Branch = mongoose.model("Branch",BranchSchema);