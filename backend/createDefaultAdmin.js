import mongoose from "mongoose";
import { config } from "dotenv";
import bcrypt from "bcrypt";

// Load environment variables
config({ path: "./Config/config.env" });

// Import User model
import { User } from "./models/userSchema.js";

const createDefaultAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@hospital.com" });
    if (existingAdmin) {
      console.log("Default admin already exists!");
      process.exit(0);
    }

    // Create default admin - let the User schema handle password hashing
    const admin = await User.create({
      firstName: "Super",
      lastName: "Admin",
      email: "admin@hospital.com",
      phone: "03001234567",
      password: "Admin@123",
      gender: "Male",
      dob: new Date("2002-06-06"),
      aadhar: "123456789012",
      role: "Admin"
    });

    console.log("Default admin created successfully!");
    console.log("Email: admin@hospital.com");
    console.log("Password: Admin@123");
    console.log("Admin ID:", admin._id);

  } catch (error) {
    console.error("Error creating default admin:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createDefaultAdmin();
