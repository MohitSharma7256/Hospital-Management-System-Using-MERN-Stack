# Hospital Management System - Start All Services

Write-Host "Starting Hospital Management System..." -ForegroundColor Green

# Start Backend
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'backend'; npm start"

# Wait a moment for backend to initialize
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend (Patient Portal)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'frontend'; npm run dev"

# Start Dashboard
Write-Host "Starting Dashboard (Admin Portal)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'dashboard'; npm run dev"

Write-Host ""
Write-Host "All services started!" -ForegroundColor Green
Write-Host "Backend: http://localhost:4000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5175" -ForegroundColor Cyan
Write-Host "Dashboard: http://localhost:5174" -ForegroundColor Cyan
Write-Host ""
Write-Host "Default Admin Login:" -ForegroundColor Magenta
Write-Host "Email: admin@hospital.com" -ForegroundColor White
Write-Host "Password: Admin@123" -ForegroundColor White
