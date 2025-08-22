# Price Point Scout 🔍

[![Docker Deployment](https://github.com/OmarZakaria10/PricePointScout/actions/workflows/nodetest.yml/badge.svg)](https://github.com/OmarZakaria10/PricePointScout/actions/workflows/nodetest.yml)

A scalable e-commerce price comparison tool that helps users find the best deals across multiple platforms. Built with Node.js and modern cloud-native architecture.

## 📋 Features

### Core Functionality
- Real-time price comparison across multiple e-commerce platforms
- User authentication and authorization
- Price history tracking
- Search optimization with Redis caching
- RESTful API architecture

### User Management
- Secure user registration and authentication
- Role-based access control (Admin/User)
- Password reset functionality
- Profile management
- Session handling with JWT

### Search & Caching
- Fast product search functionality
- Redis-based caching system
- Configurable cache duration
- Bulk operation support
- Source-specific result handling

## 🚀 Getting Started

### Prerequisites
- Node.js >= 14.x
- MongoDB >= 4.4
- Redis >= 6.0
- Docker & Docker Compose (for containerized deployment)
- npm or yarn package manager

### Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/PricePointScout.git
cd PricePointScout
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configurations
```

4. Start development server:
```bash
npm run dev
```

### Docker Development Environment

```bash
# Start all services
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop all services
docker-compose -f docker-compose.dev.yml down
```

## 🔧 Configuration

### Environment Variables

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DATABASE=mongodb://localhost:27017/PricePointScout
REDIS_HOST=localhost
REDIS_PORT=6379

# Authentication
JWT_SECRET=your-secure-secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# Cache Configuration
CACHE_DURATION=600
MAX_CACHE_LIFETIME=3600
```

## 📚 API Documentation

### Authentication Endpoints

```
POST /users/signup - Register new user
POST /users/login - User login
POST /users/logout - User logout
POST /users/forgotPassword - Request password reset
PATCH /users/resetPassword/:token - Reset password
```

### User Management Endpoints

```
PATCH /users/updateMyPassword - Update password
GET /users/me - Get user profile
PATCH /users/updateMe - Update user data
DELETE /users/deleteMe - Deactivate account
```

### Admin Endpoints

```
GET /users - Get all users (Admin only)
POST /users - Create user (Admin only)
GET /users/:id - Get specific user (Admin only)
PATCH /users/:id - Update user (Admin only)
DELETE /users/:id - Delete user (Admin only)
```

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT-based authentication
- HTTP-only cookies
- Password reset tokens
- Request rate limiting
- CORS protection
- XSS prevention
- Parameter pollution protection

## 🔧 DevOps Features

### CI/CD Pipeline (GitHub Actions)
- Automated testing
- Docker image building
- Security scanning
- Automated deployments
- Infrastructure validation

### Containerization
- Multi-stage Docker builds
- Development and production configs
- Resource management
- Health monitoring

### Kubernetes Deployment
- Namespace isolation
- Secrets management
- StatefulSets for databases
- Auto-scaling
- Load balancing

## 📈 Scaling Guidelines

### Performance Optimization
- Redis caching layer
- Database indexing
- Query optimization
- Connection pooling
- Load balancing

### High Availability
- Container orchestration
- Database replication
- Cache distribution
- Health monitoring
- Auto-recovery

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Omar Zakaria** - *Initial work*

## 🙏 Acknowledgments

- Node.js community
- MongoDB team
- Redis developers
- All contributors