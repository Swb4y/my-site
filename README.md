# My Site

Modern and flexible static web template with dynamic server features (Express, EJS, Contact Backend, SEO, Logging, Docker Compose, and CI).

## Features
- Server-side rendering with EJS templates
- Contact form backend with email sending via Nodemailer
- SEO-friendly meta tags
- Custom 404 and 500 error pages
- Logging with Morgan and Winston
- ESLint linting and GitHub Actions CI
- Dockerfile and Docker Compose for easy deployment

## Requirements
- Node.js >= 14
- Docker & Docker Compose (optional)

## Setup
1. Install dependencies
   ```bash
   npm install
   ```
2. Create `.env` file based on `.env.example` and fill in values
   ```bash
   cp .env.example .env
   ```
3. Run the application
   ```bash
   npm start
   ```
   Or in development mode (with nodemon):
   ```bash
   npm run dev
   ```
4. Access at `http://localhost:3000`

## Docker
Build and run with Docker Compose:
```bash
docker-compose up --build
```

## Linting
```bash
npm run lint
```

## CI
GitHub Actions runs linting on each push and pull request.