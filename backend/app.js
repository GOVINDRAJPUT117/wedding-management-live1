import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import path from "path";
import dns from "node:dns";

// Routes
import userRoute from "./routes/userRoute.js";
import serviceRoute from "./routes/serviceRoute.js";
import bookingRoute from "./routes/bookingRoute.js";
import cartRoute from "./routes/cartRoute.js";

// MongoDB connection
import connectDB from "./connection/dbconfig.js";

dotenv.config();

// Local DNS workaround (enable only in backend/.env)
if (process.env.USE_GOOGLE_DNS === "true") {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

// Start MongoDB connection
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter((origin, index, origins) =>
  origin && origins.indexOf(origin) === index
);

// CORS
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: process.env.TOKEN_SECRET || process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

// Static files
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "backend", "uploads"))
);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Wedding Management API is running",
  });
});

// Routes
app.use("/user", userRoute);
// app.use("/category", categoryRoute);
app.use("/service", serviceRoute);
app.use("/booking", bookingRoute);
app.use("/cart", cartRoute);

// Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
