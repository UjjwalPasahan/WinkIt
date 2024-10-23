import fastify from "fastify";
import connectDB from "./src/config/connectDB.js";
import dotenv from "dotenv";
import { admin, buildAminRouter } from "./src/config/setup.js";
import { registerRoutes } from "./src/routes/index.js";
import fastifySocketIO from "fastify-socket.io";

// Load environment variables from .env file
dotenv.config();

const port = process.env.PORT || 3000;

const server = async () => {
    const app = fastify();

    app.register(fastifySocketIO,{
        cors:{
            origin:"*"
        },
        pingInterval:10000,
        pingTimeout:5000,
        transports:['websocket']
    })

    await registerRoutes(app)

    await buildAminRouter(app);
    
    try {
        await connectDB();
        console.log('DB connected');
    } catch (err) {
        console.log(err);
    }
    
    app.listen({ port }, (err, addr) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`Server started on http://localhost:${port}${admin.options.rootPath}`);
        }
    });

    app.ready().then(()=>{
        app.io.on("connection",(socket)=>{
            console.log("A user connected 👤")
            socket.on("joinRoom",(orderId)=>{
                socket.join(orderId)
                console.log(`User joined Room ${orderId}`)
            })
    
            socket.on("disconnected",()=>{
                console.log("USer disconnected")
            })
        })


    })
}

server();
