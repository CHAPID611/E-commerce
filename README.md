# E-commerce GraphQL API Gateway

A GraphQL API Gateway for an E-commerce application using Apollo Server with Express. This project provides a unified interface for product and order management, with user authentication via JWT tokens.
Una Pasarela de API GraphQL para una aplicación de E-commerce utilizando Apollo Server con Express. Este proyecto proporciona una interfaz unificada para la gestión de productos y órdenes, con autenticación de usuarios mediante tokens JWT.

## Project Overview

This API Gateway serves as the central entry point for an E-commerce application, handling:

- Product management (listing, creation, updates, deletion)
- Order processing (creation, status updates, cancellation)
- User authentication via JWT tokens

The application is built with TypeScript, Apollo Server, Express, and PostgreSQL with Sequelize ORM.

## Tech Stack

- **Backend Framework**: Node.js with Express
- **GraphQL Server**: Apollo Server
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT Token validation
- **Runtime Environment**: Docker & Docker Compose
- **Language**: TypeScript

## Prerequisites

- Node.js 14+
- Docker and Docker Compose (for containerized setup)
- PostgreSQL (if running without Docker)

## Setup Instructions

### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd E-commerce
   ```

2. Create an environment file:
   ```bash
   cp .env.example .env
   ```

3. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

4. The GraphQL server will be available at http://localhost:4000/graphql

### Local Development Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd E-commerce
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your local database settings.

4. Compile TypeScript:
   ```bash
   npm run compile
   ```

5. Start the server:
   ```bash
   npm start
   ```

6. For development with auto-reload:
   ```bash
   npm run dev
   ```

## GraphQL API Documentation

### Available Queries

```graphql
# Get all products
query GetProducts {
  products {
    id
    name
    price
    username
  }
}

# Get product by ID
query GetProduct($id: ID!) {
  product(id: $id) {
    id
    name
    price
    username
  }
}

# Get all orders (requires authentication)
query GetOrders {
  orders {
    id
    username
    totalAmount
    status
    products {
      product {
        name
        price
      }
      quantity
    }
  }
}

# Get current user's orders (requires authentication)
query GetMyOrders {
  myOrders {
    id
    totalAmount
    status
    products {
      product {
        name
        price
      }
      quantity
    }
  }
}
```

### Available Mutations

```graphql
# Create a new product (requires authentication)
mutation CreateProduct($input: ProductInput!) {
  createProduct(input: $input) {
    id
    name
    price
  }
}

# Update a product (requires authentication)
mutation UpdateProduct($id: ID!, $input: ProductInput!) {
  updateProduct(id: $id, input: $input) {
    id
    name
    price
  }
}

# Delete a product (requires authentication)
mutation DeleteProduct($id: ID!) {

# E-commerce API Gateway

This project implements an API Gateway for an E-commerce application using Apollo GraphQL with Express. It provides a unified interface for product and order management, with integration for user authentication via JWT.

## Architecture

The application is built with the following components:

- **API Gateway**: Apollo GraphQL server with Express
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT validation middleware
- **Containerization**: Docker and Docker Compose

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [Docker](https://www.docker.com/products/docker-desktop/) and [Docker Compose](https://docs.docker.com/compose/install/)
- [PostgreSQL](https://www.postgresql.org/) (if running locally without Docker)

## Installation

### Clone the Repository

```bash
git clone <repository-url>
cd E-commerce
```

### Set Up Environment Variables

Copy the example environment file and adjust the values as needed:

```bash
cp .env.example .env
```

### Installation Options

#### Option 1: Using Docker (Recommended)

Build and start the containers:

```bash
docker-compose up -d
```

This will set up:
- Apollo GraphQL API on port 4000
- PostgreSQL database on port 5432
- PGAdmin web interface on port 5050

#### Option 2: Local Installation

Install dependencies:

```bash
npm install
```

Compile TypeScript:

```bash
npm run compile
```

Start the server:

```bash
npm start
```

## Development

### Running in Development Mode

```bash
# With Docker
docker-compose up

# Without Docker
npm run dev
```

### Accessing the GraphQL Playground

Once the server is running, you can access the GraphQL Playground at:

```
http://localhost:4000/graphql
```

### Database Management

You can manage the PostgreSQL database using PGAdmin at:

```
http://localhost:5050
```

Use the email and password from your environment variables to log in.

## Available GraphQL Operations

### Queries

```graphql
# Get all products
query GetProducts {
  products {
    id
    name
    price
    username
  }
}

# Get product by ID
query GetProduct($id: ID!) {
  product(id: $id) {
    id
    name
    price
    username
  }
}

# Get all orders (requires authentication)
query GetOrders {
  orders {
    id
    username
    totalAmount
    status
    products {
      product {
        name
        price
      }
      quantity
    }
  }
}

# Get user's orders (requires authentication)
query GetMyOrders {
  myOrders {
    id
    totalAmount
    status
    products {
      product {
        name
        price
      }
      quantity
    }
  }
}
```

### Mutations

```graphql
# Create product (requires authentication)
mutation CreateProduct($input: ProductInput!) {
  createProduct(input: $input) {
    id
    name
    price
    username
  }
}

# Create order (requires authentication)
mutation CreateOrder($input: OrderInput!) {
  createOrder(input: $input) {
    id
    totalAmount
    status
    products {
      product {
        name
      }
      quantity
      price
    }
  }
}

# Update order status (requires authentication)
mutation UpdateOrderStatus($id: ID!, $status: String!) {
  updateOrderStatus(id: $id, status: $status) {
    id
    status
  }
}
```

## Authentication

Authentication is handled via JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

The API Gateway validates the token and extracts the username to identify the current user.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 4000 |
| NODE_ENV | Environment (development/production) | development |
| DB_HOST | PostgreSQL host | localhost |
| DB_PORT | PostgreSQL port | 5432 |
| DB_NAME | Database name | ecommerce |
| DB_USER | Database username | postgres |
| DB_PASSWORD | Database password | postgres |
| PGADMIN_EMAIL | PGAdmin login email | admin@example.com |
| PGADMIN_PASSWORD | PGAdmin password | admin |
| JWT_SECRET | Secret for JWT validation | your_jwt_secret_key |
| JWT_EXPIRES_IN | JWT expiration period | 1d |

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# E-commerce
