import express from 'express'
const route = express.Router();
import Jwt_Auth from "../auth/auth.js";

import * as userController from '../controller/myUserController.js'
route.post("/saveUser",userController.saveUser);
route.post("/verifyOtp",userController.verifyUser);
route.post("/loginUser",userController.loginUser);
route.get("/userList",userController.fetchUserList);
route.delete("/deleteUser/:_id",Jwt_Auth.tokenAuth,userController.deleteUser)
route.put("/editprofile/:_id",Jwt_Auth.tokenAuth,userController.editprofile)
export default route;