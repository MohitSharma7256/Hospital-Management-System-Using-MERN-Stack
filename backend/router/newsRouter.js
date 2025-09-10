import express from "express";
import {
    createNews,
    getAllNewsAdmin,
    getPublishedNews,
    getNewsById,
    updateNews,
    deleteNews,
    togglePublishStatus,
    likeNews,
    getNewsStats
} from "../controller/newsController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Public routes (for frontend)
router.get("/published", getPublishedNews);
router.get("/article/:id", getNewsById);
router.post("/like/:id", likeNews);

// Admin routes (protected)
router.post("/create", isAdminAuthenticated, createNews);
router.get("/admin/all", isAdminAuthenticated, getAllNewsAdmin);
router.put("/update/:id", isAdminAuthenticated, updateNews);
router.delete("/delete/:id", isAdminAuthenticated, deleteNews);
router.patch("/toggle-publish/:id", isAdminAuthenticated, togglePublishStatus);
router.get("/admin/stats", isAdminAuthenticated, getNewsStats);

export default router;
