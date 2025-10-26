# AI Presentation Coach

An AI-powered web application that helps users improve their presentation and public speaking skills through real-time analysis and feedback.

<img width="500" height="450" alt="image" src="https://github.com/user-attachments/assets/ac08333a-e0ca-47fe-9fef-a8442cd7b701" />

<img width="500" height="450" alt="image" src="https://github.com/user-attachments/assets/d7287f01-4c67-44b0-9471-f0d9985d6ca7" />

## Features

- **Speech Analysis**: Upload audio/video recordings or record directly in the browser
- **Real-time Metrics**:
  - Speaking pace (WPM)
  - Filler word detection
  - Clarity scoring
  - Long pause analysis
- **Interactive Visualizations**:
  - Pace tracking over time
  - Filler word breakdown
  - Performance metrics dashboard
- **AI Feedback**: Personalized coaching tips from AI
- **Session Management**: Create and manage multiple practice sessions
- **Progress Tracking**: Monitor improvements across recordings

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Recharts for data visualization
- Lucide React for icons
- Context API for state management

### Backend
- FastAPI (Python)
- MongoDB for data storage
- Groq for AI feedback generation
- Deepgram for speech-to-text
- JWT authentication

## Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- MongoDB

### Environment Variables

#### Backend (.env)
```env
MONGODB_URI=your_mongodb_uri
GROQ_API_KEY=your_groq_api_key
DEEPGRAM_API_KEY=your_deepgram_api_key
JWT_SECRET_KEY=your_jwt_secret
```
