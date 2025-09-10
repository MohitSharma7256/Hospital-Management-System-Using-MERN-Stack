import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Department } from "../models/departmentSchema.js";
import cloudinary from "cloudinary";

// Create new department
export const createDepartment = catchAsyncErrors(async (req, res, next) => {
    const {
        name,
        description,
        detailedInfo,
        services,
        commonDiseases,
        headOfDepartment,
        contactInfo,
        facilities,
        workingHours
    } = req.body;

    if (!name || !description || !detailedInfo) {
        return next(new ErrorHandler("Please provide all required fields!", 400));
    }

    let departmentData = {
        name,
        description,
        detailedInfo,
        services: services ? services.split(',').map(s => s.trim()) : [],
        commonDiseases: commonDiseases ? JSON.parse(commonDiseases) : [],
        headOfDepartment,
        contactInfo: contactInfo ? JSON.parse(contactInfo) : {},
        facilities: facilities ? facilities.split(',').map(f => f.trim()) : [],
        workingHours: workingHours ? JSON.parse(workingHours) : {}
    };

    // Handle image upload
    if (req.files && req.files.image) {
        const { image } = req.files;
        const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
        
        if (!allowedFormats.includes(image.mimetype)) {
            return next(new ErrorHandler("File format not supported!", 400));
        }

        const cloudinaryResponse = await cloudinary.uploader.upload(
            image.tempFilePath,
            { folder: "departments" }
        );

        if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary error");
            return next(new ErrorHandler("Failed to upload image to cloudinary", 500));
        }

        departmentData.image = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        };
    }

    const department = await Department.create(departmentData);

    res.status(201).json({
        success: true,
        message: "Department created successfully!",
        department,
    });
});

// Get all departments
export const getAllDepartments = catchAsyncErrors(async (req, res, next) => {
    const departments = await Department.find({ isActive: true }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        departments,
    });
});

// Get single department by ID
export const getDepartmentById = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const department = await Department.findById(id);

    if (!department) {
        return next(new ErrorHandler("Department not found!", 404));
    }

    res.status(200).json({
        success: true,
        department,
    });
});

// Get department by name (for frontend routing)
export const getDepartmentByName = catchAsyncErrors(async (req, res, next) => {
    const { name } = req.params;
    const department = await Department.findOne({ 
        name: { $regex: new RegExp(name, 'i') },
        isActive: true 
    });

    if (!department) {
        return next(new ErrorHandler("Department not found!", 404));
    }

    res.status(200).json({
        success: true,
        department,
    });
});

// Update department
export const updateDepartment = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    
    let department = await Department.findById(id);
    if (!department) {
        return next(new ErrorHandler("Department not found!", 404));
    }

    const {
        name,
        description,
        detailedInfo,
        services,
        commonDiseases,
        headOfDepartment,
        contactInfo,
        facilities,
        workingHours
    } = req.body;

    let updateData = {
        name,
        description,
        detailedInfo,
        services: services ? services.split(',').map(s => s.trim()) : department.services,
        commonDiseases: commonDiseases ? JSON.parse(commonDiseases) : department.commonDiseases,
        headOfDepartment,
        contactInfo: contactInfo ? JSON.parse(contactInfo) : department.contactInfo,
        facilities: facilities ? facilities.split(',').map(f => f.trim()) : department.facilities,
        workingHours: workingHours ? JSON.parse(workingHours) : department.workingHours
    };

    // Handle image update
    if (req.files && req.files.image) {
        const { image } = req.files;
        const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
        
        if (!allowedFormats.includes(image.mimetype)) {
            return next(new ErrorHandler("File format not supported!", 400));
        }

        // Delete old image from cloudinary
        if (department.image && department.image.public_id) {
            await cloudinary.uploader.destroy(department.image.public_id);
        }

        const cloudinaryResponse = await cloudinary.uploader.upload(
            image.tempFilePath,
            { folder: "departments" }
        );

        if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary error");
            return next(new ErrorHandler("Failed to upload image to cloudinary", 500));
        }

        updateData.image = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        };
    }

    department = await Department.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: "Department updated successfully!",
        department,
    });
});

// Delete department (soft delete)
export const deleteDepartment = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const department = await Department.findById(id);

    if (!department) {
        return next(new ErrorHandler("Department not found!", 404));
    }

    // Soft delete by setting isActive to false
    await Department.findByIdAndUpdate(id, { isActive: false });

    res.status(200).json({
        success: true,
        message: "Department deleted successfully!",
    });
});

// Get department statistics
export const getDepartmentStats = catchAsyncErrors(async (req, res, next) => {
    const totalDepartments = await Department.countDocuments({ isActive: true });
    const inactiveDepartments = await Department.countDocuments({ isActive: false });
    
    // Get departments with most diseases
    const departmentsWithDiseases = await Department.aggregate([
        { $match: { isActive: true } },
        { $project: { name: 1, diseaseCount: { $size: "$commonDiseases" } } },
        { $sort: { diseaseCount: -1 } },
        { $limit: 5 }
    ]);

    res.status(200).json({
        success: true,
        stats: {
            totalDepartments,
            inactiveDepartments,
            departmentsWithDiseases
        }
    });
});
