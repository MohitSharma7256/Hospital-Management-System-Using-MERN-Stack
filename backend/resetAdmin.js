import mongoose from "mongoose";
import { config } from "dotenv";

// Load environment variables
config({ path: "./Config/config.env" });

// Import User model
import { User } from "./models/userSchema.js";

const resetAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Delete existing admin
    const deletedAdmin = await User.findOneAndDelete({ email: "admin@hospital.com" });
    if (deletedAdmin) {
      console.log("Existing admin deleted successfully!");
    } else {
      console.log("No existing admin found.");
    }

    // Create new admin - let the User schema handle password hashing
    const admin = await User.create({
      firstName: "Super",
      lastName: "Admin",
      email: "admin@hospital.com",
      phone: "03001234567",
      password: "Admin@123",
      gender: "Male",
      dob: new Date("1990-01-01"),
      aadhar: "123456789012",
      role: "Admin"
    });

    console.log("New admin created successfully!");
    console.log("Email: admin@hospital.com");
    console.log("Password: Admin@123");
    console.log("Admin ID:", admin._id);

  } catch (error) {
    console.error("Error resetting admin:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

resetAdmin();
