# Budgeify — Security Notes

## Authentication
- Clerk handles auth (session tokens, user management)
- Middleware protects all routes except public pages
- Server Actions verify userId before DB operations

## Data Protection
- All DB queries scoped to authenticated userId
- No sensitive data in client-side stores
- Environment variables never exposed to client (non-NEXT_PUBLIC_ prefix)

## Headers (Planned — Sprint 4)
- Content-Security-Policy
- Strict-Transport-Security
- X-Content-Type-Options
- X-Frame-Options

## Logging
- Production suppresses debug/info logs
- Error logs include context but never sensitive data
- No PII in log output
