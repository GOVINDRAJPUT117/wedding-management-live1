import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl = process.env.DB;

const connectDB = async () => {
  try {
    if (!mongoUrl) {
      throw new Error("DB environment variable is missing");
    }

    await mongoose.connect(mongoUrl);

    console.log("✅ Connected to MongoDB");
  } catch (err) {
    process.exit(1);
  }
};

export default connectDB;
