# QA Shop API Automation — Playwright + TypeScript

This starter adds reusable API automation for Auth and Products. It is designed to be copied into an existing Playwright TypeScript framework; merge the files rather than overwriting your existing configuration.

## 1. Install

```bash
npm install -D @playwright/test typescript dotenv
npx playwright install
```

## 2. Environment

Copy `.env.QA.example` to `.env.QA`, then fill in your sandbox API key. Do not commit real keys.

```bash
ENV=QA npx playwright test tests/api
```

The API base URL is expected to be `http://localhost:4000` and the API version `/api/v1`. The `X-Sandbox-Key` header is applied to API calls by Playwright's request fixture.

## 3. Included coverage

- Auth: registration, successful login, invalid credentials, authenticated profile, logout/session revocation.
- Products: list and response shape, pagination consistency, cross-page duplicate check, dynamic product ID lookup, unknown ID, category and price filters, ascending price sort, text search.
- Reusable typed API client with generics and `unknown` error handling.

## 4. Contract assumptions to verify

The following may vary depending on the exact local OpenAPI schema:
- Registration payload uses `{ name, email, password }`.
- Registration success status is `201`.
- Login returns one of `accessToken`, `access_token`, or `token`.
- An invalid product ID returns `404`.
- A revoked session returns `401` from `/auth/me`.

If your API contract specifies different fields/statuses, update the relevant type/assertion rather than weakening the test.

## 5. Safety and test data

- Keep `.env.QA` out of Git.
- Tests use the seeded demo user for login tests and generate a unique email for registration.
- Do not run destructive sandbox reset operations as part of this test suite.
