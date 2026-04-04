# Bashedu Auction Platform

A comprehensive quiz-based learning platform with auction-style earnings system, built with React and Node.js.

## 🚀 Features

### Frontend (React + Tailwind)
- **Pages**: Home, CourseDetails, Quiz, Result, Leaderboard, Login, Signup
- **Components**: Navbar, CourseCard, QuestionCard, Timer, Notification
- **Services**: API integration, quiz management, result handling, authentication
- **Context**: Global state management with React Context
- **Authentication**: JWT-based auth with localStorage
- **Quiz System**: Interactive quizzes with countdown timer and real-time scoring
- **Responsive Design**: Mobile-first design with Tailwind CSS

### Backend (Node + Express + AI)
- **Authentication**: Secure JWT auth with bcrypt password hashing
- **Quiz Management**: Dynamic quiz creation and management
- **AI Integration**: OpenAI-powered question generation
- **Results & Analytics**: Comprehensive result tracking and analytics
- **Leaderboard System**: Real-time rankings and competitions
- **Auction System**: Performance-based earnings calculation
- **Fallback System**: JSON fallback when AI services are unavailable

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern hooks-based components
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client for API calls
- **Context API** - Global state management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (with Mongoose ODM)
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **OpenAI API** - AI-powered content generation
- **Joi** - Input validation

## 📁 Project Structure

```
bashedu-auction-platform/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── context/        # React context
│   │   ├── utils/          # Utility functions
│   │   └── App.jsx        # Main app component
│   ├── package.json
│   └── tailwind.config.js
├── backend/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── services/         # Business logic services
│   ├── config/           # Configuration files
│   ├── data/             # Fallback JSON data
│   ├── server.js         # Server entry point
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (optional, uses fallback JSON if not configured)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bashedu-auction-platform
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your configuration
   # Required: JWT_SECRET, OPENAI_API_KEY
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev  # Development mode with nodemon
   # or
   npm start    # Production mode
   ```

2. **Start the frontend application**
   ```bash
   cd frontend
   npm start
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-3.5-turbo

# Database Configuration (optional)
MONGODB_URI=mongodb://localhost:27017/bashedu-auction
```

### OpenAI Setup

1. Get an API key from [OpenAI Platform](https://platform.openai.com/)
2. Add the API key to your `.env` file
3. The system will automatically use OpenAI for question generation
4. Fallback JSON questions will be used if OpenAI is unavailable

## 📚 API Documentation

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - User logout

### Quiz Routes
- `GET /api/quiz/questions/:courseId` - Get quiz questions
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/history` - Get quiz history
- `GET /api/quiz/result/:quizId` - Get specific result

### AI Routes
- `POST /api/ai/generate-questions` - Generate AI questions
- `POST /api/ai/generate-explanations` - Generate explanations
- `POST /api/ai/generate-recommendations` - Get recommendations

### Results Routes
- `GET /api/results/leaderboard` - Get leaderboard
- `GET /api/results/user` - Get user results
- `GET /api/results/stats/:courseId` - Get course statistics

## 🎯 Key Features

### Quiz System
- **Dynamic Questions**: AI-generated or fallback JSON questions
- **Real-time Timer**: Countdown timer with warnings
- **Interactive Interface**: Smooth question navigation
- **Instant Feedback**: Immediate results and explanations
- **Progress Tracking**: Visual progress indicators

### Auction System
- **Performance-based Earnings**: Earn based on quiz performance
- **Multiple Factors**: Score, speed, difficulty, streaks
- **Leaderboard Rankings**: Competitive element
- **Achievement System**: Unlock badges and rewards

### AI Integration
- **Smart Question Generation**: Context-aware questions
- **Personalized Recommendations**: Learning suggestions
- **Study Plans**: Customized learning paths
- **Fallback System**: Graceful degradation when AI fails

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
npm test
```

## 📦 Deployment

### Frontend Deployment
1. Build the application:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the `build` folder to your hosting service

### Backend Deployment
1. Set production environment variables
2. Install dependencies: `npm install --production`
3. Start the server: `npm start`

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Joi validation for all inputs
- **Rate Limiting**: Express-rate-limit protection
- **CORS Configuration**: Proper cross-origin setup
- **Helmet.js**: Security headers

## 🎨 UI/UX Features

- **Responsive Design**: Works on all devices
- **Dark Mode Support**: Theme switching capability
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Accessibility**: WCAG compliance considerations

## 📊 Analytics & Monitoring

- **Quiz Performance**: Detailed analytics
- **User Progress**: Learning tracking
- **Earnings Tracking**: Financial analytics
- **Leaderboard Stats**: Competition metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the FAQ section

## 🔄 Version History

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added AI integration
- **v1.2.0** - Enhanced auction system
- **v1.3.0** - Mobile optimization

---

**Built with ❤️ by the Eagles Team**
