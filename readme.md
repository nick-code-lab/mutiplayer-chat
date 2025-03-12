# Multiplayer Chat Application

A real-time chat application supporting text, audio, and video messaging with a clean, user-friendly interface.

## Overview

This project is a full-featured chat application that allows multiple users to communicate in real-time. It supports text messaging, audio recording/playback, and video recording/playback, making it a versatile communication tool.

## Features

- **Real-time Communication**: Instant message delivery using WebSockets
- **Multiple Message Types**: Support for text, audio, and video messages
- **User Authentication**: Simple username/password login system
- **Responsive UI**: Clean interface built with Ant Design components
- **User Avatars**: Visual identification of different users
- **Message Timestamps**: Track when messages were sent
- **Auto-scrolling**: Chat window automatically scrolls to the latest messages
- **Docker Support**: Easy deployment with Docker and Docker Compose

## Tech Stack

### Frontend
- **React**: UI library for building the user interface
- **Ant Design**: UI component library for a polished look and feel
- **Vite**: Build tool and development server
- **WebSocket API**: For real-time communication with the server

### Backend
- **Node.js**: JavaScript runtime for the server
- **Express**: Web framework for Node.js
- **express-ws**: WebSocket middleware for Express

### Deployment
- **Docker**: Containerization platform
- **Nginx**: Web server for serving static files
- **Supervisor**: Process manager for running multiple services

## Architecture

The application follows a client-server architecture:

1. **Client (UI)**: React application that handles user interactions and displays messages
2. **Server**: Node.js/Express server that manages WebSocket connections and broadcasts messages
3. **WebSocket**: Communication protocol for real-time data exchange between clients and server

## Getting Started

### Prerequisites
- Docker and Docker Compose installed on your system

### Installation and Running

1. Clone the repository
2. Navigate to the project directory
3. Run the following command:

```bash
docker-compose up --build
```

4. Access the application at http://localhost:80

### User Accounts

The application supports multiple users. You can use the following credentials or create your own:

- **Main User**: 
  - Username: qizi
  - Password: any (password is not validated)
  
- **Secondary User**:
  - Username: nick
  - Password: any (password is not validated)

- **Other Users**:
  - You can create any username/password combination

## Usage Guide

1. **Login**: Enter your username and any password
2. **Send Text Message**: Type in the input field and press Enter or click Send
3. **Send Audio Message**: Click the audio icon, record your message, and click it again to send
4. **Send Video Message**: Click the video icon, record your video, and click it again to send
5. **View Messages**: All messages appear in the chat window with the sender's avatar and timestamp

## Testing the Chat

To test the chat functionality:
1. Open two browser tabs with the same URL (http://localhost:80)
2. Log in with different usernames in each tab
3. Send messages from one tab and see them appear in the other tab in real-time

## Development

### Project Structure

- `/ui`: Frontend React application
  - `/src`: Source code
    - `/components`: React components
    - `/assets`: Images and other static assets
- `/server`: Backend Node.js application
  - `chat.js`: WebSocket server implementation
- Docker configuration files for deployment

### Local Development

To run the application locally without Docker:

1. Install dependencies:
```bash
npm run install
```

2. Start the development server:
```bash
npm start
```

## License

ISC License

## Author

qiqi
