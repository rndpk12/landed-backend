# Landed API

Spring Boot 3 / Java 21 backend for Landed, a multi-user job application tracker.

## Included

- Registration and login with BCrypt password hashing and signed JWT bearer tokens
- Current-user profile endpoint
- User-scoped application create, list, update, and delete operations
- Jakarta validation and consistent JSON error responses
- PostgreSQL persistence with Flyway migrations and Hibernate schema validation
- OpenAPI 3 / Swagger UI, Actuator health checks, Docker, and Docker Compose
- Stateless Spring Security, configurable CORS, and tenant ownership checks

## Run with Docker

Create the environment file and replace the generated values:

```bash
cp .env.example .env
openssl rand -base64 64
# Paste the generated secret into JWT_SECRET in .env
docker compose up --build
```

The API runs at `http://localhost:8080`. Swagger UI is available at
`http://localhost:8080/swagger-ui.html` and health at `http://localhost:8080/actuator/health`.

## Run locally

Requirements: Java 21, Maven 3.9+, and PostgreSQL.

```bash
export DB_URL=jdbc:postgresql://localhost:5432/landed
export DB_USERNAME=landed
export DB_PASSWORD=your-password
export JWT_SECRET="$(openssl rand -base64 64)"
export GOOGLE_CLIENT_ID=your-google-oauth-web-client-id
mvn spring-boot:run
```

`JWT_SECRET` is intentionally required. It must be Base64-encoded and decode to at least 32 bytes.
Use the same Google OAuth web client ID for backend `GOOGLE_CLIENT_ID` and frontend
`VITE_GOOGLE_CLIENT_ID` so Google sign-in can launch and the backend can verify the credential.

## API

All authenticated endpoints require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Create an account and return a token |
| POST | `/api/v1/auth/login` | Authenticate and return a token |
| GET | `/api/v1/users/me` | Get the current profile |
| POST | `/api/v1/applications` | Create an application |
| GET | `/api/v1/applications` | List the current user's applications |
| PUT | `/api/v1/applications/{id}` | Fully update an owned application |
| DELETE | `/api/v1/applications/{id}` | Delete an owned application |

Example registration:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "a-strong-password"
}
```

Example application request:

```json
{
  "company": "Acme",
  "role": "Backend Engineer",
  "jobUrl": "https://example.com/jobs/123",
  "status": "APPLIED",
  "notes": "Referred by Sam",
  "appliedDate": "2026-06-22"
}
```

Statuses: `SAVED`, `APPLIED`, `OA`, `INTERVIEW`, `OFFER`, `REJECTED`, `ACCEPTED`.

## Configuration

| Variable | Required | Default |
|---|---:|---|
| `JWT_SECRET` | yes | none |
| `GOOGLE_CLIENT_ID` | for Google sign-in | none |
| `JWT_EXPIRATION` | no | `86400000` ms |
| `DB_URL` | no | `jdbc:postgresql://localhost:5432/landed` |
| `DB_USERNAME` | no | `landed` |
| `DB_PASSWORD` | no | `landed-local-password` |
| `CORS_ALLOWED_ORIGINS` | no | `http://localhost:3000` |
| `DB_POOL_SIZE` | no | `10` |

Use separate, securely managed secrets in production. TLS should terminate at the ingress or load balancer.

## Verify

```bash
mvn test
mvn package
```

## Structure

```text
src/main/java/com/landed
├── application/   # application domain, DTOs, repository, service, controller
├── auth/          # registration/login workflow and DTOs
├── common/        # shared error response and global exception handling
├── config/        # Spring Security, CORS, and OpenAPI configuration
├── security/      # JWT service/filter and authentication handlers
└── user/          # user domain, profile DTO, repository, service, controller
```
