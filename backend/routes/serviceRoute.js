
import express from 'express';
import { upload } from '../upload/upload.js';
import * as serviceController from '../controller/serviceController.js';
import Jwt_Auth from '../auth/auth.js';

const route = express.Router();

route.post('/saveService', Jwt_Auth.tokenAuth, Jwt_Auth.requireAdmin, upload.single('service_image'), serviceController.saveService);

route.get('/fetchAllServices', serviceController.fetchAllServices);

route.delete('/deleteServices/:id', Jwt_Auth.tokenAuth, Jwt_Auth.requireAdmin, serviceController.deleteServices);

route.put('/updateService/:id', Jwt_Auth.tokenAuth, Jwt_Auth.requireAdmin, upload.single('service_image'), serviceController.updateService);

route.get('/category/:name', serviceController.fetchcategory);

route.get('/cat/:name', serviceController.Nofetchcategory);

export default route;
