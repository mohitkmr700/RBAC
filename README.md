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

## Description

[Nest](https://github.com/nestjs/nest) is a TypeScript-based framework for building efficient, scalable, and easily maintainable server-side applications. It provides an out-of-the-box application architecture that allows for easy integration of various modules, and it's built with TypeScript, which ensures a high level of reliability and scalability.

This project is an authentication service with Supabase integration, featuring user management and profile listing capabilities.

## Project Setup

To install the project dependencies, run the following command:

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Documentation

### Authentication Endpoints

- `POST /auth/login` - User login
- `POST /auth/signup` - User registration (requires punisher role)

### User Profile Endpoints

The user module provides API endpoints for managing user profiles stored in the Supabase `profiles` table.

#### Available Endpoints

| Endpoint | Method | Description | Auth Required | Roles |
|----------|--------|-------------|---------------|-------|
| `/user/profiles` | GET | Get all profiles | ✅ | punisher, user |
| `/user/profiles/:id` | GET | Get profile by ID | ✅ | punisher, user |
| `/user/profiles/role/:role` | GET | Get profiles by role | ✅ | punisher only |
| `/user/profiles/search?q=query` | GET | Search profiles | ✅ | punisher, user |

#### Authentication

All endpoints require authentication using JWT tokens. You can provide the token in two ways:

1. **Cookie**: Set `access_token` cookie (used by web applications)
2. **Bearer Token**: Include `Authorization: Bearer <token>` header (used by mobile apps, Postman, etc.)

#### Usage Examples

```bash
# Get all profiles
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3301/user/profiles

# Get profile by ID
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3301/user/profiles/123e4567-e89b-12d3-a456-426614174000

# Get profiles by role
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3301/user/profiles/role/user

# Search profiles
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     "http://localhost:3301/user/profiles/search?q=john"
```

#### Database Schema

The module works with the Supabase `profiles` table:

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key, matches auth.users.id |
| created_at | timestamp | When the profile was created |
| fullname | text | User's full name |
| avatar_url | text | URL to user's avatar (optional) |
| role | text | User role ('punisher' or 'user') |
| phone | text | User's phone number (optional) |
| email | varchar | User's email address |

## Swagger Documentation

Interactive API documentation is available at:
```
http://localhost:3301/api
```

This provides a web interface where you can:
- View all available endpoints
- Test endpoints directly
- See request/response schemas
- Authenticate with your JWT token

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
