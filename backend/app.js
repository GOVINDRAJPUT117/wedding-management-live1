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
connectDB(); //  Connect to MongoDB from dbconfig.js

const app = express();

// CORS 
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors());

// Body Parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session 
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

// Static files
app.use('/uploads', express.static(path.join(process.cwd(), "backend", "uploads")));

// Routes 
app.use("/user", userRoute);
app.use("/category", categoryRoute);
app.use("/service", serviceRoute);
app.use("/booking", bookingRoute);
app.use("/cart", cartRoute);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
