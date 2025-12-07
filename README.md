# Shortly

A powerful and scalable URL shortening service built with Node.js, Express, TypeScript, PostgreSQL, and Redis.

> [!NOTE]
> This project is currently under active development. Some features described below may be in progress.

## Features

- **URL Shortening**: Convert long URLs into compact, sharable links.
- **Analytics**: Track clicks, geographic location, user agents, and referral sources.
- **Custom Aliases**: Create personalized short links (e.g., `short.ly/my-link`).
- **High Performance**: Caching with Redis for fast redirection.
- **Scalable**: Built to handle high traffic loads.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (Primary), Redis (Cache/Queue)
- **Containerization**: Docker (Optional)

## Prerequisites

- Node.js (v18 or higher)
- pnpm (or npm/yarn)
- PostgreSQL
- Redis

## Getting Started

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd shortly
    ```

2.  **Install dependencies**
    ```bash
    pnpm install
    ```

3.  **Environment Setup**
    Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
    Update `.env` with your database credentials and other configuration.

4.  **Database Setup**
    Ensure PostgreSQL and Redis are running. You can initialize the database schema using the provided SQL script:
    ```bash
    psql -U <username> -d <dbname> -f src/db/init.sql
    ```

5.  **Run the application**
    
    Development mode:
    ```bash
    npm run dev
    ```

    Production build:
    ```bash
    npm run build
    npm start
    ```

## Project Structure

```
shortly/
├── src/
│   ├── config/         # Configuration and environment variables
│   ├── controllers/    # Request handlers
│   ├── db/             # Database connection and initialization
│   ├── middlewares/    # Express middlewares
│   ├── models/         # Database models/schemas
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   ├── app.ts          # Express app setup
│   └── server.ts       # Server entry point
├── dist/               # Compiled JavaScript
├── .env.example        # Environment variable template
├── package.json        # Dependencies and scripts
└── README.md           # Project documentation
```
