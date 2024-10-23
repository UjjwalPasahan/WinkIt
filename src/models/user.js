import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    role: {
        type: String,
        enum: ["Customer", "Admin", "DeliveryPartner"],
        required: true,
    },
    isActive: {
        type: Boolean,
        default: false,
    }
});

const CustomerSchema = new mongoose.Schema({
    ...UserSchema.obj,
    phone: {
        type: Number,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        unique: true,
        required: true,
    },
    role: {
        type: String,
        enum: ["Customer"],
        default: "Customer",
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
    }
});


const DeliveryPartnerSchema = new mongoose.Schema({
    ...UserSchema.obj,
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        unique: true,
        required: true,
    },
    phone: {
        type: Number,
        unique: true,
        required: true,
    },
    role: {
        type: String,
        enum: ["DeliveryPartner"],
        default: "DeliveryPartner",
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
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
    }
});

const AdminSchema = new mongoose.Schema({
    ...UserSchema.obj,
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        unique: true,
        required: true,
    },
    role: {
        type: String,
        enum: ["Admin"],
        default: "Admin",
    }
});

export const Customer = mongoose.model("Customer",CustomerSchema);
export const DeliveryPartner = mongoose.model("DeliveryPartner",DeliveryPartnerSchema);
export const Admin = mongoose.model("Admin",AdminSchema);
