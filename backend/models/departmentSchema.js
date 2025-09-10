import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Department name is required!"],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: [true, "Department description is required!"],
        trim: true
    },
    detailedInfo: {
        type: String,
        required: [true, "Detailed information is required!"]
    },
    services: [{
        type: String,
        trim: true
    }],
    commonDiseases: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        symptoms: [{
            type: String,
            trim: true
        }],
        treatments: [{
            type: String,
            trim: true
        }]
    }],
    headOfDepartment: {
        type: String,
        trim: true
    },
    contactInfo: {
        phone: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            trim: true
        },
        location: {
            type: String,
            trim: true
        }
    },
    facilities: [{
        type: String,
        trim: true
    }],
    workingHours: {
        weekdays: {
            type: String,
            default: "9:00 AM - 5:00 PM"
        },
        weekends: {
            type: String,
            default: "9:00 AM - 1:00 PM"
        }
    },
    image: {
        public_id: String,
        url: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export const Department = mongoose.model("Department", departmentSchema);
