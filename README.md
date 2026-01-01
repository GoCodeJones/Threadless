# Threadless

> A quiet network of personal blogs

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

Threadless is a decentralized social network where each user owns their content and connections are made intentionally, not algorithmically.

## Key Features

- ** Key-Based Connections** - No friend requests. Share a key, make a connection.
- ** Libertarian Trust Score** - Build reputation through contribution, not approval.
- ** Visibility Control** - Every post: public, connections-only, or private.
- ** Connection-Based Comments** - Only connected users can engage.
- ** Personalized Feed** - See posts from your connections, not an algorithm.
- ** Self-Owned Profiles** - Your data, your rules.

## Core Principles

1. **Ownership over reach** - You own your content and identity
2. **Explicit trust over implicit discovery** - Intentional connections
3. **Simplicity over features** - Clear and usable
4. **Decentralization over convenience** - True independence

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/GoCodeJones/Threadless.git
cd Threadless

# Install dependencies
cd backend
npm install

# Setup environment
cp .env.example .env
# Edit .env with your settings

# Initialize database and create admin user
npm run seed

# Start development server
npm run dev
```

The API will be running at `http://localhost:3000`

## Documentation

- [API Documentation](./API.md) - Complete endpoint reference
- [Architecture Guide](./ARCHITECTURE.md) - System design and structure
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute

## API Overview

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

### Posts
- `POST /api/posts` - Create post
- `GET /api/posts/my-posts` - List your posts
- `GET /api/posts/:id` - Get post by ID
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Connections
- `POST /api/connections/generate-key` - Generate connection key
- `POST /api/connections/connect` - Connect using key
- `GET /api/connections/my-connections` - List connections

### Feed
- `GET /api/feed` - Personalized feed
- `GET /api/feed/public` - Public feed

[See full API documentation →](./API.md)

## Trust Score & Badges

Users earn trust score (0-100) based on activity:

- **Newcomer** (0-20) - Just starting
- **Free Agent** (21-40) - Building independence
- **Independent** (41-60) - Self-sufficient
- **Sovereign** (61-80) - Established member
- **Founder** (81-100) - Core pillar

**Components:**
- Profile completion (20 points)
- Posts activity (30 points)
- Interaction quality (30 points)
- Account age (10 points)
- Connections count (10 points)

## Technology Stack

- **Backend:** Node.js + TypeScript + Express
- **Database:** SQLite
- **Authentication:** JWT + bcrypt
- **API Style:** RESTful
- **Architecture:** MVC pattern

## Project Structure

```
Threadless/
├── backend/
│   ├── src/
│   │   ├── config/       # Database & configuration
│   │   ├── models/       # Data models
│   │   ├── controllers/  # Business logic
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth & validation
│   │   ├── services/     # Trust score, etc
│   │   ├── utils/        # Helpers
│   │   └── server.ts     # Entry point
│   ├── tests/            # Unit tests
│   └── data/             # SQLite database
├── docs/                 # Documentation
└── README.md
```

## Roadmap

### Completed (MVP)
- [x] Authentication system
- [x] User profiles & trust scoring
- [x] Posts with visibility controls
- [x] Key-based connections
- [x] Comments system
- [x] Personalized feeds

### Upcoming
- [ ] Frontend web interface
- [ ] Self-hosting capabilities
- [ ] Federation protocol
- [ ] Media attachments
- [ ] Encrypted DMs
- [ ] Mobile apps
- [ ] Custom domains

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

Ways to contribute:
- Code (features, bug fixes)
- Documentation
- Testing & bug reports
- Ideas & suggestions
- Spread the word

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built on principles of decentralization and user sovereignty
- Inspired by early web ideals of independence and ownership
- Community-driven and open-source

## Contact

- **Creator:** Jones
- **GitHub:** [@GoCodeJones](https://github.com/GoCodeJones)
- **Repository:** [Threadless](https://github.com/GoCodeJones/Threadless)
- **Issues:** [GitHub Issues](https://github.com/GoCodeJones/Threadless/issues)