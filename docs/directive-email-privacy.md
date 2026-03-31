# Directive Email Privacy — Server-Side Implementation

## Overview

When a Memo/Policy (directive) is sent to multiple employees, the recipient email list (`to` field) was previously returned directly from Django to the browser. Any user inspecting the **Network tab** could see all recipient emails.

This document describes the server-side proxy architecture that hides real email addresses from the browser entirely.

---

## The Problem

```mermaid
sequenceDiagram
    participant Browser
    participant Django

    Browser->>Django: GET /api/directives/23/
    Django-->>Browser: { id: 23, title: "Memo", to: ["alice@company.com", "bob@company.com", ...] }
    Note over Browser: ❌ All emails visible in Network tab
```

---

## The Solution — Architecture Overview

```mermaid
flowchart TD
    A[User visits /directives/23] --> B[Next.js Server Component\npage.tsx]
    B --> C{Fetch directive\nfrom Django}
    C -->|Server-to-server| D[(Django API\n/api/directives/23/)]
    D -->|Full response with 'to' field| B
    B -->|Strip 'to' field| E[Pass sanitized directive\nto Content as props]
    E --> F[Browser renders page\nNO emails in response]

    F --> G[User clicks confirm button]
    G --> H[Client fetches\n/api/directives/23/emails]
    H --> I[Next.js Route Handler\nemails/route.ts]
    I -->|Server-to-server| D
    D -->|Full email list| I
    I -->|Last 4 chars masked\npalerkh****@gmail.com| H
    H --> J[EmailSelectionModal\nshows partially masked emails]

    J --> K[User picks email by index]
    K --> L[Client POSTs\n/api/directives/23/send-verification\n{ emailIndex: 0 }]
    L --> M[Next.js Route Handler\nsend-verification/route.ts]
    M -->|Resolve index → real email| D
    M -->|POST { email: real }| D
    D -->|Send OTP code| N[Employee's Inbox]
    M -->|Success response\nno email in body| L

    K --> O[User enters OTP code]
    O --> P[Client POSTs\n/api/directives/23/verify-code\n{ emailIndex: 0, code: 123456 }]
    P --> Q[Next.js Route Handler\nverify-code/route.ts]
    Q -->|Resolve index → real email| D
    Q -->|POST { email, code }| D
    D -->|Verified| Q
    Q -->|Success| P
```

---

## Request Flow — Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant Browser as Browser (Client)
    participant NextPage as Next.js Server\n(page.tsx)
    participant NextAPI as Next.js API Routes\n(/api/directives/[id]/...)
    participant Django as Django Backend

    Note over Browser,Django: Phase 1 — Page Load (no emails reach browser)

    User->>Browser: Navigate to /directives/23
    Browser->>NextPage: Request page
    NextPage->>Django: GET /api/directives/23/ (server-to-server)
    Django-->>NextPage: { id, title, body, to: ["alice@...", "bob@..."] }
    NextPage->>NextPage: Strip 'to' field
    NextPage-->>Browser: HTML with { id, title, body } — no emails

    Note over Browser,Django: Phase 2 — Email Selection (last 4 chars masked)

    User->>Browser: Click "I have read & understood"
    Browser->>NextAPI: GET /api/directives/23/emails
    NextAPI->>Django: GET /api/directives/23/ (server-to-server)
    Django-->>NextAPI: { to: ["palerkhen40@gmail.com", ...] }
    NextAPI->>NextAPI: Mask last 4 chars of local part
    NextAPI-->>Browser: [{ index:0, masked:"palerkh****@gmail.com" }, ...]
    Browser->>User: Show dropdown with partially masked emails

    Note over Browser,Django: Phase 3 — Send Verification (real email stays server-side)

    User->>Browser: Select email, click Send
    Browser->>NextAPI: POST /api/directives/23/send-verification\n{ emailIndex: 0 }
    NextAPI->>Django: GET /api/directives/23/ (resolve index)
    Django-->>NextAPI: { to: ["palerkhen40@gmail.com", ...] }
    NextAPI->>Django: POST /api/directives/23/send-verification\n{ email: "palerkhen40@gmail.com" }
    Django->>User: Email with OTP code
    NextAPI-->>Browser: { message: "Verification code sent" }

    Note over Browser,Django: Phase 4 — Verify Code (real email stays server-side)

    User->>Browser: Enter OTP code
    Browser->>NextAPI: POST /api/directives/23/verify-code\n{ emailIndex: 0, code: "123456" }
    NextAPI->>Django: GET /api/directives/23/ (resolve index)
    Django-->>NextAPI: { to: ["palerkhen40@gmail.com", ...] }
    NextAPI->>Django: POST /api/directives/23/verify-code\n{ email: "palerkhen40@gmail.com", code: "123456" }
    Django-->>NextAPI: { message: "Successfully verified" }
    NextAPI-->>Browser: { message: "Successfully verified" }
    Browser->>User: Show success, redirect
```

---

## File Structure

```mermaid
flowchart LR
    subgraph NextJS["Next.js (yahshua-hris-fe)"]
        subgraph Pages["app/(un-auth)/directives/[id]/"]
            P["page.tsx\n(Server Component)\nFetches + strips 'to'"]
        end

        subgraph APIRoutes["app/api/directives/[id]/"]
            R1["emails/route.ts\nReturns partially masked emails"]
            R2["send-verification/route.ts\nProxies with real email"]
            R3["verify-code/route.ts\nProxies with real email"]
        end

        subgraph Components["components/pages/(un-auth)/directives/"]
            C["Content.tsx\n(Client Component)\nReceives directive as props"]
            M["modals/EmailSelectionModal.tsx\nShows partially masked emails"]
            H1["hooks/useSendVerification.ts\nSends emailIndex"]
            H2["hooks/useVerifyDirective.ts\nSends emailIndex + code"]
        end

        subgraph Types["types/"]
            T["directives.ts\nMaskedEmail, updated params"]
        end
    end

    subgraph Django["Django Backend"]
        D1["/api/directives/[id]/\nPublic detail endpoint"]
        D2["/api/directives/[id]/send-verification/"]
        D3["/api/directives/[id]/verify-code/"]
    end

    P -->|server-to-server| D1
    R1 -->|server-to-server| D1
    R2 -->|server-to-server| D1
    R2 -->|server-to-server| D2
    R3 -->|server-to-server| D1
    R3 -->|server-to-server| D3

    C -->|props| P
    C -->|fetch| R1
    H1 -->|fetch| R2
    H2 -->|fetch| R3
    C --> H1
    C --> H2
    C --> M
```

---

## Email Masking Logic

The last 4 characters of the local part (before `@`) are always replaced with `****`. The rest of the email remains visible so users can clearly identify their own email.

```mermaid
flowchart LR
    A["palerkhen40@gmail.com"]
    A --> B{Split at @}
    B --> C["local: palerkhen40\n11 chars"]
    B --> D["domain: @gmail.com"]
    C --> E["visible = local slice 0 to length-4\n= 'palerkh'"]
    C --> F["last 4 replaced\n= '****'"]
    E & F & D --> G["palerkh****@gmail.com ✅"]
```

### Examples

| Original | Masked |
|---|---|
| `palerkhen40@gmail.com` | `palerkh****@gmail.com` |
| `yahshua.palerkh@gmail.com` | `yahshua.pa****@gmail.com` |
| `bob123@company.com` | `bob1****@company.com` |

### Why This Masking Strategy

The target users of the Memo/Policy directive feature are **non-technical employees (boomers)**. The masking is designed with their UX in mind:

```mermaid
flowchart TD
    A{Masking Strategy} --> B["Full mask\npale****@gmail.com"]
    A --> C["Last 4 masked\npalerkh****@gmail.com ✅"]
    A --> D["No mask\npalerkhen40@gmail.com"]

    B --> B1["❌ Too confusing\nEmails look identical\nwhen multiple recipients\nshare a similar prefix"]
    C --> C1["✅ Clearly identifiable\nUser sees enough to\nrecognize their own email\nwhile hiding the tail"]
    D --> D1["❌ Privacy risk\nFull emails visible\nin Network tab"]
```

| Strategy | Identifiable | Private | UX for non-tech users |
|---|---|---|---|
| Full mask `pale****@gmail.com` | ❌ Ambiguous | ✅ | ❌ Confusing |
| Last 4 masked `palerkh****@gmail.com` | ✅ Clear | ✅ | ✅ Easy |
| No mask `palerkhen40@gmail.com` | ✅ Clear | ❌ | ✅ Easy |

---

## Data Stripping — What the Browser Sees

```mermaid
flowchart TD
    subgraph Django Response
        DR["{ id, title, body, to: emails[], signature, qr_code, ... }"]
    end

    subgraph "page.tsx (Server)"
        S["const { to: _to, ...rest } = data\nreturn rest"]
    end

    subgraph "Browser (Client)"
        BR["{ id, title, body, signature, qr_code, ... }\n❌ 'to' field absent"]
    end

    DR --> S --> BR
```

---

## State Flow in Content.tsx

```mermaid
stateDiagram-v2
    [*] --> PageLoaded : Directive data arrives as props\n(no 'to' field)

    PageLoaded --> FetchingEmails : User clicks confirm button

    FetchingEmails --> EmailModal : Partially masked emails loaded\nfrom /api/directives/[id]/emails

    EmailModal --> SendingCode : User selects email\n(stores emailIndex + masked display)

    SendingCode --> VerificationModal : POST emailIndex to\n/api/directives/[id]/send-verification

    VerificationModal --> Verifying : User enters OTP code

    Verifying --> Confirmed : POST { emailIndex, code } to\n/api/directives/[id]/verify-code\nSuccess

    Verifying --> VerificationModal : Invalid code\nStay on modal

    Confirmed --> [*] : Redirect to home
```

---

## Key Types

```typescript
// types/directives.ts

interface MaskedEmail {
  index: number;  // Position in the real email array (server-side only)
  masked: string; // e.g. "palerkh****@gmail.com" — last 4 chars of local part hidden
}

interface SendVerificationRequest {
  emailIndex: number; // Index only — real email never sent from browser
}

interface VerifyDirectiveParams {
  directiveId: number;
  emailIndex: number; // Index only — real email never sent from browser
  code: string;
}
```

---

## Security Comparison

```mermaid
flowchart LR
    subgraph Before["❌ Before (Insecure)"]
        B1["Browser fetches directive"] --> B2["Browser receives all emails\n['palerkhen40@gmail.com', ...]"]
        B2 --> B3["Network tab exposes\nall recipient emails in full"]
        B3 --> B4["Browser sends real email\nto Django directly"]
    end

    subgraph After["✅ After (Secure)"]
        A1["Server fetches directive\n(page.tsx)"] --> A2["'to' stripped before\nreaching browser"]
        A2 --> A3["Browser only receives\npartially masked emails on demand\n['palerkh****@gmail.com']"]
        A3 --> A4["Browser sends emailIndex\nto Next.js proxy"]
        A4 --> A5["Server resolves real email\nand forwards to Django"]
    end
```

---

## Environment Variables

Both servers must share the same `INTERNAL_API_SECRET` value so Next.js API routes can authenticate their server-to-server calls to Django.

| Variable | Backend `.env` | Frontend `.env` |
|---|---|---|
| `INTERNAL_API_SECRET` | ✅ Required | ✅ Required |

Generate a secret: `openssl rand -hex 32`

---

## Related Files

| File | Type | Role |
|---|---|---|
| `app/(un-auth)/directives/[id]/page.tsx` | Server Component | Initial fetch, strips `to` field |
| `app/api/directives/[id]/emails/route.ts` | API Route | Returns partially masked email list |
| `app/api/directives/[id]/send-verification/route.ts` | API Route | Proxy — resolves index, sends OTP |
| `app/api/directives/[id]/verify-code/route.ts` | API Route | Proxy — resolves index, verifies OTP |
| `components/pages/(un-auth)/directives/Content.tsx` | Client Component | Main UI, index-based flow |
| `components/pages/(un-auth)/directives/modals/EmailSelectionModal.tsx` | Client Component | Partially masked email dropdown |
| `components/pages/(un-auth)/directives/hooks/useSendVerification.ts` | Hook | Sends `emailIndex` to proxy |
| `components/pages/(un-auth)/directives/hooks/useVerifyDirective.ts` | Hook | Sends `emailIndex + code` to proxy |
| `types/directives.ts` | Types | `MaskedEmail`, updated request types |
| `root/settings.py` | Django Config | `INTERNAL_API_SECRET` setting |
