# ADR-002: Authentication Strategy

## Status
Accepted

## Date
2024-12-10

## Context
The Physical AI textbook platform needs user authentication for:
- Tracking user progress and personalization
- Storing user background for customized responses
- Maintaining conversation history
- Rate limiting and analytics

## Decision
We chose to implement **JWT-based authentication** with the following approach:

### Authentication Method: JWT (JSON Web Tokens)
- **Rationale**: Stateless, scalable, works well with REST APIs
- **Alternative Considered**: Session-based (requires session storage), OAuth only (over-engineered for this use case)

### Password Handling: bcrypt via passlib
- **Rationale**: Industry standard, configurable work factor, battle-tested
- **Alternative Considered**: Argon2 (newer but less common), SHA256 (not suitable for passwords)

### Token Management
- Access tokens: 30 minutes expiry
- Refresh tokens: 7 days expiry (stored in HTTP-only cookies)

### User Storage: PostgreSQL (Neon)
- **Rationale**: Relational data model fits user profiles, Neon provides serverless scaling
- **Alternative Considered**: MongoDB (less suited for relational data), Firebase (vendor lock-in)

## Consequences

### Positive
- Stateless authentication scales horizontally
- JWT allows embedding user claims (role, preferences)
- Works seamlessly with frontend frameworks
- Neon's serverless model reduces costs for variable traffic

### Negative
- Token revocation requires additional mechanism (blacklist)
- JWT payload increases request size
- Need secure secret management

### Security Measures
- HTTPS only in production
- Secure, HTTP-only cookies for refresh tokens
- CORS restrictions for API endpoints
- Rate limiting on auth endpoints

## Implementation Notes
- Store hashed passwords only, never plaintext
- Include user_id and role in JWT claims
- Implement token refresh before expiry
- Log authentication events for security audit
