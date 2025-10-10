# Blog API

A comprehensive blog API built with NestJS, PostgreSQL, and Drizzle ORM, featuring JWT authentication, internationalization, and a modular architecture.

## Features

- [x] JWT Authentication
- [x] Author CRUD
- [x] Language CRUD
- [x] Tag CRUD with multilingual support
- [x] Database with Drizzle ORM
- [x] Internationalization
- [x] Role-based access
- [x] Request validation
- [x] Search and pagination
- [x] User management CRUD
- [ ] Post management
- [ ] Media uploads

## API Endpoints

### Authentication

- `POST /auth/login` - User authentication
- `POST /auth/refresh` - Refresh access token

### Authors (Admin only)

- `GET /authors` - List authors with pagination and search
- `GET /authors/:id` - Get author by ID
- `POST /authors` - Create new author
- `PATCH /authors/:id` - Update author
- `DELETE /authors/:id` - Delete author

### Languages (Admin only)

- `GET /languages` - List languages with pagination and search
- `GET /languages/:id` - Get language by ID
- `POST /languages` - Create new language
- `PATCH /languages/:id` - Update language
- `DELETE /languages/:id` - Delete language

### Tags (Admin only)

- `GET /tags` - List tags with pagination and search
- `GET /tags/:id` - Get tag by ID
- `POST /tags` - Create new tag
- `PATCH /tags/:id` - Update tag
- `DELETE /tags/:id` - Delete tag

### Users (Admin only)

- `GET /users` - List users with pagination and search
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Health

- `GET /health` - Application health check

## Project Setup

```bash
$ pnpm install
```

## Running the Application

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## License

This project is MIT licensed.
