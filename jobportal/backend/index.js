// server.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Vercel-friendly CORS setup
const allowedOrigins = [
  "http://localhost:5173",                 // Local dev
  "https://jobportal-j8my.onrender.com"    // Your deployed frontend
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ Not allowed by CORS: " + origin));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// Root test route
app.get("/", (req, res) => {
  res.send("✅ Job Portal Backend Running on Vercel 🚀");
});

// ✅ Connect DB (serverless-friendly: cache global connection)
if (!global.dbConnection) {
  global.dbConnection = connectDB();
}

// ✅ Export app for Vercel
export default app;

// Optional: local dev
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => console.log(`✅ Server running locally on port ${PORT}`));
}
