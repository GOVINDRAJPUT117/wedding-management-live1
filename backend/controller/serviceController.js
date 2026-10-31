import '../connection/dbconfig.js';
import APIResponse from '../response/APIResponse.js';
import serviceSchemaModel from '../model/services.js';
import bookingSchemaModel from '../model/BookingModel.js';
import catSchemaModel from '../model/category.js';
import cloudinary from "../connection/cloudinary.js";

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "shaadivibes/services",
        resource_type: "image"
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(buffer);
  });
};


//saveService

export const saveService = async (req, res, next) => {
  try {
    const {
      service_name,
      service_description,
      service_price,
      category,
    } = req.body;

    const img_file = req.file;

    if (!service_name || !service_description || !service_price || !category) {
      return res.status(400).json(
        new APIResponse(false, null, "All fields are required")
      );
    }

    if (!img_file) {
      return res.status(400).json(
        new APIResponse(false, null, "Service image is required")
      );
    }

    const categoryName = category.toLowerCase().trim();

    let catDoc = await catSchemaModel.findOne({
      catName: categoryName,
    });

    if (!catDoc) {
      catDoc = await catSchemaModel.create({
        catName: categoryName,
      });
    }

   
    const cloudinaryResult = await uploadToCloudinary(img_file.buffer);

    const service_detail = {
      service_name: service_name.toLowerCase().trim(),
      service_description: service_description.toLowerCase().trim(),
      service_price: Number(service_price),
      category: catDoc._id,

      
      service_image: cloudinaryResult.secure_url,

     
      service_image_public_id: cloudinaryResult.public_id,

      info: new Date(),
    };

    const savedService = await serviceSchemaModel.create(service_detail);

    return res.status(200).json(
      new APIResponse(true, savedService, "Service saved successfully")
    );

  } catch (err) {
   return res.status(500).json(
      new APIResponse(false, null, "Service not saved", err.message)
    );
  }
};

// FETCH 


export const fetchAllServices = async (req, res, next) => {
  try {
    const service = await serviceSchemaModel.find().populate("category");

    return res.status(200).json(
      new APIResponse(true, service, "service Details Save")
    );

  } catch (err) {
    return res.status(200).json({
      message: "Failed to fetch services",
      error: err
    });
  }
};

//deleteServices

export const deleteServices = async (req, res, next) => {
  try {
    const id = req.params.id;

    const service = await serviceSchemaModel.findOneAndDelete({
      _id: id
    });

    if (!service) {
      return res.status(404).json(
        new APIResponse(false, null, "Service not found")
      );
    }

    // Delete image from Cloudinary
    if (service.service_image_public_id) {
      try {
        await cloudinary.uploader.destroy(
          service.service_image_public_id
        );
      } catch (imageError) {
        console.log("Cloudinary image delete error:", imageError);
      }
    }

    // Cancel related bookings
    await bookingSchemaModel.updateMany(
      { serviceId: id },
      {
        $set: {
          status: "cancelled",
          info: "Service deleted by admin"
        }
      }
    );

    return res.status(200).json(
      new APIResponse(
        true,
        service,
        "Deleted service and updated related bookings"
      )
    );

  } catch (err) {
  return res.status(500).json(
      new APIResponse(false, null, "Internal Server Error")
    );
  }
};

//updateService

export const updateService = async (req, res, next) => {
  let newImagePublicId = null;

  try {
    const id = req.params.id;

    const {
      service_name,
      service_description,
      service_price,
      category
    } = req.body;

    const img_file = req.file;

    if (!service_name || !service_description || !service_price || !category) {
      return res.status(400).json(
        new APIResponse(false, null, "All fields are required")
      );
    }

    const existingService = await serviceSchemaModel.findById(id);

    if (!existingService) {
      return res.status(404).json(
        new APIResponse(false, null, "Service not found")
      );
    }

    const categoryName = category.toLowerCase().trim();

    let catDoc = await catSchemaModel.findOne({
      catName: categoryName
    });

    if (!catDoc) {
      catDoc = await catSchemaModel.create({
        catName: categoryName
      });
    }

    const service_detail = {
      service_name: service_name.toLowerCase().trim(),
      service_description: service_description.toLowerCase().trim(),
      service_price: Number(service_price),
      category: catDoc._id,
      info: new Date()
    };

    
    if (img_file) {
      const cloudinaryResult = await uploadToCloudinary(
        img_file.buffer
      );

      newImagePublicId = cloudinaryResult.public_id;

      service_detail.service_image = cloudinaryResult.secure_url;
      service_detail.service_image_public_id = cloudinaryResult.public_id;
    }

    const updatedService = await serviceSchemaModel.findByIdAndUpdate(
      id,
      service_detail,
      { new: true, runValidators: true }
    );

   
    if (
      img_file &&
      existingService.service_image_public_id
    ) {
      try {
        await cloudinary.uploader.destroy(
          existingService.service_image_public_id
        );
      } catch (imageError) {
        console.log("Old Cloudinary image delete error:", imageError);
      }
    }

    return res.status(200).json(
      new APIResponse(true, updatedService, "Service updated successfully")
    );

  } catch (err) {
    
    if (newImagePublicId) {
      try {
        await cloudinary.uploader.destroy(newImagePublicId);
      } catch (imageError) {
        console.log("New image cleanup error:", imageError);
      }
    }
      return res.status(500).json(
      new APIResponse(false, null, "Service update failed", err.message)
    );
  }
};

//fetching service with category


export const fetchcategory = async (req, res, next) => {
  try {
    const cat = req.params.name.toLowerCase();

    const services = await serviceSchemaModel.find().populate("category");

    const filterService = services.filter(
      (service) => service.category && service.category.catName === cat
    );

    if (filterService.length === 0) {
      return res
        .status(404)
        .json(new APIResponse(false, null, "Category not found"));
    }

    return res
      .status(200)
      .json(
        new APIResponse(true, filterService, "Services fetched successfully")
      );

  } catch (err) {
    return res.status(500).json(
      new APIResponse(false, null, "Failed to fetch services", err.message)
    );
  }
};



//Nofetchcategory
export const Nofetchcategory = async (req, res, next) => {
  try {
    const cat = decodeURIComponent(req.params.name).trim().toLowerCase();

    const service = await serviceSchemaModel.find().populate("category");

    const filterservice = service.filter(
      (item) => item.category.catName.toLowerCase() === cat
    );

    if (filterservice.length === 0) {
      return res
        .status(404)
        .json(new APIResponse(false, null, "Category not found"));
    }

    return res
      .status(200)
      .json(
        new APIResponse(true, filterservice, "Service fetched successfully")
      );

  } catch (error) {
    return res
      .status(500)
      .json(new APIResponse(false, null, "Internal Server Error"));
  }
};
