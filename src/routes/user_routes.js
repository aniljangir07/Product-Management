import { Router } from "express";
const route = Router();
import {loginUser, registerUser} from '../controllers/user_controller.js'

route.post('/register',registerUser);

route.post('/login',loginUser);

export default route;