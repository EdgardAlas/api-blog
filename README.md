# Blog API

A comprehensive blog API built with NestJS, PostgreSQL, and Drizzle ORM, featuring JWT authentication, internationalization, and a modular architecture.

## Features

- [x] JWT Authentication
- [x] Author CRUD
- [x] Language CRUD
- [x] Database with Drizzle ORM
- [x] Internationalization
- [x] Role-based access
- [x] Request validation
- [x] Search and pagination
- [ ] Post management
- [ ] Tag management
- [ ] Media uploads
- [ ] User registration

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

- `GET /languages` - List languages with pagination, search, and post counts
- `GET /languages/:id` - Get language by ID with post count
- `POST /languages` - Create new language
- `PATCH /languages/:id` - Update language
- `DELETE /languages/:id` - Delete language

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
