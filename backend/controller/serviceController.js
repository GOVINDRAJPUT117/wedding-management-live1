import '../connection/dbconfig.js'
import path from "path";
import fs from "fs";
import APIResponse from '../response/APIResponse.js'
import serviceSchemaModel from '../model/services.js'
import bookingSchemaModel from '../model/BookingModel.js'
import catSchemaModel from '../model/category.js'   

//saveService

export const saveService = async (req, res, next) => {
  try {
    const { service_name, service_description, service_price, category } = req.body;
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
      service_image: img_file.filename,
      info: new Date()
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

    const service = await serviceSchemaModel.findOneAndDelete({ _id: id });

    if (!service) {
      return res.status(404).json(
        new APIResponse(false, null, "Service not found")
      );
    }

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
  try {
    const id = req.params.id;
    const { service_name, service_description, service_price, category } = req.body;
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
      info: new Date(),
      service_image: existingService.service_image
    };

    if (img_file) {
      const oldImagePath = path.join(
        process.cwd(),
        "backend",
        "uploads",
        existingService.service_image
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      service_detail.service_image = img_file.filename;
    }

    const updatedService = await serviceSchemaModel.findByIdAndUpdate(
      id,
      service_detail,
      { new: true }
    );

    return res.status(200).json(
      new APIResponse(true, updatedService, "Service updated successfully")
    );

  } catch (err) {
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
