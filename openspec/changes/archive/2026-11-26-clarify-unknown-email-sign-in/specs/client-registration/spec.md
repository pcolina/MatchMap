# Spec Delta: client-registration

## MODIFIED Requirements

### Requirement: Registration errors

The registration page SHALL show the translated message for each error case, and keep the values the user typed. When the email is already registered, the page SHALL show the link to sign in, which is the existing link `login.register.goToSignIn`.

#### Scenario: Email already registered
- **WHEN** the API returns the stable error code for a registered email
- **THEN** the page shows the text of `login.register.errorEmailTaken`, and the link `login.register.goToSignIn` is visible and leads to the sign-in page

#### Scenario: Network failure
- **WHEN** the request fails because there is no network connection
- **THEN** the page shows the text of `login.common.errorNetwork`

#### Scenario: Values are kept after an error
- **WHEN** registration fails
- **THEN** both fields keep the values the user typed

The message is:

| Key | en | es |
|---|---|---|
| `login.register.errorEmailTaken` | You already have an account with this email. | Ya tienes una cuenta con este email. |

The English text is a proposed translation and is listed under "Translations to review" in the pull request.
