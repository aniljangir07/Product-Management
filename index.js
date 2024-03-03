import express from "express";
const app = express();
import cors from 'cors';
import { config } from 'dotenv';
config();

app.use(cors());

app.use(express.json());

import statusCodes from './constants/status.js';
import resMessages from './constants/message.js';

//Importing database connection file
import { connectToServer } from "./src/db/db_connection.js";

//Importing routes
import productRoute from './src/routes/product_routes.js';
import userRoute from './src/routes/user_routes.js';

//Mounting routes
app.use('/product',productRoute);
app.use('/',userRoute);
















// This should be the last route else any after routes wont work
app.use("*", (req,res,next) => {
      res.status(statusCodes.NOT_FOUND).json({
            success: false,
            message: resMessages.ROUTE_NOT_FOUND,
      });
});

const PORT = process.env.PORT || 3030;

// Making server listening if database is connected
connectToServer()
      .then(() => {
            app.listen(PORT,(err)=>{
                  if(err){
                        console.log(`Server is listening on port ${err}`)
                  }else{
                        console.log(`Server connection ${PORT}`);
                  };
            });
      })
      .catch((error) => {
            console.log("Error connecting to MongoDB:", error);
      });