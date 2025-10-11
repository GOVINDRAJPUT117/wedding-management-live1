

// import express from "express";
// import bodyParser from "body-parser";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";
// import session from "express-session";
// import MongoStore from "connect-mongo";
// import path from "path"

// // Routes
// import userRoute from './routes/userRoute.js';
// import categoryRoute from './routes/categoryRoute.js';
// import serviceRoute from './routes/serviceRoute.js';
// import bookingRoute from './routes/bookingRoute.js';
// import cartRoute from './routes/cartRoute.js';

// dotenv.config(); // Load .env variables

// const app = express();

// // ------------------ CORS ------------------
// app.use(cors({
//   origin: "http://localhost:5173",  // Frontend URL
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true
// }));
// app.options("*", cors());  // Preflight requests

// // ------------------ Body Parser ------------------
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // ------------------ MongoDB Local Connection ------------------
// const mongoUrl = 'mongodb://127.0.0.1:27017/weddingmanagment';

// mongoose.connect(mongoUrl, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log(" Connected to Local MongoDB"))
// .catch((err) => console.error(" MongoDB connection error:", err));

// // ------------------ Session ------------------
// app.use(session({
//   secret: process.env.TOKEN_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({ mongoUrl }),  // <-- Local DB store
//   cookie: { 
//     secure: false,    // Local dev
//     httpOnly: true,
//     sameSite: 'lax'
//   }
// }));

// // ------------------ Static files for uploaded images ------------------
// // Multer uploads will be saved here, frontend can access via /upload
// app.use('/uploads', express.static(path.join(process.cwd(), "backend", "uploads")));

// // ------------------ Routes ------------------
// app.use("/user", userRoute);
// app.use("/category", categoryRoute);
// app.use("/service", serviceRoute);
// app.use("/booking", bookingRoute);
// app.use("/cart", cartRoute);

// // ------------------ Server ------------------
// app.listen(3000, () => {
//   console.log("🚀 Server running on http://localhost:3000");
// });


// backend/server.js
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import path from "path";

// Routes
import userRoute from './routes/userRoute.js';
import categoryRoute from './routes/categoryRoute.js';
import serviceRoute from './routes/serviceRoute.js';
import bookingRoute from './routes/bookingRoute.js';
import cartRoute from './routes/cartRoute.js';

// MongoDB connection
import connectDB from './connection/dbconfig.js';

dotenv.config();
connectDB(); // ✅ Connect to MongoDB from dbconfig.js

const app = express();

// ------------------ CORS ------------------
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors());

// ------------------ Body Parser ------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ------------------ Session ------------------
app.use(session({
  secret: process.env.TOKEN_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.DB }),
  cookie: { 
    secure: false,    // Local dev
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// ------------------ Static files ------------------
app.use('/uploads', express.static(path.join(process.cwd(), "backend", "uploads")));

// ------------------ Routes ------------------
app.use("/user", userRoute);
app.use("/category", categoryRoute);
app.use("/service", serviceRoute);
app.use("/booking", bookingRoute);
app.use("/cart", cartRoute);

// ------------------ Server ------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
