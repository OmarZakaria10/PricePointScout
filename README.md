# Price Point Scout

[![Docker Deployment](https://github.com/OmarZakaria10/PricePointScout/blob/main/.github/workflows/nodetest.yml/badge.svg)](https://github.com/OmarZakaria10/PricePointScout/blob/main/.github/workflows/nodetest.yml)

A powerful e-commerce price comparison tool that scrapes multiple Egyptian online stores to help users find the best deals.

## Features

- **Multi-Store Scraping**: Simultaneously scrapes prices from:
  - Amazon.eg
  - Jumia
  - Sigma Computer
  - CompuMart
  - El Badr Store
  
- **Advanced Search Options**:
  - Price range filtering
  - Sort results by price (ascending/descending)
  - Multiple store selection

- **User Management**:
  - User registration and authentication
  - Search history tracking
  - Password reset functionality
  
- **Performance Optimization**:
  - Redis caching for faster repeated searches
  - Rate limiting and request optimization
  - Parallel scraping execution

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Caching**: Redis
- **Web Scraping**: Puppeteer
- **Authentication**: JWT
- **Infrastructure**:
  - Docker & Docker Compose
  - Kubernetes
  - Terraform
  - Ansible

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Redis
- Docker and Docker Compose (for containerized deployment)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/YourUsername/PricePointScout.git
cd PricePointScout
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp example.config.env config.env
```
Edit `config.env` with your configuration values.

## Running the Application

### Local Development
```bash
npm run dev
```

### Production with Docker Compose
```bash
docker-compose up -d
```

### Kubernetes Deployment
```bash
cd k8s
kubectl apply -f namespace.yaml
kubectl apply -f configMap.yaml
kubectl apply -f secret.yaml
kubectl apply -f mongo-deployment.yaml
kubectl apply -f redis-deployment.yaml
kubectl apply -f pricePointScout-deployment.yaml
```

## API Endpoints

### Authentication
- `POST /users/signup` - Register new user
- `POST /users/login` - User login
- `POST /users/forgotPassword` - Request password reset
- `PATCH /users/resetPassword/:token` - Reset password

### Scraping
- `GET /scrape/guest` - Public scraping endpoint
- `GET /scrape/user` - Authenticated user scraping endpoint

### Search History
- `GET /search/mySearches` - Get user's search history
- `GET /search/getSearch/:id` - Get specific search details
- `DELETE /search/deleteSearch/:id` - Delete search history entry

## Configuration

The application can be configured using environment variables:

```env
NODE_ENV=production
DATABASE=mongodb://localhost:27017/PricePointScout
PORT=8080
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=90d
```

## Infrastructure

### Terraform
- Single server AWS deployment configuration in `terraform-singleServer/`
- Manages security groups and EC2 instances

### Ansible
- Automated deployment playbooks in `ansible/`
- Handles Docker installation and application deployment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.