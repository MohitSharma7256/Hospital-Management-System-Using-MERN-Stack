# Hospital Management System - Complete Testing Guide

## 🚀 Quick Start

### 1. Start All Services

```bash
# Terminal 1 - Backend Server
cd backend
npm start
# Server runs on http://localhost:4000

# Terminal 2 - Frontend
cd frontend  
npm run dev
# Frontend runs on http://localhost:5173

# Terminal 3 - Dashboard
cd dashboard
npm run dev
# Dashboard runs on http://localhost:5174
```

## 🧪 Complete Feature Testing Checklist

### ✅ Authentication System

**Admin Login (Dashboard)**
- Navigate to `http://localhost:5174`
- Use admin credentials to login
- Verify dashboard access and sidebar navigation

**Patient Registration & Login (Frontend)**
- Navigate to `http://localhost:5173`
- Test patient registration with all fields
- Test login with registered credentials
- Verify "My Account" page access

### ✅ Department Management System

**Dashboard Testing (Admin)**
1. **Create Department**
   - Go to Dashboard → Departments
   - Click "Add New Department"
   - Fill all required fields:
     - Name, Description, Detailed Info
     - Services (comma-separated)
     - Common Diseases (add multiple with symptoms/treatments)
     - Contact Info (phone, email, location)
     - Facilities (comma-separated)
     - Working Hours (JSON format)
     - Upload department image
   - Save and verify creation

2. **Edit Department**
   - Click edit button on any department
   - Modify fields and save
   - Verify changes are reflected

3. **Delete Department**
   - Click delete button
   - Confirm deletion
   - Verify soft delete (isActive: false)

**Frontend Testing (Users)**
1. **Department Display**
   - Visit homepage
   - Scroll to Departments section
   - Verify carousel shows dynamic departments
   - Test responsive behavior on mobile

2. **Department Details**
   - Click on any department card
   - Verify navigation to `/department/department-name`
   - Check all sections display correctly:
     - Hero section with image
     - Description and detailed info
     - Services list
     - Facilities grid
     - Common diseases with symptoms
     - Contact information sidebar
     - Working hours
   - Test "Book Appointment" button

### ✅ News Management System

**Dashboard Testing (Admin)**
1. **Create News Article**
   - Go to Dashboard → News
   - Click "Add New Article"
   - Fill all fields:
     - Title, Summary (max 200 chars), Content
     - Category selection
     - Author name
     - Tags (comma-separated)
     - Priority level
     - Publication settings
     - Upload article image
   - Test both draft and published modes

2. **Manage Articles**
   - View statistics dashboard
   - Edit existing articles
   - Toggle publish/unpublish status
   - Delete articles
   - Filter by category/priority

**Frontend Testing (Users)**
1. **News Display**
   - Visit homepage
   - Scroll to News section
   - Verify articles display with:
     - Category badges
     - Priority indicators
     - Author and date info
     - View/like counters
     - Tags display

2. **News Interactions**
   - Test category filtering
   - Test pagination
   - Click "Like" buttons
   - Verify responsive design on mobile
   - Test loading states

### ✅ User Account Management

**Profile Management**
1. Login as patient
2. Navigate to "My Account"
3. Test profile updates:
   - First name, last name, phone, DOB
   - Verify email/gender are protected
4. Test password change:
   - Enter current password
   - Set new password
   - Verify validation

**Appointment History**
- View appointment history
- Check status color coding
- Verify appointment details display

### ✅ API Endpoints Testing

**Department APIs**
```bash
# Get all departments (public)
GET http://localhost:4000/api/v1/department/all

# Get department by name (public)
GET http://localhost:4000/api/v1/department/name/Cardiology

# Admin endpoints (require authentication)
POST http://localhost:4000/api/v1/department/create
PUT http://localhost:4000/api/v1/department/update/:id
DELETE http://localhost:4000/api/v1/department/delete/:id
```

**News APIs**
```bash
# Get published news (public)
GET http://localhost:4000/api/v1/news/published

# Get single article (public)
GET http://localhost:4000/api/v1/news/article/:id

# Like article (public)
POST http://localhost:4000/api/v1/news/like/:id

# Admin endpoints (require authentication)
POST http://localhost:4000/api/v1/news/create
GET http://localhost:4000/api/v1/news/admin/all
PUT http://localhost:4000/api/v1/news/update/:id
DELETE http://localhost:4000/api/v1/news/delete/:id
```

## 🔍 Visual Testing Checklist

### Desktop Testing
- [ ] All components render correctly
- [ ] Hover effects work on department cards
- [ ] News cards display properly
- [ ] Dashboard sidebar navigation works
- [ ] Forms validate correctly
- [ ] Images load and display properly

### Mobile Testing
- [ ] Responsive navigation works
- [ ] Department carousel adapts to mobile
- [ ] News grid becomes single column
- [ ] Category filters stack properly
- [ ] Forms are mobile-friendly
- [ ] Touch interactions work

### Cross-Browser Testing
- [ ] Chrome/Edge compatibility
- [ ] Firefox compatibility
- [ ] Safari compatibility (if available)

## 🐛 Common Issues & Solutions

### CORS Issues
- Ensure backend CORS is configured for frontend URLs
- Check browser console for CORS errors
- Verify credentials are being sent with requests

### Image Upload Issues
- Check Cloudinary configuration in backend
- Verify file upload middleware is working
- Check file size and format restrictions

### Database Connection
- Ensure MongoDB is running
- Check database connection string
- Verify environment variables are loaded

### Authentication Issues
- Check JWT token generation and validation
- Verify cookie settings for cross-origin requests
- Test token expiration handling

## 📊 Performance Testing

### Load Testing
- Test with multiple departments (10+)
- Test with multiple news articles (20+)
- Check pagination performance
- Monitor API response times

### Image Optimization
- Verify images are compressed appropriately
- Check Cloudinary transformations
- Test loading times with slow connections

## 🚀 Deployment Testing

### Environment Variables
- Verify all required env vars are set
- Test production vs development configurations
- Check API URLs point to correct endpoints

### Build Process
- Test frontend build: `npm run build`
- Test dashboard build: `npm run build`
- Verify static assets are generated correctly

## ✅ Final Checklist

Before marking the system as complete:

- [ ] All CRUD operations work for departments
- [ ] All CRUD operations work for news
- [ ] User authentication and profile management works
- [ ] Frontend displays dynamic content correctly
- [ ] Dashboard admin functions work properly
- [ ] Responsive design works on all screen sizes
- [ ] API endpoints return correct data
- [ ] Error handling works appropriately
- [ ] Images upload and display correctly
- [ ] Navigation and routing work smoothly

## 🎯 Success Criteria

The system is fully functional when:
1. Admins can manage departments and news from dashboard
2. Users can view dynamic departments and news on frontend
3. All authentication flows work correctly
4. Responsive design works across devices
5. All API endpoints function properly
6. Error handling provides good user experience
