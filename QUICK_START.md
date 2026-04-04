# 🚀 Quick Start Guide - Bashedu Auction Platform

## 📋 Prerequisites

1. **Node.js** (v14 or higher)
2. **npm** (comes with Node.js)
3. **OpenAI API Key** (get from https://platform.openai.com/)
4. **Git** (optional, for version control)

## ⚙️ Setup Instructions

### 1. **Get Your OpenAI API Key**
- Go to [OpenAI Platform](https://platform.openai.com/)
- Sign up/login
- Navigate to API Keys
- Create new API key
- Copy the key (starts with `sk-`)

### 2. **Configure Environment**
Open `backend/.env` and update:
```env
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

### 3. **Install Dependencies**
#### Option A: Automatic (Recommended)
```bash
# Run the installation script
./install.bat
```

#### Option B: Manual
```bash
# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

### 4. **Start the Application**
#### Option A: Automatic (Recommended)
```bash
# Run the start script
./start.bat
```

#### Option B: Manual
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🧪 Test the Features

### 1. **Test AI Integration**
- Go to http://localhost:3000
- Register/Login
- Navigate to any course
- Try generating quiz questions
- Check browser console for AI responses

### 2. **Test Time Functions**
- Open browser console
- Test: `getRelativeTime(new Date())`
- Should return "Just now"

### 3. **Test Quiz System**
- Start a quiz
- Answer questions
- Submit and see results
- Check AI feedback generation

## 🔧 Common Issues & Solutions

### ❌ "Scripts are disabled" Error
**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### ❌ "Cannot find module 'express'" Error
**Solution:** Run `npm install` in backend folder

### ❌ "OpenAI API key invalid" Error
**Solution:** Update `.env` with correct OpenAI key

### ❌ "Port already in use" Error
**Solution:** Kill existing Node.js processes:
```bash
taskkill /f /im node.exe
```

## 📱 Development Workflow

1. **Backend Changes**: Auto-restart with `npm run dev`
2. **Frontend Changes**: Auto-reload in browser
3. **API Testing**: Use http://localhost:5000/health
4. **Database**: Uses JSON files (no MongoDB needed)

## 🎯 Key Features to Test

- ✅ User registration/login
- ✅ Course browsing
- ✅ AI quiz generation
- ✅ Quiz taking and scoring
- ✅ Result display with AI feedback
- ✅ Time calculations (relative time, timers)
- ✅ Auction system simulation
- ✅ Leaderboard functionality

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Review console errors
3. Verify API key format
4. Check network connectivity

## 🎉 Ready to Go!

Once setup is complete, you'll have:
- 🤖 AI-powered quiz generation
- ⏱️ Real-time quiz functionality  
- 📊 Dynamic scoring and feedback
- 🏆 Auction-based learning system
- 📱 Responsive web interface

Happy learning! 🚀
