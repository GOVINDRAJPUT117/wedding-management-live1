import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const serviceSchema = new mongoose.Schema(
  {
    service_name: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, "Service Name is required"],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: [true, "Category is required"],
    },

    service_description: {
      type: String,
      lowercase: true,
      required: [true, "Description is required"],
      trim: true,
    },

    service_image: {
      type: String,
      required: [true, "Service image is required"],
      trim: true,
    },

   
    service_image_public_id: {
      type: String,
      default: null,
    },

    service_price: {
      type: Number,
      required: [true, "Service Price is required"],
    },

    uid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    info: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

serviceSchema.plugin(mongooseUniqueValidator, {
  message: "{PATH} must be unique",
});

const Service = mongoose.model("Service", serviceSchema);

export default Service;
