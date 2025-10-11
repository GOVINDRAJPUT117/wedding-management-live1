import express from "express";
const route = express.Router();
 import Jwt_Auth from "../auth/auth.js";
import * as bookingController from '../controller/BookingController.js'
route.post("/saveBooking",Jwt_Auth.tokenAuth,bookingController.saveBooking);
route.get("/getAllBookings/:userId",Jwt_Auth.tokenAuth,bookingController.getAllBookings);
route.delete("/removeBooking/:_id", Jwt_Auth.tokenAuth,bookingController.deletebooking);
route.put("/updateStatus/:_id",Jwt_Auth.tokenAuth, bookingController.updateBookingStatus);
route.get("/pendingBookings", Jwt_Auth.tokenAuth, bookingController.getPendingBookings);
route.get("/confirmed",Jwt_Auth.tokenAuth, bookingController.getConfirmedBookings);



export default route;