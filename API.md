# Threadless API Documentation

Complete reference for the Threadless REST API.

**Base URL:** `http://localhost:3000/api`

**Version:** 0.1.0 (MVP)

---

## Table of Contents

- [Authentication](#authentication)
- [Posts](#posts)
- [Connections](#connections)
- [Trust Score](#trust-score)
- [Comments](#comments)
- [Feed](#feed)
- [Profile](#profile)
- [About](#about)
- [Error Handling](#error-handling)

---

## Authentication

### Register

Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Validation:**
- `username`: Required, unique
- `password`: Required, minimum 6 characters

**Response:** `201 Created`
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "username": "alice",
    "masterPassword": "aB3dE5fG7hI9jK1l",
    "trustScore": 0
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Notes:**
- `masterPassword` is a 16-character auto-generated password. Save it securely.
- `token` is a JWT valid for 7 days by default.

---

### Login

Authenticate and receive JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:** `200 OK`
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "alice",
    "trustScore": 25,
    "isAdmin": false
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Missing credentials
- `401` - Invalid credentials

---

### Get Current User

Get authenticated user information.

**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": 1,
    "username": "alice",
    "trustScore": 25,
    "isAdmin": false,
    "profileData": {
      "bio": "Hello world",
      "avatar": "https://example.com/avatar.jpg"
    },
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

## Posts

All post endpoints require authentication.

### Create Post

**Endpoint:** `POST /posts`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "string",
  "visibility": "public" | "connections" | "private"
}
```

**Validation:**
- `content`: Required, non-empty
- `visibility`: Optional, defaults to "connections"

**Response:** `201 Created`
```json
{
  "message": "Post created successfully",
  "post": {
    "id": 1,
    "user_id": 1,
    "content": "Hello Threadless!",
    "visibility": "public",
    "is_promoted": false,
    "created_at": "2025-01-01T00:00:00.000Z",
    "promoted": false
  }
}
```

**Notes:**
- Admin posts are automatically promoted (`is_promoted: true`)
- Promoted posts appear at the top of feeds

---

### Get Post by ID

**Endpoint:** `GET /posts/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "post": {
    "id": 1,
    "user_id": 1,
    "content": "Hello Threadless!",
    "visibility": "public",
    "is_promoted": false,
    "created_at": "2025-01-01T00:00:00.000Z"
  }
}
```

**Access Control:**
- `private`: Only post author can view
- `connections`: Only connected users can view
- `public`: Anyone can view

**Error Responses:**
- `404` - Post not found
- `403` - Access denied

---

### Get My Posts

**Endpoint:** `GET /posts/my-posts`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "posts": [
    {
      "id": 1,
      "user_id": 1,
      "content": "Post 1",
      "visibility": "public",
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### Update Post

**Endpoint:** `PUT /posts/:id`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "string"
}
```

**Response:** `200 OK`
```json
{
  "message": "Post updated successfully"
}
```

**Access Control:**
- Only post author can update

**Error Responses:**
- `404` - Post not found
- `403` - Not post owner

---

### Delete Post

**Endpoint:** `DELETE /posts/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "message": "Post deleted successfully"
}
```

**Access Control:**
- Post author or admin can delete

---

## Connections

### Generate Connection Key

Create a unique key to share with others.

**Endpoint:** `POST /connections/generate-key`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `201 Created`
```json
{
  "message": "Connection key generated successfully",
  "connectionKey": "AABB-CC12-3456",
  "expiresIn": "24h",
  "instructions": "Share this key with someone to connect with them"
}
```

**Notes:**
- Keys are unique and formatted as `XXXX-XXXX-XXXX`
- Keys expire after 24 hours
- Single-use by design

---

### Connect with Key

Use a shared key to establish connection.

**Endpoint:** `POST /connections/connect`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "connectionKey": "AABB-CC12-3456"
}
```

**Response:** `200 OK`
```json
{
  "message": "Connected successfully",
  "connection": {
    "id": 1,
    "connectedWith": {
      "id": 2,
      "username": "bob",
      "trustScore": 30
    },
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Invalid key or self-connection attempt
- `404` - Key not found or expired

---

### Get My Connections

**Endpoint:** `GET /connections/my-connections`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "connections": [
    {
      "id": 1,
      "user": {
        "id": 2,
        "username": "bob",
        "trustScore": 30
      },
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### Check Connection Status

**Endpoint:** `GET /connections/check/:userId`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "connected": true
}
```

---

## Trust Score

### Get My Trust Score

**Endpoint:** `GET /trust/me`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "trustScore": 45,
  "badge": "Independent",
  "badgeEmoji": "💪",
  "breakdown": {
    "profileCompletion": "15/20",
    "postsActivity": "12/30",
    "interactionQuality": "8/30",
    "accountAge": "5/10",
    "connectionsCount": "5/10"
  }
}
```

**Badge Levels:**
- 0-20: Newcomer
- 21-40: Free Agent
- 41-60: Independent
- 61-80: Sovereign
- 81-100: Founder

---

### Get User Trust Score

**Endpoint:** `GET /trust/user/:userId`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": 2,
    "username": "bob"
  },
  "trustScore": 30,
  "badge": "Free Agent",
  "badgeEmoji": "🦅"
}
```

---

### Update My Trust Score

Recalculate trust score based on current activity.

**Endpoint:** `POST /trust/update`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "message": "Trust score updated successfully",
  "newScore": 47
}
```

---

### Recalculate All Trust Scores

Admin only. Recalculates all users' trust scores.

**Endpoint:** `POST /trust/recalculate-all`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "message": "All trust scores recalculated successfully"
}
```

**Access Control:**
- Admin only

---

## Comments

### Create Comment

**Endpoint:** `POST /comments`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "postId": 1,
  "content": "string"
}
```

**Response:** `201 Created`
```json
{
  "message": "Comment created successfully",
  "comment": {
    "id": 1,
    "post_id": 1,
    "user_id": 1,
    "content": "Great post!",
    "created_at": "2025-01-01T00:00:00.000Z"
  }
}
```

**Access Control:**
- Can only comment on accessible posts
- Must be connected for "connections" visibility posts

**Notes:**
- Post author's trust score increases when receiving comments

---

### Get Comments by Post

**Endpoint:** `GET /comments/post/:postId`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "comments": [
    {
      "id": 1,
      "post_id": 1,
      "user_id": 2,
      "content": "Great post!",
      "created_at": "2025-01-01T00:00:00.000Z",
      "user": {
        "id": 2,
        "username": "bob",
        "trustScore": 30
      }
    }
  ],
  "count": 1
}
```

---

### Delete Comment

**Endpoint:** `DELETE /comments/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "message": "Comment deleted successfully"
}
```

**Access Control:**
- Comment author or admin can delete

---

## Feed

### Get Personal Feed

Posts from connections, own posts, and promoted posts.

**Endpoint:** `GET /feed?limit=50&offset=0`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `limit`: Number of posts (default: 50)
- `offset`: Skip posts (default: 0)

**Response:** `200 OK`
```json
{
  "feed": [
    {
      "id": 1,
      "content": "Post content",
      "visibility": "public",
      "isPromoted": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "author": {
        "id": 1,
        "username": "alice",
        "trustScore": 100,
        "isAdmin": true
      },
      "commentsCount": 5
    }
  ],
  "count": 1,
  "limit": 50,
  "offset": 0,
  "hasMore": false
}
```

**Sorting:**
- Promoted posts first
- Then by creation date (newest first)

---

### Get Public Feed

Only public posts and promoted posts.

**Endpoint:** `GET /feed/public?limit=50&offset=0`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- Same as personal feed

**Response:** Same structure as personal feed

---

## Profile

### Get My Profile

**Endpoint:** `GET /profile/me`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "profile": {
    "id": 1,
    "username": "alice",
    "bio": "Building the decentralized web",
    "avatar": "https://example.com/avatar.jpg",
    "website": "https://alice.dev",
    "location": "Distributed",
    "trustScore": 45,
    "badge": "Independent",
    "badgeEmoji": "💪",
    "isAdmin": false,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### Get User Profile

**Endpoint:** `GET /profile/user/:userId`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** Same structure as my profile

---

### Update Profile

**Endpoint:** `PUT /profile/me`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "bio": "string",
  "avatar": "string (URL)",
  "website": "string (URL)",
  "location": "string"
}
```

**Notes:**
- All fields are optional
- Only provided fields are updated
- Trust score increases with profile completion

**Response:** `200 OK`
```json
{
  "message": "Profile updated successfully",
  "profile": {
    "bio": "Building the decentralized web",
    "avatar": "https://example.com/avatar.jpg",
    "website": "https://alice.dev",
    "location": "Distributed"
  }
}
```

---

## About

### Get Project Information

Public endpoint with project details, principles, roadmap, and contribution guidelines.

**Endpoint:** `GET /about`

**No authentication required**

**Response:** `200 OK`
```json
{
  "project": {
    "name": "Threadless",
    "tagline": "A quiet network of personal blogs",
    "version": "0.1.0 (MVP)",
    "description": "..."
  },
  "principles": [...],
  "features": {...},
  "roadmap": {...},
  "contribute": {...},
  "philosophy": {...},
  "contact": {...}
}
```

---

## Error Handling

All errors follow this format:

```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate username, etc)
- `500` - Internal Server Error

### Authentication Errors

All protected endpoints return `401 Unauthorized` if:
- No token provided
- Token is invalid
- Token is expired

**Example:**
```json
{
  "error": "Access token required"
}
```

---

## Rate Limiting

Currently not implemented in MVP.

Planned for production:
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## Pagination

Endpoints that support pagination:
- `/feed`
- `/feed/public`

**Parameters:**
- `limit`: Max items to return
- `offset`: Number of items to skip

**Response includes:**
- `hasMore`: Boolean indicating if more items exist

---

## Notes

- All timestamps are in ISO 8601 format
- All IDs are integers
- JWT tokens expire after 7 days (configurable)
- Database is SQLite (single file)
- No file uploads in MVP (URLs only for avatars)

---

For questions or issues, visit [GitHub Issues](https://github.com/GoCodeJones/Threadless/issues).