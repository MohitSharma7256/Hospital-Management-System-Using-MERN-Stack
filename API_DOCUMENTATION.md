# Hospital Management System - API Documentation

## 🌐 Base URLs

- **Development Backend**: `http://localhost:4000`
- **Production Backend**: `https://your-backend-domain.com`

## 🔐 Authentication

Most admin endpoints require authentication. Include credentials in requests:

```javascript
// Frontend/Dashboard requests
axios.defaults.withCredentials = true;

// Or per request
axios.get('/api/endpoint', { withCredentials: true })
```

## 📋 Department Management APIs

### Public Endpoints

#### Get All Departments
```http
GET /api/v1/department/all
GET /department/all
```
**Response:**
```json
{
  "success": true,
  "departments": [
    {
      "_id": "departmentId",
      "name": "Cardiology",
      "description": "Heart and cardiovascular care",
      "detailedInfo": "Comprehensive cardiac services...",
      "services": ["ECG", "Echocardiogram", "Cardiac Surgery"],
      "commonDiseases": [
        {
          "name": "Hypertension",
          "symptoms": ["High blood pressure", "Headaches"],
          "treatment": "Medication and lifestyle changes"
        }
      ],
      "headOfDepartment": "Dr. John Smith",
      "contactInfo": {
        "phone": "+1234567890",
        "email": "cardio@hospital.com",
        "location": "Building A, Floor 2"
      },
      "facilities": ["ICU", "Operation Theater", "Recovery Room"],
      "workingHours": {
        "monday": "8:00 AM - 6:00 PM",
        "tuesday": "8:00 AM - 6:00 PM"
      },
      "image": {
        "public_id": "departments/cardio123",
        "url": "https://cloudinary.com/image.jpg"
      },
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Department by Name
```http
GET /api/v1/department/name/:name
GET /department/name/:name
```
**Parameters:**
- `name` (string): Department name (case-insensitive)

**Response:** Single department object

#### Get Department by ID
```http
GET /api/v1/department/:id
GET /department/:id
```
**Parameters:**
- `id` (string): Department MongoDB ObjectId

### Admin Endpoints (Require Authentication)

#### Create Department
```http
POST /api/v1/department/create
POST /department/create
```
**Headers:**
```
Content-Type: multipart/form-data
Cookie: adminToken=jwt_token
```

**Body (Form Data):**
```
name: "Neurology"
description: "Brain and nervous system care"
detailedInfo: "Comprehensive neurological services..."
services: "MRI, CT Scan, Neurological Surgery"
commonDiseases: '[{"name":"Migraine","symptoms":["Severe headache"],"treatment":"Pain management"}]'
headOfDepartment: "Dr. Jane Doe"
contactInfo: '{"phone":"+1234567890","email":"neuro@hospital.com","location":"Building B"}'
facilities: "MRI Room, Neurology Ward"
workingHours: '{"monday":"9:00 AM - 5:00 PM","tuesday":"9:00 AM - 5:00 PM"}'
image: [File]
```

#### Update Department
```http
PUT /api/v1/department/update/:id
PUT /department/update/:id
```
**Body:** Same as create (all fields optional)

#### Delete Department
```http
DELETE /api/v1/department/delete/:id
DELETE /department/delete/:id
```
**Response:**
```json
{
  "success": true,
  "message": "Department deleted successfully!"
}
```

#### Get Department Statistics
```http
GET /api/v1/department/admin/stats
GET /department/admin/stats
```
**Response:**
```json
{
  "success": true,
  "stats": {
    "totalDepartments": 8,
    "activeDepartments": 7,
    "inactiveDepartments": 1,
    "departmentsByServices": [
      {"_id": "Emergency Care", "count": 3}
    ],
    "recentDepartments": [...]
  }
}
```

## 📰 News Management APIs

### Public Endpoints

#### Get Published News
```http
GET /api/v1/news/published
GET /news/published
```
**Query Parameters:**
- `page` (number, default: 1): Page number
- `limit` (number, default: 6): Items per page
- `category` (string, optional): Filter by category

**Response:**
```json
{
  "success": true,
  "news": [
    {
      "_id": "newsId",
      "title": "New Cardiac Unit Opens",
      "content": "We are excited to announce...",
      "summary": "Brief summary of the news",
      "category": "Hospital Updates",
      "author": "Dr. Admin",
      "tags": ["cardiology", "new facility"],
      "priority": "High",
      "isPublished": true,
      "publishDate": "2024-01-01T00:00:00.000Z",
      "expiryDate": null,
      "views": 150,
      "likes": 25,
      "image": {
        "public_id": "news/cardiac123",
        "url": "https://cloudinary.com/image.jpg"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalPages": 3,
  "currentPage": 1,
  "total": 15
}
```

#### Get Single News Article
```http
GET /api/v1/news/article/:id
GET /news/article/:id
```
**Response:** Single news object (increments view count)

#### Like News Article
```http
POST /api/v1/news/like/:id
POST /news/like/:id
```
**Response:**
```json
{
  "success": true,
  "message": "News article liked!",
  "likes": 26
}
```

### Admin Endpoints (Require Authentication)

#### Create News Article
```http
POST /api/v1/news/create
POST /news/create
```
**Body (Form Data):**
```
title: "Breaking: New Medical Research"
content: "Full article content here..."
summary: "Brief summary under 200 characters"
category: "Medical Research"
author: "Dr. Research Lead"
tags: "research, medicine, breakthrough"
priority: "High"
isPublished: "true"
publishDate: "2024-01-15"
expiryDate: "2024-12-31"
image: [File]
```

**Categories:**
- Health Tips
- Hospital Updates
- Medical Research
- Events
- Announcements
- Emergency Alerts

**Priority Levels:**
- Low
- Medium
- High
- Urgent

#### Get All News (Admin)
```http
GET /api/v1/news/admin/all
GET /news/admin/all
```
**Query Parameters:**
- `page`, `limit`: Pagination
- `category`: Filter by category
- `priority`: Filter by priority
- `isPublished`: Filter by publish status

#### Update News Article
```http
PUT /api/v1/news/update/:id
PUT /news/update/:id
```
**Body:** Same as create (all fields optional)

#### Delete News Article
```http
DELETE /api/v1/news/delete/:id
DELETE /news/delete/:id
```

#### Toggle Publish Status
```http
PATCH /api/v1/news/toggle-publish/:id
PATCH /news/toggle-publish/:id
```
**Response:**
```json
{
  "success": true,
  "message": "News article published successfully!",
  "news": { /* updated article */ }
}
```

#### Get News Statistics
```http
GET /api/v1/news/admin/stats
GET /news/admin/stats
```
**Response:**
```json
{
  "success": true,
  "stats": {
    "totalNews": 25,
    "publishedNews": 20,
    "draftNews": 5,
    "newsByCategory": [
      {"_id": "Health Tips", "count": 8},
      {"_id": "Hospital Updates", "count": 7}
    ],
    "mostViewedNews": [...],
    "recentNews": [...]
  }
}
```

## 👤 User Management APIs

### Update User Profile
```http
PUT /api/v1/user/update-profile
PUT /user/update-profile
```
**Headers:**
```
Content-Type: application/json
Cookie: patientToken=jwt_token
```
**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "dob": "1990-01-01"
}
```

### Change Password
```http
PUT /api/v1/user/change-password
PUT /user/change-password
```
**Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

## 🔧 Error Responses

All endpoints return consistent error format:

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## 📝 Request Examples

### JavaScript/Axios
```javascript
// Get departments
const departments = await axios.get('/api/v1/department/all');

// Create news (admin)
const formData = new FormData();
formData.append('title', 'News Title');
formData.append('content', 'News content...');
formData.append('image', imageFile);

const response = await axios.post('/api/v1/news/create', formData, {
  withCredentials: true,
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

### cURL
```bash
# Get published news
curl -X GET "http://localhost:4000/api/v1/news/published?page=1&limit=5"

# Like news article
curl -X POST "http://localhost:4000/api/v1/news/like/NEWS_ID"

# Create department (admin)
curl -X POST "http://localhost:4000/api/v1/department/create" \
  -H "Cookie: adminToken=JWT_TOKEN" \
  -F "name=Emergency" \
  -F "description=24/7 emergency care" \
  -F "image=@department.jpg"
```

## 🚀 Rate Limiting & Best Practices

### Performance Tips
- Use pagination for large datasets
- Cache department and news data on frontend
- Implement debouncing for search/filter inputs
- Optimize images before upload

### Security Notes
- All admin endpoints require valid JWT tokens
- File uploads are restricted to images only
- Input validation is enforced on all endpoints
- CORS is configured for specific domains only

### File Upload Limits
- **Max file size**: 10MB
- **Allowed formats**: PNG, JPEG, WebP
- **Storage**: Cloudinary with automatic optimization
