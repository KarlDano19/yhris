# Google OAuth — Sign in with Google

## Overview

YAHSHUA HRIS supports Google Sign-In as an alternative to email/password login. The implementation reuses the existing SSO popup + postMessage infrastructure already used by Yahshua Payroll OAuth, with four additional backend endpoints dedicated to login (as opposed to the existing Google integration which is for Calendar/Meet).

---

## Flow Diagram

```mermaid
flowchart TD
    A([Login page / ApplyNowModal]) -->|loginWithGoogle - window.open| B[GET /api/sso/login/google-login/]
    B -->|redirect| C([Google OAuth consent screen])
    C -->|user approves - redirects with code| D[/sso/google-login?code=...]
    D -->|useVerifyOauth| E[POST /api/sso/complete/google-login-oauth/]

    E --> F{User exists\nby email?}

    F -->|Yes - applicant\nauto-linked| G[Generate JWT\nlogin user]
    G --> H[postMessage to opener]
    H --> I[setSession - set cookie\nupdate iron-session]
    I --> J([Redirect to dashboard\nor job form])

    F -->|Yes - non-applicant\nemail_conflict: true| EC[Show password form in popup]
    EC -->|user enters password| EL[POST /api/sso/complete/google-login-oauth/link/\ngoogle_access_token + password]
    EL -->|password correct| H
    EL -->|password wrong| ECE[Show error in popup]

    F -->|No - needs_account_type: true| K{Preset account\ntype in localStorage?}

    K -->|Yes - from job apply flow\nauto = applicant| L[POST /api/sso/complete/google-login-oauth/create/\naccount_type = applicant]
    K -->|No - from login page| M([Show Applicant / Employer\nselection form in popup])
    M -->|user selects| L

    L --> N[Create User\nset_unusable_password\nlogin_type = google]
    N --> O{account_type\n= applicant?}
    O -->|Yes| P[Create Applicant\nLink guest AppliedJobs by email]
    O -->|No| Q[Employer account\nno extra record]
    P --> R[Generate JWT]
    Q --> R
    R --> H
```

---

## Backend

### Endpoints

| Method | URL | View | Auth required |
|--------|-----|------|---------------|
| GET | `/api/sso/login/google-login/` | `GoogleLoginRequestAPIView` | No |
| POST | `/api/sso/complete/google-login-oauth/` | `GoogleLoginVerifyAPIView` | No |
| POST | `/api/sso/complete/google-login-oauth/create/` | `GoogleLoginCompleteAPIView` | No |
| POST | `/api/sso/complete/google-login-oauth/link/` | `GoogleLoginLinkAPIView` | No |

All four views live in `app/views/google.py`.

---

### `GoogleLoginRequestAPIView`

Redirects the popup browser to Google's OAuth authorization URL.

```python
auth_url = Oauth_Utils.request_authorize_url(
    "google",
    redirect_uri=f"{settings.CLIENT_URL}/sso/google-login",
)
return redirect(auth_url)
```

Uses the existing `google` provider credentials from `utils/oauth.py` but overrides the `redirect_uri` to `/sso/google-login` (separate from the calendar integration callback at `/sso/google`).

**Scopes requested** (added to the existing `google` provider):
- `userinfo.email`
- `userinfo.profile`
- `calendar` (existing)
- `meetings.space.created` (existing)

---

### `GoogleLoginVerifyAPIView` — Step 1

Exchanges the auth code for tokens, fetches user info from Google, then handles three cases:

**Existing applicant** (auto-linked):
```python
# account_type == "applicant" → log in silently
login(request, user)
refresh = RefreshToken.for_user(user)
# → return { is_granted: True, token, login_type: "google", ... }
```

**Existing non-applicant** (email conflict):
```python
# account_type != "applicant" → prompt for password
return { is_granted: False, email_conflict: True, google_access_token }
```

**New user** (no match):
```python
return { is_granted: False, needs_account_type: True, google_email, google_name, google_access_token }
```

The `google_access_token` is returned so subsequent steps can re-verify it server-side without storing state.

---

### `GoogleLoginLinkAPIView` — Step 1b (existing non-applicant only)

Called when `email_conflict: true` is returned from step 1. The user has entered their HRIS password in the popup form.

1. Re-verifies `google_access_token` against Google's userinfo endpoint — the email from the frontend is **never trusted directly**
2. Looks up the existing user by that email
3. Calls `user.check_password(password)` — returns 400 on failure
4. On success: logs in the existing user and returns a JWT with their original `login_type` (not `"google"`)

> This step verifies identity but does not permanently link Google as an auth method. Subsequent Google sign-ins with the same email will prompt for the password again. A future `LinkedProvider` table would remove this friction.

---

### `GoogleLoginCompleteAPIView` — Step 2 (new users only)

Called after the user selects their account type (Applicant or Employer) in the popup.

1. Re-verifies `google_access_token` against Google's userinfo endpoint — the email from the frontend is **never trusted directly**
2. Creates `User` with `login_type="google"`, `set_unusable_password()` — no email verification email sent (Google already verified the email)
3. If `account_type == "applicant"`: parses Google `name` into `firstname`/`lastname`, creates `Applicant` record, and links any existing guest `AppliedJob` records with matching email
4. Generates JWT and returns the same response shape as step 1

---

### OAuth Utility — `utils/oauth.py`

The `OauthAuthorizationAPI` class manages all OAuth provider config. Additions made for this feature:

**1. `userinfo.profile` added to the `google` scope** (enables fetching the user's display name)

**2. `redirect_uri` override parameter** on `request_authorize_url` and `exchange_authcode_tokens`:
```python
def request_authorize_url(self, provider, code_challenge=None, redirect_uri=None):
    params = dict(data["params"])
    if redirect_uri:
        params["redirect_uri"] = redirect_uri  # override without mutating shared config
    return data["url"] + urlencode(params)
```

This allows the login flow to reuse the `google` provider credentials while redirecting to `/sso/google-login` instead of `/sso/google`.

**3. `get_google_user_info(token_type, access_token)`** — shared utility method to fetch user info from `https://www.googleapis.com/oauth2/v2/userinfo`. Used by all three POST views.

---

## Frontend

### Login Page — `(all-layout)/login/Content.tsx`

Added `loginWithGoogle()` function (mirrors `loginWithYahshuaPayroll`):

```ts
const loginWithGoogle = () => {
  localStorage.removeItem('sso_result');
  const popup = window.open(
    `${process.env.NEXT_PUBLIC_API_URL}/api/sso/login/google-login/`,
    'popup',
    `width=500,height=600,...`
  );
  // polls popup closed → consumeStoredSSOResult() fallback
};
```

The existing `handleSSOData` + `setSession` functions handle the response — no additional logic needed. `'google'` was added to the `login_type` check that populates the postMessage payload.

The **"Sign in with Google"** button was already present in the UI (previously disabled). It is now enabled and wired to `loginWithGoogle()`.

---

### SSO Callback Page — `(un-auth)/(callbacks)/sso/oauth/Content.tsx`

Shared callback page for all SSO providers. Changes for Google login:

**1.** Added `'google'` to the `login_type` check that includes token/session data in the postMessage payload.

**2.** Handles `email_conflict: true` response — shows a password confirmation form in the popup:

```ts
if (data.email_conflict) {
  setGoogleAccessToken(data.google_access_token);
  setEmailConflict(true);
  return;
}
```

The password input uses the same styling as the login page (lock icon left, eye toggle right). On submit, `useGoogleLoginLink` is called. On success, `postAndClose()` fires as normal.

**3.** Handles `needs_account_type: true` response:

```ts
if (data.needs_account_type) {
  const preset = localStorage.getItem('google_sso_account_type');
  if (preset) {
    // skip form, auto-create with preset type (e.g. 'applicant' from job apply flow)
    completeGoogleLogin({ google_access_token, account_type: preset });
  } else {
    // show Applicant / Employer selection form
    setNeedsAccountType(true);
  }
}
```

When the user submits the form (or it auto-submits), `useGoogleLoginComplete` is called, and on success the same `postAndClose()` helper fires to communicate back to the opener.

---

### Hooks

| File | Endpoint | Purpose |
|------|----------|---------|
| `hooks/useGoogleLoginComplete.ts` | `POST .../create/` | Create new Google user |
| `hooks/useGoogleLoginLink.ts` | `POST .../link/` | Link Google to existing account via password |

Both are unauthenticated — no `Authorization` header.

---

### Apply Now Modal — `(un-auth)/apply-job-without-signup/modals/ApplyNowModal.tsx`

Google Sign-In is available directly in the job application modal for unauthenticated users on the job listings page. This avoids sending the user through a full login/register flow.

**Account type auto-selection:**

Before opening the popup, the modal sets:
```ts
localStorage.setItem('google_sso_account_type', 'applicant');
```

The callback page reads this flag, skips the Applicant/Employer selector, and automatically creates the account as an Applicant. The flag is cleared after use.

**After successful Google login from the modal:**

- Has profile → redirect to `/job-applicant-form/[jobId]`
- No profile yet → redirect to `/setup-applicant-profile?redirect=/job-applicant-form/[jobId]`

The modal listens for SSO results via the same triple-channel approach (postMessage → BroadcastChannel → localStorage fallback).

---

## Email Collision Behaviour

| Existing account | Result |
|---|---|
| `account_type = applicant` | Auto-linked — logged in silently |
| `account_type = employer` (or other) | Password prompt in popup (`email_conflict: true`) |
| No account | Account creation flow (`needs_account_type: true`) |

See the backend `docs/google-oauth-email-collision.md` for the full design rationale.

---

## Google Cloud Console Setup

### Required configuration

1. Create an OAuth 2.0 Client ID (Web application)
2. Add **Authorised redirect URIs**:
   - `http://localhost:3000/sso/google-login` (development — login flow)
   - `http://localhost:3000/sso/google` (development — calendar integration)
   - `https://yourdomain.com/sso/google-login` (production)
   - `https://yourdomain.com/sso/google` (production)
3. Copy **Client ID** and **Client Secret** to the backend `.env`:
   ```
   GOOGLE_CLIENT_ID_KEY=your_client_id
   GOOGLE_CLIENT_SECRET_KEY=your_client_secret
   ```
4. Restart the Django backend after updating credentials (credentials are read at startup)

### OAuth consent screen

- **Scopes requested**: `email`, `profile`, `calendar`, `meetings.space.created`
- `email` and `profile` are non-sensitive — no Google review required for these
- While in **Testing** mode: add test user emails under "Test users"
- To open to all users: click **Publish App** — no formal review needed for non-sensitive scopes only

---

## Difference: Login OAuth vs Calendar Integration OAuth

Both flows share the same Google credentials (`GOOGLE_CLIENT_ID_KEY` / `GOOGLE_CLIENT_SECRET_KEY`) but are otherwise separate:

| | Login (`google-login`) | Calendar Integration (`google`) |
|---|---|---|
| **Endpoint** | `/api/sso/login/google-login/` | `/api/sso/login/google-oauth/` |
| **Callback** | `/sso/google-login` | `/sso/google` |
| **Auth required** | No | Yes (employer) |
| **Result** | JWT token, user session | `ThirdPartyIntegration` record |
| **Extra scopes** | — | `calendar`, `meetings.space.created` |

---

## Session Response Shape

All success paths return the same shape, matching the Payroll SSO response:

```json
{
  "is_granted": true,
  "token": "<JWT access token>",
  "email": "user@example.com",
  "login_type": "google",
  "account_type": "applicant",
  "has_profile": false,
  "has_pending_transaction": false,
  "has_active_subscription": false
}
```

> For the link flow (`/link/`), `login_type` reflects the user's **original** login type (e.g. `"password"`), not `"google"`.

The frontend `handleSSOData` → `updateSession` → `setSession` pipeline handles this identically to Payroll SSO.
