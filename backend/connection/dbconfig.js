// // backend/dbconfig.js
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// dotenv.config();

// const mongoUrl = process.env.DB;

// const connectDB = async () => {
//   try {
//     await mongoose.connect(mongoUrl, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("✅ Connected to MongoDB");
//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err);
//     process.exit(1); // Exit app if DB connection fails
//   }
// };

// export default connectDB;


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
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
