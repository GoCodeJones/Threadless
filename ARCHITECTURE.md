# Threadless Architecture

Complete technical documentation of the Threadless system architecture.

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Architecture Patterns](#architecture-patterns)
- [Database Schema](#database-schema)
- [Authentication Flow](#authentication-flow)
- [Trust Score System](#trust-score-system)
- [Connection System](#connection-system)
- [Security Considerations](#security-considerations)
- [Performance Considerations](#performance-considerations)
- [Future Architecture](#future-architecture)

---

## Overview

Threadless is built as a RESTful API backend designed for decentralization and user sovereignty. The architecture emphasizes simplicity, security, and extensibility.

### Core Principles

1. **Stateless API** - JWT-based authentication, no server-side sessions
2. **Data Ownership** - Users own their data, stored locally
3. **Intentional Connections** - Key-based pairing, no algorithms
4. **Transparent Trust** - Open calculation, verifiable scores
5. **Minimal Dependencies** - Simple tech stack, easy to deploy

---

## Technology Stack

### Backend

- **Runtime:** Node.js 18+
- **Language:** TypeScript 5.7
- **Framework:** Express.js 4.x
- **Database:** SQLite 3.x
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Real-time:** Socket.io (prepared, not yet used)

### Development Tools

- **Build Tool:** TypeScript Compiler (tsc)
- **Dev Server:** Nodemon + ts-node
- **Package Manager:** npm

### Why These Choices?

**Node.js + TypeScript:**
- Strong typing for reliability
- Large ecosystem
- Easy to deploy
- Good performance for API workloads

**Express:**
- Minimal and flexible
- Well-documented
- Large community
- Easy to understand

**SQLite:**
- Single file database
- Zero configuration
- Perfect for self-hosting
- Easy to backup/migrate
- Good performance for MVP scale

**JWT:**
- Stateless authentication
- Easy to scale horizontally
- Works well with decentralized systems
- Standard and well-supported

---

## Project Structure

```
Threadless/
├── backend/
│   ├── src/
│   │   ├── config/           # Configuration and setup
│   │   │   ├── database.ts   # Database connection
│   │   │   ├── schema.ts     # Table definitions
│   │   │   └── seed.ts       # Initial data
│   │   │
│   │   ├── models/           # Data access layer
│   │   │   ├── User.ts       # User model
│   │   │   ├── Post.ts       # Post model
│   │   │   ├── Connection.ts # Connection model
│   │   │   ├── Comment.ts    # Comment model
│   │   │   └── index.ts      # Barrel exports
│   │   │
│   │   ├── controllers/      # Business logic
│   │   │   ├── authController.ts
│   │   │   ├── postController.ts
│   │   │   ├── connectionController.ts
│   │   │   ├── trustController.ts
│   │   │   ├── commentController.ts
│   │   │   ├── feedController.ts
│   │   │   ├── profileController.ts
│   │   │   └── aboutController.ts
│   │   │
│   │   ├── routes/           # API endpoints
│   │   │   ├── auth.routes.ts
│   │   │   ├── post.routes.ts
│   │   │   ├── connection.routes.ts
│   │   │   ├── trust.routes.ts
│   │   │   ├── comment.routes.ts
│   │   │   ├── feed.routes.ts
│   │   │   ├── profile.routes.ts
│   │   │   ├── about.routes.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── middleware/       # Request processing
│   │   │   └── auth.middleware.ts
│   │   │
│   │   ├── services/         # Business services
│   │   │   └── trustService.ts
│   │   │
│   │   ├── utils/            # Helper functions
│   │   │   └── passwordGenerator.ts
│   │   │
│   │   ├── types/            # TypeScript definitions
│   │   │   └── index.ts
│   │   │
│   │   └── server.ts         # Application entry point
│   │
│   ├── tests/                # Test files
│   ├── data/                 # SQLite database
│   │   └── threadless.db
│   ├── .env                  # Environment variables
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   └── nodemon.json
│
├── docs/                     # Additional documentation
├── README.md
├── API.md
├── CONTRIBUTING.md
├── ARCHITECTURE.md
└── LICENSE
```

---

## Architecture Patterns

### MVC Pattern

Threadless follows a modified MVC (Model-View-Controller) pattern:

**Models** - Data access and business logic
```typescript
class UserModel {
  async create(username, password): Promise<User>
  async findById(id): Promise<User>
  async updateTrustScore(userId, score): Promise<void>
}
```

**Controllers** - Request handling and response formatting
```typescript
class UserController {
  async register(req, res) {
    // Validate input
    // Call model methods
    // Format response
  }
}
```

**Routes** - Endpoint definitions and middleware
```typescript
router.post('/register', authController.register);
router.get('/me', authenticateToken, authController.me);
```

### Layered Architecture

```
┌─────────────────────────────────┐
│      Routes (HTTP Layer)        │
├─────────────────────────────────┤
│    Middleware (Auth, etc)       │
├─────────────────────────────────┤
│   Controllers (Business Logic)  │
├─────────────────────────────────┤
│   Services (Complex Operations) │
├─────────────────────────────────┤
│   Models (Data Access Layer)    │
├─────────────────────────────────┤
│   Database (SQLite)              │
└─────────────────────────────────┘
```

**Benefits:**
- Clear separation of concerns
- Easy to test individual layers
- Simple to understand and maintain
- Flexible for future changes

---

## Database Schema

### Entity Relationship Diagram

```
┌──────────────┐
│    users     │
├──────────────┤
│ id (PK)      │
│ username     │
│ password_hash│
│ trust_score  │
│ is_admin     │
│ profile_data │
│ created_at   │
└──────┬───────┘
       │
       │ 1:N
       │
┌──────▼───────┐      ┌──────────────┐
│    posts     │      │  connections │
├──────────────┤      ├──────────────┤
│ id (PK)      │      │ id (PK)      │
│ user_id (FK) │      │ user_id_1(FK)│
│ content      │      │ user_id_2(FK)│
│ visibility   │      │ conn_key     │
│ is_promoted  │      │ status       │
│ created_at   │      │ created_at   │
└──────┬───────┘      └──────────────┘
       │
       │ 1:N
       │
┌──────▼───────┐
│   comments   │
├──────────────┤
│ id (PK)      │
│ post_id (FK) │
│ user_id (FK) │
│ content      │
│ created_at   │
└──────────────┘
```

### Tables

**users**
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  master_password TEXT NOT NULL,
  trust_score INTEGER DEFAULT 0,
  is_admin BOOLEAN DEFAULT 0,
  profile_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**posts**
```sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  visibility TEXT DEFAULT 'connections',
  is_promoted BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**connections**
```sql
CREATE TABLE connections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id_1 INTEGER NOT NULL,
  user_id_2 INTEGER NOT NULL,
  connection_key TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id_1) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id_2) REFERENCES users(id) ON DELETE CASCADE
);
```

**comments**
```sql
CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Indexes

```sql
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_connections_users ON connections(user_id_1, user_id_2);
CREATE INDEX idx_comments_post_id ON comments(post_id);
```

---

## Authentication Flow

### Registration Flow

```
1. User submits username + password
2. Validate credentials (length, uniqueness)
3. Generate 16-char master password
4. Hash password with bcrypt (10 rounds)
5. Create user in database
6. Generate JWT token (7-day expiry)
7. Return user data + token + master password
```

### Login Flow

```
1. User submits username + password
2. Find user by username
3. Compare password hash with bcrypt
4. Generate new JWT token
5. Return user data + token
```

### Protected Route Access

```
1. Client sends request with Authorization header
2. Middleware extracts JWT token
3. Verify token signature and expiry
4. Decode user ID from token
5. Attach user info to request object
6. Pass control to route handler
```

### JWT Token Structure

```typescript
{
  id: 1,
  username: "alice",
  isAdmin: false,
  iat: 1234567890,  // issued at
  exp: 1235172690   // expires at (7 days later)
}
```

---

## Trust Score System

### Calculation Algorithm

```typescript
trustScore = 
  profileCompletion (0-20) +
  postsActivity (0-30) +
  interactionQuality (0-30) +
  accountAge (0-10) +
  connectionsCount (0-10)
```

### Components Breakdown

**1. Profile Completion (max 20)**
```
- Username exists: 10 points
- Bio filled: +5 points
- Avatar set: +5 points
```

**2. Posts Activity (max 30)**
```
- 1 point per post
- Capped at 30 posts
```

**3. Interaction Quality (max 30)**
```
- Based on comments received
- 1 point per comment
- Capped at 30 comments
```

**4. Account Age (max 10)**
```
- 1 point per month
- Capped at 10 months
```

**5. Connections Count (max 10)**
```
- 1 point per connection
- Capped at 10 connections
```

### Badge Assignment

```typescript
function getBadge(score: number): Badge {
  if (score >= 81) return 'Founder';
  if (score >= 61) return 'Sovereign';
  if (score >= 41) return 'Independent';
  if (score >= 21) return 'Free Agent';
  return 'Newcomer';
}
```

### Admin Override

Admin users (`is_admin = 1`) always have:
- Trust score: 100
- Badge: Founder
- Posts: automatically promoted

---

## Connection System

### Key Generation

```typescript
function generateConnectionKey(): string {
  const key = crypto.randomBytes(6).toString('hex').toUpperCase();
  return `${key.slice(0,4)}-${key.slice(4,8)}-${key.slice(8,12)}`;
}
// Result: "AABB-CC12-3456"
```

### Connection Flow

```
1. User A generates connection key
2. Key stored with user_id_1 = A, user_id_2 = 0, status = 'pending'
3. User A shares key with User B
4. User B submits key
5. System validates:
   - Key exists
   - Key is pending
   - User B ≠ User A (no self-connection)
6. Update: user_id_2 = B, status = 'active'
7. Both users now see each other in connections
```

### Connection States

- **pending** - Key generated, not yet used
- **active** - Connection established
- **rejected** - (Future) Connection declined

---

## Security Considerations

### Authentication Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with 7-day expiry
- Tokens signed with secret key
- No password stored in plain text
- Master password for recovery (stored plain, user responsibility)

### API Security

- All protected endpoints require valid JWT
- Authorization header: `Bearer {token}`
- Token validation on every request
- User ID extracted from token (not URL)
- Admin-only routes have additional checks

### Input Validation

- Username uniqueness enforced
- Password minimum length (6 chars)
- Content cannot be empty
- Visibility must be valid enum
- Connection keys format validated

### SQL Injection Prevention

- Parameterized queries
- SQLite binding
- No string concatenation in queries

**Example:**
```typescript
// Safe
await db.get('SELECT * FROM users WHERE id = ?', [userId]);

// Unsafe (never do this)
await db.get(`SELECT * FROM users WHERE id = ${userId}`);
```

### XSS Prevention

- Content stored as-is (no HTML parsing backend)
- Frontend responsibility to sanitize
- No eval() or dangerous functions

### CORS Configuration

```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
```

---

## Performance Considerations

### Database Optimization

**Indexes:**
- Posts by user_id
- Connections by user pairs
- Comments by post_id

**Query Optimization:**
- Use JOINs for related data
- Limit results with LIMIT clause
- Pagination with OFFSET

**Connection Pooling:**
- Single SQLite connection
- Async operations
- Non-blocking I/O

### API Performance

**Caching Opportunities:**
- Trust scores (recalculate on demand)
- User profiles
- Public feeds

**Pagination:**
- Default limit: 50 items
- Offset-based pagination
- `hasMore` flag for clients

**Response Size:**
- Return only necessary fields
- Avoid deep nesting
- Use efficient JSON serialization

### Scalability Considerations

**Current MVP Scale:**
- Single SQLite file
- Single server instance
- Good for 100-1000 users

**Future Scaling:**
- Move to PostgreSQL
- Add Redis for caching
- Horizontal scaling with load balancer
- CDN for static assets

---

## Future Architecture

### Decentralization Roadmap

**Phase 1: Self-Hosting (Current MVP)**
- Users run own instances
- SQLite local database
- Manual data export/import

**Phase 2: Federation**
- ActivityPub protocol
- Cross-instance connections
- Distributed content discovery
- Instance-to-instance communication

**Phase 3: P2P Network**
- IPFS for content storage
- Blockchain for identity
- Direct peer connections
- No central servers

### Planned Improvements

**Backend:**
- GraphQL API option
- WebSocket for real-time
- Background job processing
- Automated backups
- Metrics and monitoring

**Database:**
- Migration to PostgreSQL option
- Multi-database support
- Replication
- Sharding strategy

**Security:**
- Rate limiting
- 2FA support
- OAuth providers
- End-to-end encryption for DMs

**Features:**
- Media uploads (images, files)
- Rich text formatting
- Mentions and notifications
- Direct messages
- Groups/communities

---

## Development Philosophy

### Keep It Simple

- Prefer clarity over cleverness
- Choose boring technology
- Avoid premature optimization
- Write obvious code

### Prioritize Users

- User owns data
- Privacy by default
- Transparent operations
- No dark patterns

### Build for Decentralization

- Stateless design
- Portable data formats
- Open protocols
- No vendor lock-in

### Maintain Quality

- Type-safe code
- Clear documentation
- Consistent patterns
- Regular refactoring

---

## Deployment Architecture

### Current Deployment (MVP)

```
┌──────────────────┐
│   Node.js API    │
│   (Express)      │
├──────────────────┤
│   SQLite DB      │
│   (Single file)  │
└──────────────────┘
```

### Production Architecture (Future)

```
┌────────────┐
│ Load       │
│ Balancer   │
└─────┬──────┘
      │
      ├──────────────┬──────────────┐
      │              │              │
┌─────▼──────┐ ┌────▼─────┐ ┌─────▼──────┐
│  API       │ │  API     │ │  API       │
│  Instance  │ │  Instance│ │  Instance  │
└─────┬──────┘ └────┬─────┘ └─────┬──────┘
      │              │              │
      └──────────────┴──────────────┘
                     │
              ┌──────▼──────┐
              │ PostgreSQL  │
              │   Cluster   │
              └─────────────┘
```

---

For questions about architecture decisions, open a discussion on GitHub.