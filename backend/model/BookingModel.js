import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const bookingSchema = new mongoose.Schema({
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',         
    required: true
  },
  
  name: {
    type: String,       
  },

  serviceId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Service',      
    required: true
  },

  status: {
    type: String,
    default: "pending",
    enum: ["pending", "confirmed", "success", "cancelled"]
  },


  price: Number,
  info: String
}, {
  timestamps: true
});

bookingSchema.plugin(mongooseUniqueValidator);

const bookingSchemaModel = mongoose.model('booking', bookingSchema, 'booking');
export default bookingSchemaModel;








// import mongoose from "mongoose";
// import mongooseUniqueValidator from "mongoose-unique-validator";

// const bookingSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "user",  // user ka reference
//     required: true
//   },
//   serviceId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "service", // service ka reference
//     required: true
//   },
//   serviceName: {
//     type: String, // service ka naam save karne ke liye
//     required: true
//   },
//   price: {
//     type: Number, // service ka price
//     required: true
//   },
//   status: {
//     type: String,
//     default: "confirmed", // admin confirm hone par ye save hoga
//     enum: ["pending", "confirmed", "success", "cancelled"]
//   },
//   info: {
//     type: String, // extra info agar chahiye
//   }
// }, {
//   timestamps: true
// });

// bookingSchema.plugin(mongooseUniqueValidator);

// const BookingModel = mongoose.model("booking", bookingSchema, "booking");
// export default BookingModel;





