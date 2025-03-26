# TecniTrama Backend

This is the backend server for the TecniTrama application, built with Node.js, Express, and PostgreSQL.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Database](#database)
- [Socket.io](#socketio)

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/TecniTrama.git

# Navigate to the backend directory
cd TecniTrama/backend

# Install dependencies
npm install

# Set up environment variables
# Create a .env file based on the example below

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run start
```

## Environment Variables

Create a `.env` file in the root of the backend directory with the following variables:

```env
# Database connection
DATABASE_URL=postgresql://username:password@localhost:5432/tecnitrama

# JWT Authentication
JWT_SECRET=your_jwt_secret_key

# Session
SESSION_SECRET=your_session_secret_key

# Server
PORT=3000
```

## API Endpoints

### Users

- `GET /api/users` - Get all users (requires authentication)
- `GET /api/users/:id` - Get user by ID (requires authentication)
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `PUT /api/users/:id` - Update user (requires authentication)
- `DELETE /api/users/:id` - Delete user (requires authentication)

### Profiles

- `GET /api/profiles` - Get all profiles (requires authentication)
- `GET /api/profiles/:id` - Get profile by ID (requires authentication)
- `POST /api/profiles` - Create a new profile (requires authentication)
- `PUT /api/profiles/:id` - Update profile (requires authentication)
- `DELETE /api/profiles/:id` - Delete profile (requires authentication)

## Database

The application uses PostgreSQL as the database and Prisma as the ORM. The database schema is defined in `prisma/schema.prisma`.

## Socket.io

The application uses Socket.io for real-time communication. Socket configuration can be found in `src/config/socket.js`.

## API Documentation

API documentation is available at `/api-docs` when the server is running, powered by Swagger UI.