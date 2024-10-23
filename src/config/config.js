import "dotenv/config"
import fastifySession from "@fastify/session"
import connectMongodbSession from "connect-mongodb-session"
import { Admin } from "../models/index.js"

const MongoDBStore = connectMongodbSession(fastifySession)

export const sessionStore = new MongoDBStore({
    uri:process.env.MONGO_DB_URI,
    collection:"sessions"
})

sessionStore.on("error",(err)=>{
    console.log("seesion error" ,err)
})


export const authenticate = async(email,password)=>{
    if(email && password){
        const user = await Admin.findOne({email})

        if(!user){
            return null;
        }

        if(user && user.password == password){
            return Promise.resolve({email,password})
        }

        else{
            return null;
        }
    }
    return null;
}

export const PORT = process.env.PORT || 3000;
export const Cookie_Password = process.env.COOKIE_PASSWORD;

