import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
    name: {
        type: String,
        unique:true,
        required:true
    },
    sequence_value: {
        type: Number,
        default:0
    },
    
});


export const Counter = mongoose.model("Counter",CounterSchema);