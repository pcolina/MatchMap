# Issue 1: Set the refresh token as an httpOnly cookie for web

## Context

The `add-login-page` change (`openspec/changes/add-login-page/proposal.md`) stores the refresh token on web in an `httpOnly` cookie, so scripts cannot read it. Today the API returns the refresh token in the body of `TokenResponse`, and the web app would have to store it in `localStorage`. This issue moves the web client to the cookie.

This change belongs to the API change `add-user-accounts`, as `CLAUDE.md` §7 requires.

## What the backend must do

- The sign-in endpoint `POST /api/auth/login` (`contracts/openapi/auth.yaml`) sets the refresh token as an `httpOnly` cookie for web clients.
- The cookie has `Secure`, `HttpOnly` and `SameSite` set. The exact `SameSite` value and the cookie path are not decided yet (see Open questions).
- The access token keeps being returned in the body, as today.
- The refresh endpoint reads the refresh token from the cookie on web.

## Open questions for the backend

- How does the API tell web clients from mobile clients? Mobile keeps the refresh token in `expo-secure-store` and receives it in the body, as `apps/mobile/AGENTS.md` requires. The proposal does not say how the API decides which behaviour to use.
- The `SameSite` value, the cookie path and the cookie name.

## Acceptance

- Sign-in from web returns a `Set-Cookie` header with the refresh token marked `HttpOnly`.
- The refresh token is not in the JSON body of the web response.
- Mobile sign-in still returns the refresh token in the body.
