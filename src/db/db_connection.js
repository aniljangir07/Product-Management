import mongoose from "mongoose";
import { config } from 'dotenv';
config();

const DB_URL = process.env.DB_URL;
const connectToServer = () => {
      return new Promise((resolve, reject) => {
            mongoose.connect(DB_URL)
            .then(() => {
                  console.log('MongoDB is connecting successfully')
                  resolve();
            })
            .catch((error) => {
                  reject(error);
            });
      });
};

export { connectToServer };
