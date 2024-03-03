import jwt from 'jsonwebtoken';
import resMessage from '../../constants/message.js';
import status from '../../constants/status.js';

import { config } from 'dotenv';
config();

const JWT_SECRET = process.env.SECRET_KEY;

const authenticateUser = (req, res, next) => {
      const token = req.headers.authorization;

      if (!token || !token.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized: No token provided' });
    
      const tokenString = token.substring('Bearer '.length);
      try {
            const decoded = jwt.verify(tokenString, JWT_SECRET);
            req.user = decoded;
            next();
      } catch (error) {
            console.error('Error verifying token:', error);
            return res.status(status.BAD_REQUEST).json({ error: resMessage.INTERNAL_SERVER_ERR });
      };
};

export default authenticateUser;
