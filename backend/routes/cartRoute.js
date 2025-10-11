import express from "express";
const route = express.Router();
import Jwt_Auth from "../auth/auth.js";
import * as cartController from '../controller/CartController.js'
route.post("/cartService",Jwt_Auth.tokenAuth,cartController.addToCart);
route.get("/fetchCart/:userId",Jwt_Auth.tokenAuth,cartController.fetchCart)
route.get("/fetchPendingBookings",Jwt_Auth.tokenAuth,cartController.fetchPendingBookings)
route.post("/ConfirmBookings/:itemId",Jwt_Auth.tokenAuth,cartController.confirmBooking)
route.delete("/removeCartItem/:itemId",Jwt_Auth.tokenAuth,cartController.removeCartItem)


export default route;
