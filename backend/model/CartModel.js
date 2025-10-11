
import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "user", 
    required: true
  },
  name: { 
    type: String,
    required: true
  },
  items: [
    {
      serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service", 
        required: true
      },
      serviceName: { type: String, required: true }, 
      price: { type: Number, required: true },       
      status: {
        type: String,
        default: "pending", 
        enum: ["pending", "confirmed"] 
      }
    }
  ]
}, {
  timestamps: true
});

cartSchema.plugin(mongooseUniqueValidator);

const CartModel = mongoose.model('cart', cartSchema);
export default CartModel;
