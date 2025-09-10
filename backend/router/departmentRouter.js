import express from "express";
import {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    getDepartmentByName,
    updateDepartment,
    deleteDepartment,
    getDepartmentStats
} from "../controller/departmentController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Public routes (for frontend)
router.get("/all", getAllDepartments);
router.get("/name/:name", getDepartmentByName);
router.get("/:id", getDepartmentById);

// Admin routes (for dashboard)
router.post("/create", isAdminAuthenticated, createDepartment);
router.put("/update/:id", isAdminAuthenticated, updateDepartment);
router.delete("/delete/:id", isAdminAuthenticated, deleteDepartment);
router.get("/admin/stats", isAdminAuthenticated, getDepartmentStats);

export default router;
