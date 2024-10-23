# BlinkIt API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Setup](#setup)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Database Schema](#database-schema)
6. [Real-time Features](#real-time-features)
7. [Admin Panel](#admin-panel)

## Overview

BlinkIt is a delivery management system built with Fastify and MongoDB. It provides functionality for:
- Customer and delivery partner management
- Order processing and tracking
- Product catalog management
- Real-time order status updates
- Administrative dashboard

## Setup

### Prerequisites
- Node.js
- MongoDB
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Create .env file with following variables
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
SESSION_SECRET=<your-session-secret>

# Start development server
npm run dev
```

### Dependencies
- **Fastify**: Web framework
- **Mongoose**: MongoDB ODM
- **Socket.io**: Real-time communications
- **AdminJS**: Admin panel
- **JWT**: Authentication
- **Additional packages**: Listed in package.json

## Authentication

The API uses JWT-based authentication.

### Token Management
- Access tokens are provided upon login
- Refresh tokens are used to obtain new access tokens
- Tokens must be included in Authorization header: `Bearer <token>`

### Protected Routes
Protected routes require a valid JWT token and use the `verifyToken` middleware.

## API Endpoints

### Authentication Routes
```
POST /api/customer/login
Request:
{
    "phone": "number",
    "password": "string"
}
Response:
{
    "token": "string",
    "refreshToken": "string",
    "user": UserObject
}

POST /api/deliveryPartner/login
Request:
{
    "email": "string",
    "password": "string"
}
Response:
{
    "token": "string",
    "refreshToken": "string",
    "user": UserObject
}

POST /api/refresh-token
Request:
{
    "refreshToken": "string"
}
Response:
{
    "token": "string"
}

GET /api/user (Protected)
Response:
{
    "user": UserObject
}

PATCH /api/user (Protected)
Request:
{
    "latitude": "string",
    "longitude": "string",
    "address": "string"
}
Response:
{
    "user": UserObject
}
```

### Product Routes
```
GET /api/categories
Response:
{
    "categories": [CategoryObject]
}

GET /api/products/:categoryId
Response:
{
    "products": [ProductObject]
}
```

### Order Routes (All Protected)
```
POST /api/order
Request:
{
    "items": [
        {
            "productId": "string",
            "count": number
        }
    ],
    "deliveryLocation": {
        "latitude": "string",
        "longitude": "string",
        "address": "string"
    }
}
Response:
{
    "order": OrderObject
}

GET /api/order
Response:
{
    "orders": [OrderObject]
}

PATCH /api/order/:orderId/status
Request:
{
    "status": "available" | "confirmed" | "arriving" | "delivered" | "cancelled"
}
Response:
{
    "order": OrderObject
}

PATCH /api/order/:orderId/confirm
Response:
{
    "order": OrderObject
}

GET /api/order/:orderId
Response:
{
    "order": OrderObject
}
```

## Database Schema

### User Management
- **User**: Base user type with common fields
- **Customer**: End users who place orders
- **DeliveryPartner**: Users who deliver orders
- **Admin**: System administrators

### Product Management
- **Product**: Individual items available for purchase
- **Category**: Product categories

### Order Management
- **Order**: Order details including status and locations
- **OrderItem**: Individual items within an order

### System Configuration
- **Counter**: Auto-increment counter for order IDs
- **Branch**: Physical locations with assigned delivery partners

Detailed schema definitions are available in the database schema section above.

## Real-time Features

The system uses Socket.io for real-time updates:
- Order status changes
- Delivery partner location updates
- New order notifications

### Socket Events
```javascript
// Order updates
socket.on('orderStatusUpdate', (orderId, status) => {})

// Location updates
socket.on('locationUpdate', (userId, location) => {})

// New orders
socket.on('newOrder', (order) => {})
```

## Admin Panel

The system includes an AdminJS-based administrative dashboard:

### Features
- User management
- Order monitoring
- Product catalog management
- Category management
- Branch management

### Access
- URL: `/admin`
- Requires admin credentials

### Custom Resources
- All database models are available in the admin panel
- Custom actions for order management
- Real-time order tracking

## Security Considerations

1. Authentication
   - JWT-based authentication
   - Token refresh mechanism
   - Protected routes

2. Data Validation
   - Input validation on all endpoints
   - Mongoose schema validation

3. Error Handling
   - Standardized error responses
   - Proper HTTP status codes

4. Rate Limiting
   - Consider implementing rate limiting for public endpoints

## Development Guidelines

1. Code Structure
   - Routes in separate files
   - Controllers for business logic
   - Middleware for common functionality

2. Error Handling
```javascript
try {
    // Operation
} catch (error) {
    fastify.log.error(error)
    reply.status(500).send({
        message: "Internal Server Error"
    })
}
```

3. Authentication
```javascript
// Protect routes with verifyToken middleware
fastify.get('/protected-route', {
    preHandler: [verifyToken]
}, handler)
```

## Deployment

1. Environment Variables
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret for JWT signing
   - `SESSION_SECRET`: Session secret for admin panel
   - Additional configuration as needed

2. Production Considerations
   - Use production MongoDB instance
   - Configure proper logging
   - Set up monitoring
   - Implement caching if needed

## Support

For issues and feature requests, please contact the development team or create an issue in the repository.