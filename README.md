# E-Commerce Customer Management Frontend

Micro-frontend for customer management using Angular and Module Federation.

## Features

- Customer CRUD Operations
- Customer Search & Filtering
- Address Management
- Customer Profile Management
- Responsive Design with Tailwind CSS
- State Management with NgRx
- Integration with Customer Management API

## Development

```bash
# Install dependencies
npm install

# Start development server (Module Federation)
npm start

# Build for production
npm run build
```

## Module Federation

This module exposes:
- `./Module` - Customer management routes and components

Runs on: http://localhost:4201

## API Integration

Connects to Customer Management Backend API:
- GET /api/v1/customers
- POST /api/v1/customers
- PUT /api/v1/customers/{id}
- DELETE /api/v1/customers/{id}
