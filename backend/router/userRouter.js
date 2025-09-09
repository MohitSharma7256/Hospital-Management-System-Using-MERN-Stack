// userRouter.js
import express from "express";
import { 
    addNewAdmin, 
    addNewDoctor, 
    getAllDoctors, 
    getPatientDetails, 
    getUserDetails, 
    login, 
    logoutAdmin, 
    logoutPatient, 
    patientRegister, 
    getAllPatients, 
    getAllUsers, 
    updateUser, 
    deleteUser, 
    updateDoctor, 
    getUserStats 
} from "../controller/userController.js";
import { isAdminAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/patient/register", patientRegister);
router.post("/login", login);

// Routes for admin
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);

// Routes for doctors
router.get("/doctors", isAdminAuthenticated, getAllDoctors); // Assuming only admin can access doctor list

// Route to get patient details
router.get("/patient/me", isPatientAuthenticated, getPatientDetails);

// Log-Out for Admin
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);

// Log-Out for User
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);

// Add New Doctor for User
router.post("/doctor/addnew", isAdminAuthenticated, addNewDoctor);

// CRUD Routes for Admin Management
router.get("/patients", isAdminAuthenticated, getAllPatients);
router.get("/users", isAdminAuthenticated, getAllUsers);
router.get("/stats", isAdminAuthenticated, getUserStats);
router.put("/user/:id", isAdminAuthenticated, updateUser);
router.delete("/user/:id", isAdminAuthenticated, deleteUser);
router.put("/doctor/:id", isAdminAuthenticated, updateDoctor);

export default router;
