import '../connection/dbconfig.js'
import mongoose from "mongoose";
import APIResponse from '../response/APIResponse.js';
import bookingSchemaModel from '../model/BookingModel.js'

//Booking Save
export const saveBooking = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { serviceId, name, serviceName, price, status } = req.body;

    const existingBooking = await bookingSchemaModel.findOne({
      userId,
      serviceId
    });

    if (existingBooking) {
      return res.status(400).json(
        new APIResponse(
          false,
          null,
          "You have already booked this service"
        )
      );
    }

    const saved = await bookingSchemaModel.create({
      userId,
      serviceId,
      name,
      serviceName,
      price,
      status,
      info: Date()
    });

    return res.status(200).json(
      new APIResponse(
        true,
        saved,
        "Booking saved successfully"
      )
    );

  } catch (err) {
    return res.status(500).json(
      new APIResponse(
        false,
        null,
        "Booking not saved successfully"
      )
    );
  }
};


//getAllBookings
export const getAllBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await BookingModel.find({ userId })
      .populate("serviceId", "service_name service_description service_price service_image category") // service details
      .populate("userId", "name email");

    if (!bookings || bookings.length === 0) {
      return res
        .status(404)
        .json(new APIResponse(false, null, "No bookings found for this user"));
    }

    res.status(200).json(
      new APIResponse(true, bookings, "User bookings fetched successfully")
    );
  } catch (err) {
    res
      .status(500)
      .json(new APIResponse(false, null, "Failed to fetch user bookings"));
  }
};



// deletebooking
export const deletebooking = async (req, res, next) => {
  try {
    const id = req.params._id;

    const book_data = await bookingSchemaModel.findByIdAndDelete(id);

    if (!book_data) {
      return res.status(404).json(
        new APIResponse(false, null, "Booking record not found")
      );
    }

    return res.status(200).json(
      new APIResponse(true, book_data, "Booking deleted successfully")
    );

  } catch (error) {
    return res.status(500).json(
      new APIResponse(false, null, "Unable to delete booking")
    );
  }
};


// updateBookingStatus
export const updateBookingStatus = async (req, res) => {
  try {
    const bookingId = req.params._id;
    const newStatus = req.body.status;

    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json(
        new APIResponse(false, null, "Invalid booking ID")
      );
    }

    // Validate status
    const allowedStatuses = ["pending", "confirmed", "cancelled"];

    if (!allowedStatuses.includes(newStatus)) {
      return res.status(400).json(
        new APIResponse(false, null, "Invalid booking status")
      );
    }

    const updatedBooking = await bookingSchemaModel.findByIdAndUpdate(
      bookingId,
      { status: newStatus },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedBooking) {
      return res.status(404).json(
        new APIResponse(false, null, "Booking not found")
      );
    }

    return res.status(200).json(
      new APIResponse(true, updatedBooking, "Booking status updated successfully")
    );

  } catch (err) {
    return res.status(500).json(
      new APIResponse(false, null, "Unable to update booking status")
    );
  }
};

// admin fetch booking services

export const getPendingBookings = async (req, res) => {
  try {
    const pendingBookings = await bookingSchemaModel
      .find({ status: "pending" })
      .populate({
        path: "serviceId",
        populate: {
          path: "category",
          model: "category"
        }
      })
      .populate("userId");

    return res.status(200).json({
      status: true,
      data: pendingBookings
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to fetch pending bookings"
    });
  }
};




export const getConfirmedBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await bookingSchemaModel.find({
      status: "confirmed",
      userId: userId
    })
      .populate({
        path: "serviceId",
        populate: {
          path: "category",
          model: "category"
        }
      })
      .populate("userId", "name email");

    return res.status(200).json({
      status: true,
      data: bookings
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to fetch confirmed bookings"
    });
  }
};

