import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from '../model/user_model.js';
import resMessage from '../../constants/message.js';
import statusMsg from '../../constants/status.js';
import { config } from 'dotenv';
config();

export const registerUser = async (req, res) => {
      try {
            const { username, firstName, lastName, mobileNumber, email, password } = req.body;

            const existingUser = await User.findOne({ $or: [{ username }, { email }] });

            if (existingUser) return res.status(statusMsg.BAD_REQUEST).json({ error: resMessage.ALREADY_EXIST_USER });

            const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds
            const newUser = new User({username,firstName,lastName,mobileNumber,email,password: hashedPassword});
            const savedUser = await newUser.save();

            res.status(statusMsg.SUCCESS).json({ message: resMessage.REGISTERATION_SUCCESSFULL });
      } catch (error) {
            console.error('Error registering user:', error);
            if (error instanceof mongoose.Error.ValidationError) {
                  const validationErrors = {};
                  for (const field in error.errors) {
                        validationErrors[field] = error.errors[field].message;
                  }
                  return res.status(statusMsg.BAD_REQUEST).json({ errors: validationErrors });
            };
            res.status(statusMsg.ERROR).json({ error: resMessage.INTERNAL_SERVER_ERR });
      }
};

export const loginUser = async (req, res) => {
      try {
            const { username, password } = req.body;

            const user = await User.findOne({ username });
            if (!user) return res.status(statusMsg.UNAUTHORIZED).json({ error: resMessage.REGISTER_FIRST });

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) return res.status(statusMsg.UNAUTHORIZED).json({ error: resMessage.INVALID_CREDIENTIAL });

            const secretKey = process.env.SECRET_KEY;
            
            const token = jwt.sign(
                  { username: user.username, email: user.email },
                  secretKey,
                  { expiresIn: '1h' }
            );
            res.json({ token });
      } catch (error) {
            console.error('Error logging in:', error);
            res.status(statusMsg.BAD_REQUEST).json({ error: resMessage.INTERNAL_SERVER_ERR });
      };
};
  