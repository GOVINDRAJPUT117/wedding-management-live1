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


