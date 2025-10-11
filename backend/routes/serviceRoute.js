
import express from "express";
import { upload } from "../upload/upload.js"
const route = express.Router();
import * as serviceController from '../controller/serviceController.js'
import Jwt_Auth from "../auth/auth.js";
route.post("/saveService",Jwt_Auth.tokenAuth,upload.single("service_image")
,serviceController.saveService);
route.get("/fetchAllServices",Jwt_Auth.tokenAuth,serviceController.fetchAllServices);
route.delete("/deleteServices/:id",Jwt_Auth.tokenAuth,serviceController.deleteServices);
route.put("/updateService/:id",Jwt_Auth.tokenAuth,upload.single('service_image'),serviceController.updateService);
route.get("/category/:name",Jwt_Auth.tokenAuth,serviceController.fetchcategory)
route.get("/cat/:name",serviceController.Nofetchcategory)

export default route;