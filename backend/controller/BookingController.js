import '../connection/dbconfig.js'
import APIResponse from '../response/APIResponse.js';
import bookingSchemaModel from '../model/BookingModel.js'
export const saveBooking = async (req, res, next) => {
  try {
    const { userId, serviceId, name, serviceName, price, status } = req.body;

    console.log("Received booking data:", JSON.stringify(req.body));

    // if user already booked this service
    const existingBooking = await bookingSchemaModel.findOne({
      userId,
      serviceId
    });

    if (existingBooking) {
      return res.status(400).json(new APIResponse(false, null, "You have already booked this service"));
    }

    // 2️ Create new booking
    const saved = await bookingSchemaModel.create({
      userId,
      serviceId,
      name,
      serviceName,
      price,
      status,
      info: Date()
    });

    console.log("Booking saved:", saved);
    res.status(200).json(new APIResponse(true, saved, "Booking saved successfully"));

  } catch (err) {
    console.log("Error saving booking:", err);
    res.status(500).json(new APIResponse(false, null, "Booking not saved successfully"));
  }
};


export const getAllBookings = async (req, res) => {
  try {
    const userId = req.user._id; // Logged-in user ID

    // Fetch bookings for this user only
    const bookings = await BookingModel.find({ userId })
      .populate("serviceId", "service_name service_description service_price service_image category") // service details
      .populate("userId", "name email"); // optional, populated user info

    if (!bookings || bookings.length === 0) {
      return res
        .status(404)
        .json(new APIResponse(false, null, "No bookings found for this user"));
    }

    res.status(200).json(
      new APIResponse(true, bookings, "User bookings fetched successfully")
    );
  } catch (err) {
    console.error("Fetch user bookings error:", err);
    res
      .status(500)
      .json(new APIResponse(false, null, "Failed to fetch user bookings"));
  }
};




export const deletebooking = async (req, res, next) => {
  try {
    const id = req.params._id;  
    console.log(" data id is: " + id);

    const book_data = await bookingSchemaModel.findByIdAndDelete(id);  

    if (!book_data) {
      return res.status(200).json(new APIResponse(false, null, "Booking record not found"));
    }

    res.status(200).json(new APIResponse(true, book_data, "Booking deleted successfully"));
  } catch (error) {
    console.error("  Error deleting booking:", error.message);
    
  }
};


// controllers/bookingController.js
export const updateBookingStatus = async (req, res) => {
  try {
    const bookingId = req.params._id;
    const newStatus = req.body.status;

    const updatedBooking = await bookingSchemaModel.findByIdAndUpdate(
      bookingId,
      { status: newStatus },
      { new: true }
    );
console.log("ho gyi confirm",updatedBooking)
    if (!updatedBooking) {
    res.status(202).json(new APIResponse({
        status: false,
        message: "Booking not found"
      }));
    }
    else
    {

   res.status(200).json(new APIResponse({
        status: true,
         data: updatedBooking,
        message: "Booking status updated successfully",
      }));
  
  }
  } catch (err) {
    console.log("Error updating status:", err);
   
  }
};

// admin fetch booking services

export const getPendingBookings = async (req, res) => {
  try {
    const pendingBookings = await bookingSchemaModel.find({ status: "pending" })
      .populate({
        path: 'serviceId',
        populate: {
          path: 'category',       // category ko bhi populate karo
          model: 'category'
        }
      })
      .populate('userId')    //  fetch full user details

    res.status(200).json({
      status: true,
      data: pendingBookings
    });
  } catch (error) {
    console.error("Error fetching pending bookings:", error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch pending bookings"
    });
  }
};


export const getConfirmedBookings = async (req, res) => {
  try {
    // assume req.userId me logged-in user ka id hai
    const userId = req.user; 

    const bookings = await bookingSchemaModel.find({ 
      status: "confirmed", 
      userId: userId     // ✅ filter by logged-in user
    })
    .populate({
      path: 'serviceId',
      populate: {
        path: 'category',       // nested populate for category
        model: 'category'
      }
    })
    .populate('userId'); // user details bhi chahiye

    console.log("Confirmed bookings for user:", bookings);

    res.status(200).json({
      status: true,
      data: bookings
    });
  } catch (error) {
    console.error("Error fetching confirmed bookings:", error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch confirmed bookings"
    });
  }
};





