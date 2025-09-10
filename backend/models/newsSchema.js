import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "News title is required!"],
        trim: true
    },
    content: {
        type: String,
        required: [true, "News content is required!"],
        trim: true
    },
    summary: {
        type: String,
        required: [true, "News summary is required!"],
        trim: true,
        maxlength: [200, "Summary cannot exceed 200 characters"]
    },
    category: {
        type: String,
        required: [true, "News category is required!"],
        enum: ["Health Tips", "Hospital Updates", "Medical Research", "Events", "Announcements", "Emergency Alerts"],
        default: "Hospital Updates"
    },
    author: {
        type: String,
        required: [true, "Author name is required!"],
        trim: true
    },
    image: {
        public_id: String,
        url: String
    },
    tags: [{
        type: String,
        trim: true
    }],
    priority: {
        type: String,
        enum: ["Low", "Medium", "High", "Urgent"],
        default: "Medium"
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    publishDate: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for better performance
newsSchema.index({ publishDate: -1, isPublished: 1, isActive: 1 });
newsSchema.index({ category: 1, priority: -1 });

export const News = mongoose.model("News", newsSchema);
