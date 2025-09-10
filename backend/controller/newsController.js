import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { News } from "../models/newsSchema.js";
import cloudinary from "cloudinary";

// Create new news article
export const createNews = catchAsyncErrors(async (req, res, next) => {
    const {
        title,
        content,
        summary,
        category,
        author,
        tags,
        priority,
        isPublished,
        publishDate,
        expiryDate
    } = req.body;

    if (!title || !content || !summary || !author) {
        return next(new ErrorHandler("Please provide all required fields!", 400));
    }

    let newsData = {
        title,
        content,
        summary,
        category: category || "Hospital Updates",
        author,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        priority: priority || "Medium",
        isPublished: isPublished === 'true',
        publishDate: publishDate ? new Date(publishDate) : new Date(),
        expiryDate: expiryDate ? new Date(expiryDate) : null
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
            { folder: "news" }
        );

        if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary error");
            return next(new ErrorHandler("Failed to upload image to cloudinary", 500));
        }

        newsData.image = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        };
    }

    const news = await News.create(newsData);

    res.status(201).json({
        success: true,
        message: "News article created successfully!",
        news,
    });
});

// Get all news articles (for admin)
export const getAllNewsAdmin = catchAsyncErrors(async (req, res, next) => {
    const { page = 1, limit = 10, category, priority, isPublished } = req.query;
    
    let filter = { isActive: true };
    
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (isPublished !== undefined) filter.isPublished = isPublished === 'true';

    const news = await News.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

    const total = await News.countDocuments(filter);

    res.status(200).json({
        success: true,
        news,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
    });
});

// Get published news articles (for frontend)
export const getPublishedNews = catchAsyncErrors(async (req, res, next) => {
    const { page = 1, limit = 6, category } = req.query;
    
    let filter = { 
        isActive: true, 
        isPublished: true,
        publishDate: { $lte: new Date() }
    };
    
    // Check for non-expired news
    filter.$or = [
        { expiryDate: null },
        { expiryDate: { $gte: new Date() } }
    ];
    
    if (category) filter.category = category;

    const news = await News.find(filter)
        .sort({ priority: -1, publishDate: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-__v');

    const total = await News.countDocuments(filter);

    res.status(200).json({
        success: true,
        news,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
    });
});

// Get single news article
export const getNewsById = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const news = await News.findById(id);

    if (!news || !news.isActive) {
        return next(new ErrorHandler("News article not found!", 404));
    }

    // Increment views for published articles
    if (news.isPublished) {
        await News.findByIdAndUpdate(id, { $inc: { views: 1 } });
        news.views += 1;
    }

    res.status(200).json({
        success: true,
        news,
    });
});

// Update news article
export const updateNews = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    
    let news = await News.findById(id);
    if (!news) {
        return next(new ErrorHandler("News article not found!", 404));
    }

    const {
        title,
        content,
        summary,
        category,
        author,
        tags,
        priority,
        isPublished,
        publishDate,
        expiryDate
    } = req.body;

    let updateData = {
        title: title || news.title,
        content: content || news.content,
        summary: summary || news.summary,
        category: category || news.category,
        author: author || news.author,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : news.tags,
        priority: priority || news.priority,
        isPublished: isPublished !== undefined ? isPublished === 'true' : news.isPublished,
        publishDate: publishDate ? new Date(publishDate) : news.publishDate,
        expiryDate: expiryDate ? new Date(expiryDate) : news.expiryDate
    };

    // Handle image update
    if (req.files && req.files.image) {
        const { image } = req.files;
        const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
        
        if (!allowedFormats.includes(image.mimetype)) {
            return next(new ErrorHandler("File format not supported!", 400));
        }

        // Delete old image from cloudinary
        if (news.image && news.image.public_id) {
            await cloudinary.uploader.destroy(news.image.public_id);
        }

        const cloudinaryResponse = await cloudinary.uploader.upload(
            image.tempFilePath,
            { folder: "news" }
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

    news = await News.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: "News article updated successfully!",
        news,
    });
});

// Delete news article (soft delete)
export const deleteNews = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const news = await News.findById(id);

    if (!news) {
        return next(new ErrorHandler("News article not found!", 404));
    }

    // Delete image from cloudinary if exists
    if (news.image && news.image.public_id) {
        await cloudinary.uploader.destroy(news.image.public_id);
    }

    // Soft delete by setting isActive to false
    await News.findByIdAndUpdate(id, { isActive: false });

    res.status(200).json({
        success: true,
        message: "News article deleted successfully!",
    });
});

// Toggle publish status
export const togglePublishStatus = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const news = await News.findById(id);

    if (!news) {
        return next(new ErrorHandler("News article not found!", 404));
    }

    const updatedNews = await News.findByIdAndUpdate(
        id, 
        { isPublished: !news.isPublished },
        { new: true }
    );

    res.status(200).json({
        success: true,
        message: `News article ${updatedNews.isPublished ? 'published' : 'unpublished'} successfully!`,
        news: updatedNews,
    });
});

// Like news article
export const likeNews = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const news = await News.findById(id);

    if (!news || !news.isPublished) {
        return next(new ErrorHandler("News article not found!", 404));
    }

    const updatedNews = await News.findByIdAndUpdate(
        id,
        { $inc: { likes: 1 } },
        { new: true }
    );

    res.status(200).json({
        success: true,
        message: "News article liked!",
        likes: updatedNews.likes,
    });
});

// Get news statistics
export const getNewsStats = catchAsyncErrors(async (req, res, next) => {
    const totalNews = await News.countDocuments({ isActive: true });
    const publishedNews = await News.countDocuments({ isActive: true, isPublished: true });
    const draftNews = await News.countDocuments({ isActive: true, isPublished: false });
    
    // Get news by category
    const newsByCategory = await News.aggregate([
        { $match: { isActive: true, isPublished: true } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);

    // Get most viewed news
    const mostViewedNews = await News.find({ isActive: true, isPublished: true })
        .sort({ views: -1 })
        .limit(5)
        .select('title views publishDate');

    // Get recent news
    const recentNews = await News.find({ isActive: true, isPublished: true })
        .sort({ publishDate: -1 })
        .limit(5)
        .select('title publishDate category');

    res.status(200).json({
        success: true,
        stats: {
            totalNews,
            publishedNews,
            draftNews,
            newsByCategory,
            mostViewedNews,
            recentNews
        }
    });
});
