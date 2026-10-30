import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import userSchemaModel from '../model/userModel.js';

dotenv.config();

class Jwt_Auth {
  generatetoken(userId) {
    const token = jwt.sign(
      { userId },
      process.env.TOKEN_SECRET,
      { expiresIn: '2h' }
    );

    return token;
  }

  tokenAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        status: false,
        message: 'Token Missing'
      });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, tokenData) => {
      if (err) {
        return res.status(401).json({
          status: false,
          message: 'Token Invalid or Expired'
        });
      }

      req.user = { _id: tokenData.userId };
      next();
    });
  };

  requireAdmin = async (req, res, next) => {
    try {
      const user = await userSchemaModel
        .findById(req.user._id)
        .select('role');

      if (!user) {
        return res.status(401).json({
          status: false,
          message: 'User not found'
        });
      }

      if (user.role !== 'admin') {
        return res.status(403).json({
          status: false,
          message: 'Admin access required'
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: 'Authorization failed'
      });
    }
  };
}

export default new Jwt_Auth();

