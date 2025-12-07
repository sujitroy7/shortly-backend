# AI Context

This document provides high-level context for AI agents working on the `shortly` codebase.

## Project Overview
`shortly` is a URL shortening service. It is built to be scalable and performant.

## Tech Stack
- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (using `pg` driver)
- **Cache**: Redis
- **Package Manager**: pnpm

## Architecture
- **Entry Point**: `src/server.ts` starts the server; `src/app.ts` configures Express.
- **Configuration**: Managed in `src/config/config.ts` using `dotenv`.
- **Database**: Raw SQL queries are currently used (see `src/db/init.sql`).
- **folder Structure**:
    - `src/controllers`: Logic for handling requests.
    - `src/routes`: Route definitions mapping URLs to controllers.
    - `src/models`: Data interfaces and database interaction logic.
    - `src/middlewares`: Custom Express middlewares (auth, error handling, etc.).

## Key Conventions
- **Naming**: camelCase for variables/functions, PascalCase for classes/interfaces.
- **Async/Await**: Preferred over callbacks/promises.
- **Type Safety**: strict TypeScript configuration should be adhered to.
- **Error Handling**: Use the global error handler in `src/app.ts` (to be implemented).

## Database Schema Summary
- **users**: `id`, `email`, `created_at`
- **urls**: `id`, `user_id`, `slug`, `destination_url`, `created_at`
- **clicks**: `id`, `url_id`, `ip_address`, `user_agent`, `referrer`

## Current Status
- The project skeleton exists.
- Basic server setup (`server.ts`, `app.ts`) is functional.
- Routes and Controllers are currently empty/stubs.
