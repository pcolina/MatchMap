# Proposal: add-login-page

## Why

Users cannot reach any feature of the app until they are signed in. This change adds the sign-in page, and the shared pieces that the sign-in page and the registration page both use: the validation rules of the sign-in form, the translation catalogues, the skeleton screen, the language switcher, the token handling and the main route. The registration page is in the next change, `add-registration-page`, which depends on this one.

## What Changes

- **Sign-in page:** email and password fields, one primary button to sign in, and a link to the registration page (`/register`).
- **Layout:** the sign-in content is centred on the screen, both horizontally and vertically, in portrait and landscape. The language switcher appears in the top-right corner of the screen. On mobile, the corner position respects the safe area.
- **Language switcher:** a circle with the Tabler icon `language` centred inside it, with the `elevation.card` shadow. It has no behaviour in this change. Its accessible name is the translation key `login.signIn.languageSwitcher`, with the value `languages` in `en` and `idiomas` in `es`.
- **Google button:** visible on the sign-in page, disabled, with the text of `login.signIn.googleComingSoon`: `en` "Coming soon", `es` "Próximamente". It has no sign-in behaviour in this change.
- **Placeholder route:** after a successful sign-in, the user is taken to the main route at `/`, with no extra path. It is lazy-loaded and uses the main layout, where later changes add their components. The main layout route shows no text in this change.
- **Account call:** sign-in calls `POST /api/auth/login` (`contracts/openapi/auth.yaml` in `matchmap-api`) through `data/*.api.ts`. It is an HTTP endpoint, not a GraphQL operation.
- **Shared code:** the sign-in validation and email normalisation functions in `packages/shared`, the sign-in translation keys, the skeleton screen, and the focus border token `borderWidth.focus` (2 px) in `tokens/`.
- **Token handling:**
  - Access token: kept in memory in both apps.
  - Refresh token on mobile: stored in `expo-secure-store`, as `apps/mobile/AGENTS.md` requires.
  - Refresh token on web: an `httpOnly` cookie, so scripts cannot read it. The API must set it as a cookie instead of returning it in the body of `TokenResponse`. This is required in the API change `add-user-accounts`, per `CLAUDE.md` §7.
- **Internationalisation:** every user-facing string is a translation key (`feature.screen.element`) with `es` and `en` values, in `packages/shared/i18n/`. The web app starts in the browser language when it is `en` or `es`, and in English otherwise, as set in `CLAUDE.md` §8.
- **Design:** the same design and behaviour in the app and in the web app on phone-sized screens. Platform details (ng-native or DOM, token storage) are written in `design.md`, not in a second spec.

## Capabilities

### New Capabilities

- `client-sign-in`: the sign-in page, its layout, the language switcher, the Google button, its validation, its error states, the skeleton while the request runs, and the token handling after a successful sign-in.

### Modified Capabilities

None.

The account rules themselves (password storage, token issuing, duplicate emails) belong to the API change `add-user-accounts` and are not specified here.

## Impact

- **Code:** `apps/web` and `apps/mobile` (sign-in page, store, routes and main layout), `packages/shared` (sign-in validators, email normalisation, sign-in keys, catalogues, OpenAPI types), `tokens/` (one border width token).
- **APIs:** the sign-in operation of the `matchmap-api` contract, consumed and not changed here.
- **Dependencies:** see Depends on. New dev dependencies in `packages/shared`, for `pnpm codegen` (task 1.3): `openapi-typescript`, `@graphql-codegen/cli` and `@graphql-codegen/typescript`.
- **Systems:** none beyond the API.

## Out of scope

- The registration page, its data access and its error states. They are in the change `add-registration-page`.
- Google sign-in behaviour. The button is visible and disabled.
- Password reset and email verification. They are part of the MVP, but they are specified outside this change.
- The world map and every screen after the placeholder route.
- The tablet and laptop web layouts. The iPad and laptop specs are separate changes, written later.
- Backend account logic (validation rules on the server, password hashing, token issuing and rotation). These are specified in the API change `add-user-accounts`.

## Depends on

- **API change `add-user-accounts`** in the `matchmap-api` repository (status: in review). This change needs its sign-in endpoint and the web refresh-token cookie, as listed in the account calls above.
- **Dependencies:**
  - Already added before this change was approved, at the user's request: `@ngrx/signals@^22.0.1` in `apps/web` and `apps/mobile`, and `rxjs@~7.8.0` in `apps/mobile`. `apps/web` already declared `rxjs@~7.8.0`.
  - Installed in both apps for this change, at the user's request: `apollo-angular@^14.2.0`, `@apollo/client@^4.3.5`, `graphql@^16` (peer of Apollo) and `@ngx-translate/core@^18.0.0`.
  - Approved for this change, to be installed in both apps for the language switcher icon: `@ng-icons/core` and `@ng-icons/tabler-icons`, as `docs/design.md` §5 requires.
  - Approved for this change, to be installed in `apps/mobile`: `expo-secure-store`, for the refresh token on mobile.

## Open questions

None. The copy and rules in the specs are approved.
