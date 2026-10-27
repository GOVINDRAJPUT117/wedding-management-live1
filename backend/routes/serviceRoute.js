
// import express from "express";
// import { upload } from "../upload/upload.js"
// const route = express.Router();
// import * as serviceController from '../controller/serviceController.js'
// import Jwt_Auth from "../auth/auth.js";
// route.post("/saveService",Jwt_Auth.tokenAuth,upload.single("service_image")
// ,serviceController.saveService);
// route.get("/fetchAllServices",Jwt_Auth.tokenAuth,serviceController.fetchAllServices);
// route.delete("/deleteServices/:id",Jwt_Auth.tokenAuth,serviceController.deleteServices);
// route.put("/updateService/:id",Jwt_Auth.tokenAuth,upload.single('service_image'),serviceController.updateService);
// route.get("/category/:name",Jwt_Auth.tokenAuth,serviceController.fetchcategory)
// route.get("/cat/:name",serviceController.Nofetchcategory)

// export default route;



import express from 'express';
import { upload } from '../upload/upload.js';
import * as serviceController from '../controller/serviceController.js';
import Jwt_Auth from '../auth/auth.js';

const route = express.Router();

// Admin only: create a service
route.post(
  '/saveService',
  Jwt_Auth.tokenAuth,
  Jwt_Auth.requireAdmin,
  upload.single('service_image'),
  serviceController.saveService
);

// Logged-in users can view services
route.get(
  '/fetchAllServices',
  Jwt_Auth.tokenAuth,
  serviceController.fetchAllServices
);

// Admin only: delete a service
route.delete(
  '/deleteServices/:id',
  Jwt_Auth.tokenAuth,
  Jwt_Auth.requireAdmin,
  serviceController.deleteServices
);

// Admin only: update a service
route.put(
  '/updateService/:id',
  Jwt_Auth.tokenAuth,
  Jwt_Auth.requireAdmin,
  upload.single('service_image'),
  serviceController.updateService
);

// Logged-in users can view a category
route.get(
  '/category/:name',
  Jwt_Auth.tokenAuth,
  serviceController.fetchcategory
);

// Public category endpoint
route.get(
  '/cat/:name',
  serviceController.Nofetchcategory
);

export default route;
