# Hospital Management System - Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- Node.js 16+ installed
- MongoDB database (local or cloud)
- Cloudinary account for image storage
- Domain names for frontend, dashboard, and backend

### Environment Configuration

#### Backend (.env)
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/hospital_management
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hospital_management

JWT_SECRET_KEY=your_super_secret_jwt_key_here
JWT_EXPIRES=7d
COOKIE_EXPIRE=7

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

FRONTEND_URL=https://your-frontend-domain.com
DASHBOARD_URL=https://your-dashboard-domain.com

NODE_ENV=production
```

#### Frontend (.env.production)
```env
VITE_API_BASE_URL=https://your-backend-domain.com
```

#### Dashboard (.env.production)
```env
VITE_API_BASE_URL=https://your-backend-domain.com
```

### Build Process

#### 1. Backend Deployment
```bash
cd backend
npm install --production
npm start
```

#### 2. Frontend Build
```bash
cd frontend
npm install
npm run build
# Deploy 'dist' folder to your hosting service
```

#### 3. Dashboard Build
```bash
cd dashboard
npm install
npm run build
# Deploy 'dist' folder to your hosting service
```

## 🌐 Hosting Options

### Backend Hosting

#### Option 1: Railway
1. Connect GitHub repository
2. Select backend folder
3. Set environment variables in Railway dashboard
4. Deploy automatically

#### Option 2: Render
1. Create new web service
2. Connect repository, set root directory to `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables

#### Option 3: Heroku
```bash
# Install Heroku CLI
heroku create your-backend-app
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET_KEY=your_secret
# Add other environment variables
git subtree push --prefix backend heroku main
```

### Frontend & Dashboard Hosting

#### Option 1: Netlify
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables
5. Deploy

#### Option 2: Vercel
```bash
# Install Vercel CLI
npm i -g vercel
cd frontend
vercel --prod
# Follow prompts and set environment variables
```

#### Option 3: GitHub Pages
```bash
cd frontend
npm run build
# Deploy 'dist' folder to gh-pages branch
```

### Database Hosting

#### MongoDB Atlas (Recommended)
1. Create account at mongodb.com/atlas
2. Create new cluster
3. Set up database user
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get connection string
6. Update MONGODB_URI in backend environment

## 🔧 Production Optimizations

### Backend Optimizations
```javascript
// Add to app.js for production
if (process.env.NODE_ENV === 'production') {
  app.use(compression()); // Enable gzip compression
  app.use(helmet()); // Security headers
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }));
}
```

### Frontend Optimizations
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['react-toastify', 'react-icons']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

### Image Optimization
- Configure Cloudinary auto-optimization
- Use WebP format when possible
- Implement lazy loading for images

## 🔒 Security Checklist

### Backend Security
- [ ] Use HTTPS in production
- [ ] Set secure cookie options
- [ ] Implement rate limiting
- [ ] Validate all inputs
- [ ] Use helmet for security headers
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Implement proper CORS configuration

### Frontend Security
- [ ] Sanitize user inputs
- [ ] Use HTTPS for all requests
- [ ] Implement CSP headers
- [ ] Validate data from API responses
- [ ] Don't expose sensitive data in client

## 📊 Monitoring & Logging

### Backend Monitoring
```javascript
// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Error logging
app.use((error, req, res, next) => {
  console.error('Error:', error);
  // Send to logging service (e.g., Sentry, LogRocket)
});
```

### Performance Monitoring
- Use tools like New Relic, DataDog, or Sentry
- Monitor API response times
- Track database query performance
- Monitor memory and CPU usage

## 🚦 Health Checks

### Backend Health Check
```javascript
// Add to app.js
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});
```

### Database Health Check
```javascript
app.get('/health/db', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.status(200).json({ database: 'Connected' });
  } catch (error) {
    res.status(500).json({ database: 'Disconnected', error: error.message });
  }
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: cd backend && npm install
      - name: Run tests
        run: cd backend && npm test
      - name: Deploy to Railway
        # Add deployment steps

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install and build
        run: cd frontend && npm install && npm run build
      - name: Deploy to Netlify
        # Add deployment steps
```

## 🛠️ Maintenance

### Regular Tasks
- [ ] Update dependencies monthly
- [ ] Monitor error logs weekly
- [ ] Backup database daily
- [ ] Check SSL certificate expiry
- [ ] Monitor disk space and memory usage
- [ ] Review security logs

### Database Maintenance
```javascript
// Create indexes for better performance
db.departments.createIndex({ name: 1, isActive: 1 });
db.news.createIndex({ publishDate: -1, isPublished: 1, isActive: 1 });
db.users.createIndex({ email: 1 });
```

## 🚨 Troubleshooting

### Common Issues

#### CORS Errors
- Check CORS configuration in backend
- Verify frontend/dashboard URLs in environment variables
- Ensure credentials are being sent with requests

#### Database Connection Issues
- Verify MongoDB URI format
- Check network connectivity
- Ensure database user has correct permissions

#### Image Upload Failures
- Check Cloudinary credentials
- Verify file size limits
- Check network connectivity to Cloudinary

#### Build Failures
- Clear node_modules and package-lock.json
- Check Node.js version compatibility
- Verify all environment variables are set

### Performance Issues
- Monitor database query performance
- Check for memory leaks
- Optimize image sizes and formats
- Implement caching strategies

## 📞 Support & Maintenance

### Backup Strategy
- Automated daily database backups
- Store backups in multiple locations
- Test backup restoration regularly

### Scaling Considerations
- Use load balancers for high traffic
- Implement database replication
- Consider CDN for static assets
- Monitor and scale server resources

### Update Process
1. Test updates in staging environment
2. Schedule maintenance windows
3. Deploy during low-traffic periods
4. Monitor for issues after deployment
5. Have rollback plan ready
