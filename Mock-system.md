# Mock system

The mocks answer the API operations from local data, when the web app starts with `pnpm web mock` (http://localhost:4333) or the mobile app starts with `pnpm mobile mock`. Each row is one mock. To remove a mock when its real endpoint is ready, delete its row and its entry in the data files.

Status values: `mocked` (answered by the mock), `not mocked` (no mock, the request goes to the API or the app reports it).

| ID | App | Transport | Operation or endpoint | Data file | Contract | Status |
|---|---|---|---|---|---|---|
| M-01 | web, mobile | HTTP | `POST /api/auth/login` | `packages/shared/src/mocks/data/users.json` | `contracts/openapi/auth.yaml` (login) | mocked |
| M-02 | web, mobile | HTTP | `POST /api/auth/refresh` | `packages/shared/src/mocks/data/users.json` | `contracts/openapi/auth.yaml` (refresh) | mocked |
| M-03 | web, mobile | HTTP | `POST /api/auth/logout` | `packages/shared/src/mocks/data/users.json` | `contracts/openapi/auth.yaml` (logout) | mocked |
| M-04 | web, mobile | GraphQL | mutation `register` | `packages/shared/src/mocks/data/users.json` | `contracts/graphql/account.graphqls` | mocked |
| M-05 | web, mobile | GraphQL | query `me` | `packages/shared/src/mocks/data/users.json` | `contracts/graphql/account.graphqls` | mocked |
| M-06 | web, mobile | GraphQL | query `apiVersion` | `packages/shared/src/mocks/data/responses.json` | `contracts/graphql/schema.graphqls` | mocked |
| M-07 | web, mobile | HTTP | `POST /api/auth/google` (signInWithGoogle) | none | `contracts/openapi/auth.yaml` (signInWithGoogle) | not mocked |

The test users are in `packages/shared/src/mocks/data/users.json`.
