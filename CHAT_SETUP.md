# Chat Dashboard Setup Guide

## Overview
The chat-dashboard feature allows users to book calls with experts and communicate with them through a messaging interface with auto-translation support.

## Features
1. **Book a Call**: Users can click "Book a Call" on expert cards (only works with real experts, not dummy data)
2. **Chat Interface**: Two-pane layout with conversations on the left and chat on the right
3. **Auto Translation**: Toggle to enable/disable Google Translate API for multilingual conversations
4. **Navigation**: Easy switching between frontend (port 5173) and chat-dashboard (port 5174)

## Setup Instructions

### 1. Backend Setup
1. Install dependencies (if not already installed):
   ```bash
   cd backend
   npm install
   ```

2. Add Google Translate API key to `.env`:
   ```env
   GOOGLE_TRANSLATE_API_KEY=your_api_key_here
   ```
   
   **Note**: You can get a free API key from [Google Cloud Console](https://console.cloud.google.com/). The free tier allows 500,000 characters per month.

3. Update CORS settings in `backend/app.js` if needed (already configured for ports 5173 and 5174)

4. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Install dependencies (if not already installed):
   ```bash
   cd frontend
   npm install
   ```

2. Start the frontend:
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

### 3. Chat Dashboard Setup
1. Install dependencies:
   ```bash
   cd chat-dashboard
   npm install
   ```

2. Start the chat-dashboard:
   ```bash
   npm run dev
   ```
   Chat-dashboard runs on `http://localhost:5174`

## Usage

### Booking a Call
1. Navigate to the Experts page (`/experts`)
2. Find an expert (must be a real expert, not dummy data)
3. Click "Book a Call" button
4. If not logged in, you'll be prompted to login
5. Once logged in, you'll be redirected to the chat-dashboard

### Using Chat Dashboard
1. **View Conversations**: All your conversations appear in the left panel
2. **Select Conversation**: Click on a conversation to view messages
3. **Send Messages**: Type in the message input and press Enter or click Send
4. **Enable Translation**: Toggle "Auto-translate" in the chat header to enable translation
5. **Navigate Back**: Click the back arrow in the top-left to return to frontend

### Navigation Between Apps
- **From Frontend to Chat**: Click "Chat Dashboard" button in the navbar (when logged in)
- **From Chat to Frontend**: Click the back arrow (←) in the top-left of the chat dashboard

## Important Notes

1. **Real Experts Only**: The system checks if an expert has a corresponding user account. Dummy experts (from data initialization) cannot receive calls.

2. **Authentication**: Both frontend and chat-dashboard use the same authentication cookies, so you stay logged in across both apps.

3. **Translation**: 
   - When enabled, messages are translated using Google Translate API
   - The target language defaults to English but can be customized
   - Translation happens server-side for security

4. **Database**: Uses MongoDB. Make sure your MongoDB connection string is set in `backend/.env`:
   ```env
   MONGO_URI=your_mongodb_connection_string
   ```

## API Endpoints

### Chat Routes (`/api/chat`)
- `POST /conversations` - Create or get conversation with expert
- `GET /conversations` - Get all conversations for logged-in user
- `GET /conversations/:id/messages` - Get messages for a conversation
- `POST /conversations/:id/messages` - Send a message
- `POST /messages/:id/translate` - Translate a message

## Troubleshooting

1. **CORS Errors**: Make sure both frontend (5173) and chat-dashboard (5174) are in the allowed origins in `backend/app.js`

2. **Translation Not Working**: 
   - Check if `GOOGLE_TRANSLATE_API_KEY` is set in backend `.env`
   - Check API key quota in Google Cloud Console

3. **Cannot Book Call with Expert**: 
   - Expert must be a real user (created through signup, not dummy data)
   - Check browser console for error messages

4. **Messages Not Appearing**: 
   - Check if you're logged in (check cookies)
   - Verify backend is running and accessible
   - Check browser console for errors

## Development Notes

- Frontend: React + Vite (port 5173)
- Chat Dashboard: React + Vite (port 5174)
- Backend: Express + MongoDB (port 5000)
- Translation: Google Translate API (free tier)

