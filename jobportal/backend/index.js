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

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("❌ Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
  })
);

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// Root test route
app.get("/", (req, res) => {
  res.send("✅ Job Portal Backend Running on Vercel 🚀");
});

// ✅ Ensure DB connection is reused across Vercel invocations
if (!global._dbConnection) {
  global._dbConnection = connectDB();
}

// ✅ Export app (no app.listen here for Vercel)
export default app;

// ✅ Local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () =>
    console.log(`✅ Server running locally on port ${PORT}`)
  );
}
