// Simple test to check if the server configuration is working
import app from "./app.js";
import mongoose from "mongoose";

const testServer = () => {
    console.log("🧪 Testing server configuration...");
    
    // Test database connection
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error("❌ MONGO_URI not found in environment variables");
        return false;
    }
    
    // Test required environment variables
    const requiredEnvVars = [
        'PORT',
        'FRONTEND_URL',
        'DASHBOARD_URL',
        'JWT_SECRET_KEY',
        'JWT_EXPIRES',
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET'
    ];
    
    let allEnvVarsPresent = true;
    requiredEnvVars.forEach(envVar => {
        if (!process.env[envVar]) {
            console.error(`❌ ${envVar} not found in environment variables`);
            allEnvVarsPresent = false;
        } else {
            console.log(`✅ ${envVar} is configured`);
        }
    });
    
    if (!allEnvVarsPresent) {
        console.error("❌ Some environment variables are missing");
        return false;
    }
    
    console.log("✅ All environment variables are configured correctly");
    console.log("✅ Server configuration test passed!");
    
    return true;
};

export default testServer;
