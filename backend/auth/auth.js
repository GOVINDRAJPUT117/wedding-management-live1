import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

class Jwt_Auth {
   generatetoken(userId) {
      const token = jwt.sign({ userId }, process.env.TOKEN_SECRET, {
         expiresIn: '2h'
      });
      return token;
   }

   tokenAuth = (req, res, next) => {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
         return res.status(401).json({ status: false, message: "Token Missing" });
      }

      jwt.verify(token, process.env.TOKEN_SECRET, (err, tokenData) => {
         if (err) {
            return res.status(401).json({ status: false, message: "Token Invalid" });
         }

         // req.user = tokenData.userId;
         req.user = { _id: tokenData.userId }; 
         next(); 
      });
   }
}

export default new Jwt_Auth();
