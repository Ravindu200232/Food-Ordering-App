import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectToDatabase } from './DbConnection.js';
import jwt, { decode } from "jsonwebtoken"
import orderRoute from './routes/orderRoute.js';
import cors from 'cors'

dotenv.config();

const app = express();

app.use(cors())

app.use(bodyParser.json());

app.use((req,res,next)=>{
    let token = req.header
    ("Authorization")

    if(token!=null){
        token = token.replace("Bearer ","");
        jwt.verify(token,process.env.SEKRET_KEY,
            (err,decode)=>{
                if(!err){
                    req.user = decode;
                }
            }
        );
    }
    next()

});

connectToDatabase();

app.use("/api/v1/orders",orderRoute)

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})


