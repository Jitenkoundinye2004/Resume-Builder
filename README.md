# Resume Builder

A full-stack web application for creating and managing professional resumes with AI-powered features.

## Features

- User authentication (register/login/forgot password)
- Resume creation and editing
- Multiple resume templates
- AI-powered content suggestions
- Image upload for profile pictures
- PDF export functionality
- Responsive design
- Password reset via email

## Tech Stack

### Frontend
- React 19
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls
- Vite for build tooling

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- ImageKit for image management
- OpenAI API for AI features

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd resume-builder
```

2. Install dependencies:
```bash
npm run build
```

This will install dependencies for both frontend and backend.

3. Set up environment variables:
```bash
cp .env.example backend/.env
```

Edit `backend/.env` with your actual configuration values.

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Database Configuration
MONGODB_URL=mongodb://localhost:27017/resume-builder

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id

# AI Configuration (OpenAI compatible)
GEMINI_API_KEY=your_gemini_api_key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_API_KEY=your_openai_api_key

# Email Configuration (for password reset)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password

# Frontend Base URL (for production)
FRONTEND_URL=http://localhost:5173

# Port (optional, defaults to 5000)
PORT=5000
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. In a new terminal, start the frontend:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Building for Production

1. Build the frontend:
```bash
npm run build-frontend
```

2. Start the production server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `POST /api/users/forgot-password` - Request password reset
- `POST /api/users/reset-password/:token` - Reset password with token
- `GET /api/users/data` - Get user data (protected)

### Resumes
- `POST /api/resumes/create` - Create a new resume (protected)
- `PUT /api/resumes/update` - Update resume (protected)
- `DELETE /api/resumes/delete/:resumeId` - Delete resume (protected)
- `GET /api/resumes/get/:resumeId` - Get user resume (protected)
- `GET /api/resumes/public/:resumeId` - Get public resume

### AI Features
- `POST /api/ai/generate` - Generate AI content

## Project Structure

```
resume-builder/
├── backend/
│   ├── configs/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── Components/
│   │   ├── pages/
│   │   ├── app/
│   │   └── config/
│   ├── public/
│   ├── index.html
│   └── package.json
├── package.json
├── README.md
└── .env.example
```

## Deployment

This application is configured for deployment on platforms like Render, Heroku, or Vercel.

### Environment Setup for Production

1. Set all environment variables in your deployment platform
2. Ensure MongoDB is accessible from your deployment environment
3. Configure the `VITE_BASE_URL` for your frontend

### Build Commands

- Install all dependencies: `npm run build`
- Build frontend: `npm run build-frontend`
- Start production server: `npm start`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
