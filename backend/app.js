import express from "express";
import { config } from "dotenv";
import cors from "cors"; // Add this line to import the cors module
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import messageRouter from "./router/messageRouter.js";
import {errorMiddleware} from "./middlewares/errorMiddleware.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";



const app = express();
config({ path: "./Config/config.env" });



// CORS configuration - must be before routes
app.use(
    cors({
        origin: [
            process.env.FRONTEND_URL, 
            process.env.DASHBOARD_URL,
            "https://hospital-management-system-using-mern-5ans.onrender.com",
            "https://hospital-management-system-using-mern-7sqr.onrender.com",
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:5174"
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
        optionsSuccessStatus: 200
    })
);

// Handle preflight requests
app.options('*', cors());

// Test route for default access
app.get("/", (req, res) => {
  res.send("Server is up and running 🚀");
});

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);


app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

// Additional routes without /api/v1 prefix for frontend compatibility
app.use("/message", messageRouter);
app.use("/user", userRouter);
app.use("/appointment", appointmentRouter);


dbConnection();


app.use(errorMiddleware);
export default app;
