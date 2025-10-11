
import express from "express";
const route = express.Router();
import * as categoryController from '../controller/categoryController.js'
import Jwt_Auth from "../auth/auth.js";
// route.post("/saveCategory",Jwt_Auth.tokenAuth,categoryController.saveCategory);

export default route;