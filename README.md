<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord" /></a>
  <a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
  <a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us" /></a>
  <a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us" /></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter" /></a>
</p>

# Auth Service

A NestJS-based authentication service with Supabase integration, featuring user management, role-based access control, and profile management capabilities.

## Features

- 🔐 JWT-based authentication with Supabase
- 👥 User management and profile handling
- 🛡️ Role-based access control (punisher, user roles)
- 📋 Permission management system
- 🏥 Health check endpoints
- 📚 Swagger API documentation
- 🔒 Secure cookie-based and bearer token authentication

## Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT + Supabase Auth
- **Documentation**: Swagger/OpenAPI
- **Language**: TypeScript

## Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Supabase account and project

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Server Configuration
PORT=3301
```

**⚠️ Security Note**: Never commit your `.env` file to version control. The `.gitignore` file is configured to exclude it.

## Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

## Running the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

The application will be available at `http://localhost:3301`

## API Documentation

### Interactive Documentation

Access the Swagger UI at: `http://localhost:3301/api`

### Authentication Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/auth/login` | POST | User login | ❌ |
| `/auth/signup` | POST | User registration | ✅ (punisher role) |

### User Profile Endpoints

| Endpoint | Method | Description | Auth Required | Roles |
|----------|--------|-------------|---------------|-------|
| `/user/profiles` | GET | Get all profiles | ✅ | punisher, user |
| `/user/profiles/:id` | GET | Get profile by ID | ✅ | punisher, user |
| `/user/profiles/role/:role` | GET | Get profiles by role | ✅ | punisher only |
| `/user/profiles/search?q=query` | GET | Search profiles | ✅ | punisher, user |

### Permission Endpoints

| Endpoint | Method | Description | Auth Required | Roles |
|----------|--------|-------------|---------------|-------|
| `/permissions` | GET | Get all permissions | ✅ | punisher only |
| `/permissions` | POST | Create new permission | ✅ | punisher only |

### Health Check

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Application health status |

## Authentication

The service supports two authentication methods:

### 1. Cookie-based Authentication (Web Applications)
```javascript
// Login and set cookie
const response = await fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ email, password })
});
```

### 2. Bearer Token Authentication (Mobile Apps, API Clients)
```javascript
// Include token in Authorization header
const response = await fetch('/user/profiles', {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
});
```

## Usage Examples

### Login
```bash
curl -X POST http://localhost:3301/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get All Profiles (with Bearer Token)
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3301/user/profiles
```

### Search Profiles
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     "http://localhost:3301/user/profiles/search?q=john"
```

## Database Schema

### Profiles Table (Supabase)
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key, matches auth.users.id |
| created_at | timestamp | When the profile was created |
| fullname | text | User's full name |
| avatar_url | text | URL to user's avatar (optional) |
| role | text | User role ('punisher' or 'user') |
| phone | text | User's phone number (optional) |
| email | varchar | User's email address |

## Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.guard.ts
│   ├── auth.decorator.ts
│   └── dto/
│       ├── login.dto.ts
│       └── signup.dto.ts
├── user/                 # User management module
│   ├── user.controller.ts
│   ├── user.service.ts
│   └── dto/
│       └── profile.dto.ts
├── permission/           # Permission management module
│   ├── permission.controller.ts
│   ├── permission.service.ts
│   ├── pocketbase.client.ts
│   └── dto/
│       └── permission.dto.ts
├── health/              # Health check module
│   ├── health.controller.ts
│   └── health.module.ts
├── supabase/            # Supabase client configuration
│   └── supabase.client.ts
├── app.controller.ts    # Main application controller
├── app.module.ts        # Root module
└── main.ts             # Application entry point
```

## Development

### Available Scripts

```bash
# Development
npm run start:dev      # Start in development mode
npm run start:debug    # Start in debug mode

# Building
npm run build          # Build the application
npm run build:tsc      # TypeScript compilation

# Testing
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage
npm run test:e2e       # Run end-to-end tests

# Code Quality
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
```

### Code Style

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

## Security Considerations

1. **Environment Variables**: All sensitive configuration is stored in environment variables
2. **JWT Tokens**: Tokens are signed with a secure secret and have appropriate expiration
3. **Role-based Access**: Endpoints are protected with role-based guards
4. **Input Validation**: All inputs are validated using class-validator decorators
5. **HTTPS**: Use HTTPS in production environments

## Deployment

### Docker (Recommended)

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3301

CMD ["node", "dist/main.js"]
```

### Environment Setup

Ensure all required environment variables are set in your deployment environment:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- `PORT` (optional, defaults to 3301)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and tests
6. Submit a pull request

## License

This project is licensed under the UNLICENSED license.
