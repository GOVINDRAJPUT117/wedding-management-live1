// import '../connection/dbconfig.js'
// import rs from 'randomstring' 
// import path from 'path'
// import url from 'url'
// import APIResponse from '../response/APIResponse.js'
// import serviceSchemaModel from '../model/services.js'
// const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// save service
// export var saveService = async (req,res,next)=>
// {
//     var service_detail=req.body;
//     var img_file = req.files.service_image;

//     var service_list = await serviceSchemaModel.find();
//      var len = service_list.length;
//       var _id = (len==0) ? 1 :service_list[len-1]._id+1;

//       var image_name = Date.now()+"-"+rs.generate()+"-"+img_file.name;
      
//     service_detail = {...service_detail,'_id':_id,'service_image':image_name,"info":Date()};

//     try
//     {
//         var resp = await serviceSchemaModel.create(service_detail);  
        
//      var upload_path = path.join(__dirname,"../../frontend/public/upload/service",image_name)

//         img_file.mv(upload_path);
//         res.status(200).json(new APIResponse(true,resp,"service Details Save"));

//     }
//         catch(err)
//     {
//         console.log("Save service Image : "+err);
//         res.status(200).json(new APIResponse(false,null,"service Details Not Save"));
//     }
      

// }
import '../connection/dbconfig.js'
import path from "path";
import fs from "fs";
import APIResponse from '../response/APIResponse.js'
import serviceSchemaModel from '../model/services.js'
import bookingSchemaModel from '../model/BookingModel.js'
import catSchemaModel from '../model/category.js'   


export const saveService = async (req, res, next) => {
  try {
    const { service_name, service_description, service_price, category } = req.body;
    const img_file = req.file;

    // Validate required fields
    if (!service_name || !service_description || !service_price || !category) {
      return res.status(400).json(new APIResponse(false, null, "All fields are required"));
    }

    if (!img_file) {
      return res.status(400).json(new APIResponse(false, null, "Service image is required"));
    }

    // Category handling
    const categoryName = category.toLowerCase().trim();
    let catDoc = await catSchemaModel.findOne({ catName: categoryName });
    if (!catDoc) catDoc = await catSchemaModel.create({ catName: categoryName });

    // Prepare service object
    const service_detail = {
      service_name: service_name.toLowerCase().trim(),
      service_description: service_description.toLowerCase().trim(),
      service_price: Number(service_price),
      category: catDoc._id,
      service_image: img_file.filename,
      info: new Date()
    };

    const savedService = await serviceSchemaModel.create(service_detail);

    // Success response using APIResponse
    res.status(200).json(new APIResponse(true, savedService, "Service saved successfully"));

  } catch (err) {
    console.error("Save service error:", err);
    res.status(500).json(new APIResponse(false, null, "Service not saved", err.message));
  }
};





 // FETCH 
export const fetchAllServices = async (req, res,next) => {
  try {
    const service = await serviceSchemaModel.find().populate("category");
    console.log("service",service)
   res.status(200).json(new APIResponse(true, service, "service Details Save"));

  } catch (err) {
    res.status(200).json({ message: "Failed to fetch services", error: err });
    console.log("err",err)
  }
};




export const deleteServices = async (req, res, next) => {
  try {
    const id = req.params.id; // Convert to Number, because your _id is Number type
    console.log("Deleting Service ID:", id);

    // Delete service
    const service = await serviceSchemaModel.findOneAndDelete({ _id: id });
    if (!service) {
      return res.status(404).json(new APIResponse(false, null, "Service not found"));
    }

    // Update bookings related to this service
    await bookingSchemaModel.updateMany(
      { serviceId: id },
      { $set: { status: "cancelled", info: "Service deleted by admin" } }
    );

    res.status(200).json(new APIResponse(true, service, "Deleted service and updated related bookings"));
  } catch (err) {
    console.error("Error deleting service:", err);
    res.status(500).json(new APIResponse(false, null, "Internal Server Error"));
  }
};



export const updateService = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { service_name, service_description, service_price, category } = req.body;
    const img_file = req.file; // single file via multer

    // Validate required fields
    if (!service_name || !service_description || !service_price || !category) {
      return res.status(400).json(new APIResponse(false, null, "All fields are required"));
    }

    // Fetch existing service
    const existingService = await serviceSchemaModel.findById(id);
    if (!existingService) {
      return res.status(404).json(new APIResponse(false, null, "Service not found"));
    }

    // Category handling like saveService
    const categoryName = category.toLowerCase().trim();
    let catDoc = await catSchemaModel.findOne({ catName: categoryName });
    if (!catDoc) catDoc = await catSchemaModel.create({ catName: categoryName });

    // Prepare updated service object
    const service_detail = {
      service_name: service_name.toLowerCase().trim(),
      service_description: service_description.toLowerCase().trim(),
      service_price: Number(service_price),
      category: catDoc._id,
      info: new Date(),
      service_image: existingService.service_image // preserve existing image
    };

    // Handle new image: delete old image if exists
    if (img_file) {
      const oldImagePath = path.join(process.cwd(), "backend", "uploads", existingService.service_image);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      service_detail.service_image = img_file.filename; // Multer already gives unique filename
    }

    // Update service in DB
    const updatedService = await serviceSchemaModel.findByIdAndUpdate(id, service_detail, { new: true });

    // Success response
    res.status(200).json(new APIResponse(true, updatedService, "Service updated successfully"));

  } catch (err) {
    console.error("Update service error:", err);
    res.status(500).json(new APIResponse(false, null, "Service update failed", err.message));
  }
};


//fetching service with category

export const fetchcategory = async (req, res, next) => {
  try {
    const cat = req.params.name.toLowerCase(); // convert to lowercase for comparison
    console.log("cat=" + cat);

    // Use the correct field name for populate
    const services = await serviceSchemaModel.find().populate("category");
    console.log("services=", services);

    // Filter services by category name
    const filterService = services.filter(
      (service) => service.category && service.category.catName === cat
    );
    console.log("filteredService=", filterService);

    if (filterService.length === 0) {
      return res
        .status(404)
        .json(new APIResponse(false, null, "Category not found"));
    }

    res
      .status(200)
      .json(new APIResponse(true, filterService, "Services fetched successfully"));
  } catch (err) {
    console.error("Fetch category error:", err);
    res.status(500).json(new APIResponse(false, null, "Failed to fetch services", err.message));
  }
};



export const Nofetchcategory = async (req, res, next) => {
  try {
    const cat = decodeURIComponent(req.params.name).trim().toLowerCase();
    console.log("cat = " + cat);

    // ✅ Corrected populate
    const service = await serviceSchemaModel.find().populate("category");
    console.log("service", service);

    const filterservice = service.filter(
      (item) => item.category.catName.toLowerCase() === cat
    );

    console.log("filteredService", filterservice);

    if (filterservice.length === 0) {
      return res
        .status(404)
        .json(new APIResponse(false, null, "Category not found"));
    }

    res
      .status(200)
      .json(new APIResponse(true, filterservice, "Service fetched successfully"));
  } catch (error) {
    console.error("Error in Nofetchcategory:", error);
    res
      .status(500)
      .json(new APIResponse(false, null, "Internal Server Error"));
  }
};
