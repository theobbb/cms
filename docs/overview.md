Executive Overview

The Atelier is a private, lightweight, config-driven multi-tenant platform tailored for creative clients (such as artists, illustrators, and designers). Moving away from traditional monolithic or public-facing SaaS CMS designs, it prioritizes absolute performance, visual clarity, data isolation, and a minimal footprint. It acts as an automated "control desk" where clients manage their data through bespoke, highly contextual user interfaces.
Core Technical Stack

    Frontend & Routing Layer: SvelteKit (utilizing Svelte 5 runes). Handles server-side rendering (SSR), dynamic subdomain routing, routing proxies, and auto-generated custom admin layouts.

    Data & Identity Layer: Pluggable, isolated PocketBase binaries running on SQLite.

    Styling: Tailwind CSS.

    Infrastructure: Self-hosted on a Debian Virtual Private Server (VPS) via Coolify and Docker containers.

Architectural Pillars

1. Hard Isolation Multi-Tenancy (Process-Level)

Instead of a single bloated database using complex SQL table filtering, every tenant (client) owns a completely distinct, isolated PocketBase instance and database asset cartridge.

    Traffic is split cleanly by client subdomains (e.g., client-a.youratelier.com).

    SvelteKit middleware (hooks.server.ts) inspects the incoming hostname request, handles routing, and communicates locally via localhost directly to that tenant's dedicated PocketBase instance with near-zero latency.

2. Passwordless WebAuthn Security

The system completely eliminates the administrative burden, security liabilities, and friction of managing user passwords, emails, and transactional SMTP mail configurations.

    Authentication runs entirely via hardware-bound security keys, biometric scanners (FaceID / TouchID), or synchronized OS managers (iCloud Keychain, Google Password Manager) using @passwordless-id/webauthn.

    Sessions are bound securely via HttpOnly, Secure, SameSite: Strict server-signed cookies mapped directly to individual subdomains.

    Cross-device pairing is safely handled via secure, short-lived single-use pairing token entries (_passkey_invites) generated in the local database.

3. Config-Driven Custom Views

Rather than confronting non-technical clients with raw, complex spreadsheet-style database interfaces, the dashboard dynamically builds itself.

    A hidden meta-collection (_ui_layouts) inside each client's PocketBase instance contains structured JSON configuration objects describing the desired presentation layout.

    The SvelteKit layout engine reads this schema configuration and renders bespoke, gorgeous interactive elements (e.g., masonry media galleries for a painter, drag-and-drop ordering matrices) powered by PocketBase’s real-time Server-Sent Events (SSE).
