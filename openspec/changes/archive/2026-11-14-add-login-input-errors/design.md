# Design: add-login-input-errors

## Contract baseline

`matchmap-api` commit `78027e0`, the last commit that touched `contracts/` before this change.

## Approach

The API code is mapped to a message key in one pure function in `packages/shared`, used by web and mobile. Each app then maps the code to a sign-in failure, and its sign-in page shows the message next to the matching field.

## Decisions

- **One mapping in `packages/shared`.** `packages/shared/src/auth/limit-errors.ts` exports `loginLimitErrorKey(code)`, which returns `login.signIn.errorInvalidEmail` for `invalid_email`, `login.signIn.errorEmailTooLong` for `email_too_long`, `login.signIn.errorInvalidPassword` for `invalid_password`, and `null` for any other code. Both apps import it, so the mapping lives in one place and is tested once.
- **New failures in the sign-in failure type.** The failure type gains `invalidEmail`, `emailTooLong` and `invalidPassword`. The data access layer turns the API `error` value into one of these, as it already does for `invalid_credentials`.
- **Field messages, not the page alert.** The page shows these failures in the field error element (`email-error` or `password-error` on mobile, `data-error` next to the field on web). The alert for credentials, network and unknown failures does not change.
- **No store state change beyond the failure value.** The store keeps `status: 'error'` and `failure`. The typed values stay in the form, as they do today.
- **Client validation unchanged.** The existing validators keep running before the request, so the API code is only shown when the client check did not catch the input.

## Components

- `packages/shared/src/auth/limit-errors.ts`: the mapping function, with unit tests.
- Web: `apps/web/src/app/features/auth/data/auth.api.ts` (`toFailure`), `state/auth.store.ts` (`SignInFailure`), `pages/sign-in/sign-in.page.ts` and `.html` (field messages).
- Mobile: `apps/mobile/src/app/features/auth/data/auth.api.ts` (`toFailure`), `state/auth.model.ts` (`SignInFailure`), `state/sign-in.flow.ts` (`toFailure`), `pages/sign-in/sign-in.page.ts` (field messages).

## Contract

- `POST /api/auth/login` returns status 400 with `error` set to `invalid_email`, `invalid_password`, or `email_too_long` once `matchmap-api` issue #27 is merged.
- Until #27 is merged, `email_too_long` cannot be received. Its tests use a mocked response, and the change is not released before #27 is merged.

## Tests

- Unit tests for `loginLimitErrorKey`: each code, and an unknown code returns `null`.
- Data access tests (web and mobile): each code maps to its failure, and unknown codes still map to `unknown`.
- Store and flow tests: each failure is set as the store failure with the typed values unchanged.
- Page tests (web and mobile): each failure shows its message in the right field, and the credentials, network and unknown messages are unchanged.

## Risks

- A field message can stay on screen after the user edits the field. The message is cleared the next time the user submits, as the existing field errors are.
