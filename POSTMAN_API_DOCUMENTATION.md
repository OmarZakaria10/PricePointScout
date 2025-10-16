# PricePointScout API Documentation for Postman

## Base URL
```
http://localhost:3000
```
or your deployed server URL

---

## Table of Contents
1. [Health Check Endpoints](#health-check-endpoints)
2. [Authentication Endpoints](#authentication-endpoints)
3. [User Management Endpoints](#user-management-endpoints)
4. [Scraping Endpoints](#scraping-endpoints)
5. [Search History Endpoints](#search-history-endpoints)
6. [Cart Management Endpoints](#cart-management-endpoints)
7. [Metrics Endpoint](#metrics-endpoint)

---

## Authentication
Most endpoints require authentication. Include the JWT token in the request header:
```
Authorization: Bearer <your_jwt_token>
```
Or the token will be automatically sent via cookies after login.

---

## Health Check Endpoints

### 1. Basic Health Check
**GET** `/health`

**Description:** Simple health check to verify if the API is running.

**Headers:** None required

**Response:**
```json
{
  "status": "healthy",
  "time": "2025-10-05T12:00:00.000Z",
  "message": "PricePointScout is running!"
}
```

---

### 2. Readiness Check
**GET** `/health/ready`

**Description:** Comprehensive readiness check including database and Redis connection status.

**Headers:** None required

**Response (Success):**
```json
{
  "status": "ready",
  "timestamp": "2025-10-05T12:00:00.000Z",
  "version": "1.0.0",
  "uptime": 3600,
  "checks": {
    "database": "healthy",
    "redis": "healthy",
    "memory": {
      "rss": "50.25 MB",
      "heapTotal": "20.50 MB",
      "heapUsed": "15.30 MB",
      "external": "2.10 MB"
    }
  }
}
```

**Response (Service Unavailable - 503):**
```json
{
  "status": "not ready",
  "timestamp": "2025-10-05T12:00:00.000Z",
  "error": "Database not connected"
}
```

---

### 3. Liveness Check
**GET** `/health/live`

**Description:** Check if the application process is alive.

**Headers:** None required

**Response:**
```json
{
  "status": "alive",
  "timestamp": "2025-10-05T12:00:00.000Z",
  "uptime": 3600
}
```

---

## Authentication Endpoints

### 1. Sign Up
**POST** `/users/signup`

**Description:** Register a new user account.

**Headers:** 
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123",
  "role": "User"
}
```

**Field Notes:**
- `name`: 3-50 characters, must be unique
- `email`: Must be a valid email address
- `password`: Minimum 6 characters
- `passwordConfirm`: Must match password
- `role`: Either "Admin" or "User" (optional, defaults to "User")

**Response (201 Created):**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "64abc123def456789",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "User"
    }
  }
}
```

---

### 2. Login
**POST** `/users/login`

**Description:** Login with existing credentials.

**Headers:** 
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "64abc123def456789",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "User"
    }
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "status": "error",
  "message": "Incorrect name or password"
}
```

---

### 3. Logout
**POST** `/users/logout`

**Description:** Logout the current user.

**Headers:** 
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success"
}
```

---

### 4. Forgot Password
**POST** `/users/forgotPassword`

**Description:** Request a password reset token via email.

**Headers:** 
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Token sent to email!"
}
```

**Response (404 Not Found):**
```json
{
  "status": "error",
  "message": "There is no user with email address."
}
```

---

### 5. Reset Password
**PATCH** `/users/resetPassword/:token`

**Description:** Reset password using the token received via email.

**Headers:** 
```
Content-Type: application/json
```

**URL Parameters:**
- `token`: The reset token from the email

**Request Body:**
```json
{
  "password": "newPassword123",
  "passwordConfirm": "newPassword123"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "64abc123def456789",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

## User Management Endpoints
**Note:** All endpoints below require authentication

### 1. Update My Password
**PATCH** `/users/updateMyPassword`

**Description:** Update the current user's password.

**Headers:** 
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "passwordCurrent": "oldPassword123",
  "password": "newPassword123",
  "passwordConfirm": "newPassword123"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "64abc123def456789",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

### 2. Get My Profile
**GET** `/users/me`

**Description:** Get the current user's profile information.

**Headers:** 
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "64abc123def456789",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "User",
      "createdAt": "2025-01-01T10:00:00.000Z"
    }
  }
}
```

---

### 3. Update My Profile
**PATCH** `/users/updateMe`

**Description:** Update the current user's profile (name, email only).

**Headers:** 
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "johnupdated@example.com"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "64abc123def456789",
      "name": "John Updated",
      "email": "johnupdated@example.com",
      "role": "User"
    }
  }
}
```

---

### 4. Delete My Account
**DELETE** `/users/deleteMe`

**Description:** Soft delete (deactivate) the current user's account.

**Headers:** 
```
Authorization: Bearer <token>
```

**Response (204 No Content)**

---

### 5. Get All Users (Admin Only)
**GET** `/users/`

**Description:** Get all users (requires admin role).

**Headers:** 
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "status": "success",
  "results": 10,
  "data": {
    "users": [
      {
        "_id": "64abc123def456789",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "User"
      }
    ]
  }
}
```

---

### 6. Create User (Admin Only)
**POST** `/users/`

**Description:** Create a new user (requires admin role).

**Headers:** 
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "passwordConfirm": "password123",
  "role": "User"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "64abc789def123456",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "User"
    }
  }
}
```

---

### 7. Get User by ID (Admin Only)
**GET** `/users/:id`

**Description:** Get a specific user by ID (requires admin role).

**Headers:** 
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: User ID (e.g., `64abc123def456789`)

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "64abc123def456789",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "User"
    }
  }
}
```

---

### 8. Update User (Admin Only)
**PATCH** `/users/:id`

**Description:** Update a specific user (requires admin role).

**Headers:** 
```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**
- `id`: User ID

**Request Body:**
```json
{
  "name": "Updated Name",
  "role": "Admin"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "64abc123def456789",
      "name": "Updated Name",
      "email": "john@example.com",
      "role": "Admin"
    }
  }
}
```

---

### 9. Delete User (Admin Only)
**DELETE** `/users/:id`

**Description:** Delete a specific user (requires admin role).

**Headers:** 
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: User ID

**Response (204 No Content)**

---

## Scraping Endpoints

### 1. Scrape Products (Guest)
**GET** `/scrape/guest`

**Description:** Scrape products from e-commerce sites without authentication. Rate limited.

**Headers:** None required

**Query Parameters:**
- `keyword` (required): Search keyword (e.g., "laptop")
- `sources` (optional): Comma-separated source names (e.g., "amazon,jumia,noon,elbadr"). If not provided, all sources are used.
- `sort` (optional): Sort order - "asc" (ascending) or "des" (descending) by price
- `minPrice` (optional): Minimum price filter (numeric)
- `maxPrice` (optional): Maximum price filter (numeric)

**Example Request:**
```
GET /scrape/guest?keyword=laptop&sources=amazon,jumia&sort=asc&minPrice=500&maxPrice=2000
```

**Response (200 OK):**
```json
[
  {
    "title": "Dell Inspiron Laptop",
    "price": "799.99 EGP",
    "link": "https://amazon.eg/product/12345",
    "img": "https://amazon.eg/image.jpg",
    "source": "amazon"
  },
  {
    "title": "HP Pavilion Laptop",
    "price": "1299.00 EGP",
    "link": "https://jumia.com.eg/product/67890",
    "img": "https://jumia.com.eg/image.jpg",
    "source": "jumia"
  }
]
```

**Response (400 Bad Request):**
```json
{
  "error": "Missing \"keyword\" query parameter"
}
```

---

### 2. Scrape Products (Authenticated User)
**GET** `/scrape/user`

**Description:** Scrape products with authentication. Saves search history. Rate limited.

**Headers:** 
```
Authorization: Bearer <token>
```

**Query Parameters:**
- Same as guest endpoint

**Example Request:**
```
GET /scrape/user?keyword=laptop&sources=amazon,noon&sort=asc
```

**Response (200 OK):**
Same format as guest endpoint, but the search is automatically saved to the user's search history.

---

## Search History Endpoints
**Note:** All endpoints require authentication

### 1. Get My Searches
**GET** `/search/mySearches`

**Description:** Get all search history for the authenticated user.

**Headers:** 
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "searches": [
      {
        "_id": "64abc123def456789",
        "keyword": "laptop",
        "sources": ["amazon", "jumia"],
        "sort": "asc",
        "minPrice": 500,
        "maxPrice": 2000,
        "resultsCount": 25,
        "createdAt": "2025-10-01T10:00:00.000Z",
        "updatedAt": "2025-10-01T10:00:00.000Z"
      }
    ]
  }
}
```

---

### 2. Get Search by ID
**GET** `/search/getSearch/:id`

**Description:** Get a specific search with full results.

**Headers:** 
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Search ID

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "search": {
      "_id": "64abc123def456789",
      "keyword": "laptop",
      "sources": ["amazon", "jumia"],
      "sort": "asc",
      "minPrice": 500,
      "maxPrice": 2000,
      "user": "64user123",
      "results": [
        {
          "title": "Dell Inspiron Laptop",
          "price": "799.99 EGP",
          "link": "https://amazon.eg/product/12345",
          "img": "https://amazon.eg/image.jpg",
          "source": "amazon"
        }
      ],
      "createdAt": "2025-10-01T10:00:00.000Z"
    }
  }
}
```

---

### 3. Delete Search
**DELETE** `/search/deleteSearch/:id`

**Description:** Delete a specific search from history.

**Headers:** 
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Search ID

**Response (204 No Content)**

---

## Cart Management Endpoints
**Note:** All endpoints require authentication

### 1. Get My Cart
**GET** `/cart/getCart`

**Description:** Get the current user's shopping cart.

**Headers:** 
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "cart": {
      "_id": "64cart123",
      "user": "64user123",
      "items": [
        {
          "_id": "64item123",
          "title": "Dell Inspiron Laptop",
          "price": "799.99 EGP",
          "link": "https://amazon.eg/product/12345",
          "img": "https://amazon.eg/image.jpg",
          "quantity": 2,
          "addedAt": "2025-10-01T10:00:00.000Z"
        }
      ],
      "status": "active",
      "createdAt": "2025-10-01T09:00:00.000Z",
      "updatedAt": "2025-10-01T10:00:00.000Z"
    }
  }
}
```

**Response (404 Not Found):**
```json
{
  "status": "error",
  "message": "No active cart found for user"
}
```

---

### 2. Add Item to Cart
**POST** `/cart/addItem`

**Description:** Add a product to the cart.

**Headers:** 
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Dell Inspiron Laptop",
  "price": "799.99 EGP",
  "link": "https://amazon.eg/product/12345",
  "img": "https://amazon.eg/image.jpg",
  "quantity": 1
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "cart": {
      "_id": "64cart123",
      "user": "64user123",
      "items": [
        {
          "_id": "64item123",
          "title": "Dell Inspiron Laptop",
          "price": "799.99 EGP",
          "link": "https://amazon.eg/product/12345",
          "img": "https://amazon.eg/image.jpg",
          "quantity": 1,
          "addedAt": "2025-10-01T10:00:00.000Z"
        }
      ],
      "status": "active"
    }
  }
}
```

---

### 3. Remove Item from Cart
**DELETE** `/cart/removeItem/:itemId`

**Description:** Remove a specific item from the cart.

**Headers:** 
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `itemId`: The ID of the cart item to remove

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "cart": {
      "_id": "64cart123",
      "items": [],
      "status": "active"
    }
  }
}
```

---

### 4. Update Item Quantity
**PATCH** `/cart/updateItem/:itemId`

**Description:** Update the quantity of a specific cart item.

**Headers:** 
```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**
- `itemId`: The ID of the cart item to update

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "cart": {
      "_id": "64cart123",
      "items": [
        {
          "_id": "64item123",
          "title": "Dell Inspiron Laptop",
          "price": "799.99 EGP",
          "quantity": 3
        }
      ]
    }
  }
}
```

---

### 5. Clear Cart
**DELETE** `/cart/clearCart`

**Description:** Remove all items from the cart.

**Headers:** 
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "cart": {
      "_id": "64cart123",
      "items": [],
      "status": "active"
    }
  }
}
```

---

## Metrics Endpoint

### Get Prometheus Metrics
**GET** `/metrics`

**Description:** Get Prometheus-formatted application metrics.

**Headers:** None required

**Response (200 OK):**
```
# HELP http_request_duration_seconds Duration of HTTP requests in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.1",method="GET",route="/users",code="200"} 45
...
```

---

## Error Responses

All endpoints may return error responses in the following format:

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "You are not logged in! Please log in to get access."
}
```

### 403 Forbidden
```json
{
  "status": "error",
  "message": "You do not have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "status": "error",
  "message": "Too many requests from this IP, please try again later."
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Something went wrong!"
}
```

---

## Rate Limiting

- **General API**: Limited to 100 requests per IP per hour
- **Scraper endpoints** (`/scrape/*`): More restrictive rate limiting applied

---

## Notes for Postman Collection Setup

### Environment Variables
Create a Postman environment with these variables:
- `base_url`: `http://localhost:3000` (or your server URL)
- `token`: (auto-populated after login)
- `user_id`: (auto-populated after login)

### Auto-Save Token Script
Add this to the **Tests** tab of your login/signup requests:
```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
    const jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
    if (jsonData.data && jsonData.data.user) {
        pm.environment.set("user_id", jsonData.data.user._id);
    }
}
```

### Authorization Setup
For protected endpoints, in the **Authorization** tab:
- Type: `Bearer Token`
- Token: `{{token}}`

---

## Available Sources for Scraping
- `amazon` - Amazon Egypt
- `jumia` - Jumia Egypt
- `noon` - Noon Egypt
- `elbadr` - ElBadr Egypt

If no sources are specified, all sources will be scraped.

---

## Postman Collection Structure Recommendation

```
PricePointScout API
├── Health Checks
│   ├── Basic Health Check
│   ├── Readiness Check
│   └── Liveness Check
├── Authentication
│   ├── Sign Up
│   ├── Login
│   ├── Logout
│   ├── Forgot Password
│   └── Reset Password
├── User Management
│   ├── Current User
│   │   ├── Get My Profile
│   │   ├── Update My Password
│   │   ├── Update My Profile
│   │   └── Delete My Account
│   └── Admin Operations
│       ├── Get All Users
│       ├── Create User
│       ├── Get User by ID
│       ├── Update User
│       └── Delete User
├── Product Scraping
│   ├── Scrape Products (Guest)
│   └── Scrape Products (User)
├── Search History
│   ├── Get My Searches
│   ├── Get Search by ID
│   └── Delete Search
├── Shopping Cart
│   ├── Get My Cart
│   ├── Add Item to Cart
│   ├── Remove Item from Cart
│   ├── Update Item Quantity
│   └── Clear Cart
└── Monitoring
    └── Get Metrics
```

---

## Quick Start Guide

1. **Import this documentation into Postman**
2. **Set up environment variables** (`base_url`, `token`)
3. **Start with Health Check** to verify API is running
4. **Sign Up** or **Login** to get authentication token
5. **Test Scraping** with the guest endpoint first
6. **Try authenticated features** (cart, search history, etc.)

---

## Support

For issues or questions, please refer to the project repository or contact the development team.

**Last Updated:** October 5, 2025
**API Version:** 1.0.0
