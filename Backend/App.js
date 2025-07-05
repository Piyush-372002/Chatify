import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { initSocket } from "./socket.js";


//create express app
const app=express();
const server=http.createServer(app); 
initSocket(server); 


//middleware setup
app.use(express.json({limit:"4mb"}));
app.use(cors());


//routs setup
app.use("/api/status",(req,res)=>{
    res.send("Server is live");
})
app.use("/api/auth",userRouter);
app.use("/api/messages",messageRouter);


//connect to db
const mongo_URL=process.env.MONGODB_URL;
main().then((res)=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})
async function main() {
    await mongoose.connect(mongo_URL);
}


if(process.env.NODE_ENV!=="production"){
    const PORT=process.env.PORT || 5000;
    server.listen(PORT,()=>{
       console.log("app is listening");
    })
}

//export server for vercel
export default server;