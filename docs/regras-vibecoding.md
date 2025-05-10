# 🔥 VIBE CODE RULES – Global-Scale Quality Engineering Standards (Extended Edition)

---

## 📜 Purpose  
Define a **non-negotiable, elite-level coding standard** for modern, secure, maintainable, and scalable software systems.  
This is **not** a style guide. This is a **contract of engineering discipline**.  
Every line of code must **vibrate** with clarity, performance, and architectural purpose.

---

## 🧱 CODE STRUCTURE & DOMAIN MODULARITY

- **DRY (Don’t Repeat Yourself)**  
  ▸ Abstract repeated logic into shared functions and modules  
  ▸ Create reusable utilities for validation, formatting, conversions  

- **Split large files (> 300 LOC)**  
  ▸ Enforce **SOLID**, especially Single Responsibility Principle  
  ▸ Clearly separate data access, business rules, and presentation  

- **Organize by domain, not by file type**  
  ▸ Follow domain-driven folder structure:  
    `/domains/content`, `/domains/auth`, `/usecases/generateContent`  
  ▸ Each domain must contain:  
    - Entities  
    - Value Objects  
    - Use Cases (Application Services)  
    - Interfaces (Ports)  
    - Validation Rules  

- **Naming must tell a story**  
  ▸ Avoid abbreviations and cryptic terms  
  ▸ Ensure folder names represent domain purpose

---

## 🔐 SECURITY BEST PRACTICES

### Input Handling  
▸ Validate and sanitize all user input (frontend + backend)  
▸ Always use parameterized queries  
▸ Escape output to prevent **XSS**

### Authentication & Authorization  
▸ Enforce RBAC and server-side permission checks  
▸ Secure all sensitive routes with middlewares  
▸ Apply Supabase RLS policies (if applicable)

### API Protection  
▸ Implement rate-limiting on critical routes  
▸ Use secure headers (CORS, CSP, HSTS)  
▸ Force HTTPS in all environments

### Secret Management  
▸ Never hardcode secrets  
▸ Use `.env.dev`, `.env.prod`, and Secret Managers (e.g. AWS, Vault)

---

## 🛠 ENFORCEMENT & CI/CD STANDARDS (NEW)

▸ All projects must include:  
  ▸ ESLint + Prettier (or PHPStan / Psalm for PHP)  
  ▸ GitHub Actions or CI to enforce lint/test/pass  
  ▸ Block pull requests with failed lint or missing tests  

▸ Coverage thresholds (minimums):  
  ▸ Unit tests: 100% on domain logic  
  ▸ Integration tests: ≥ 80% overall  
  ▸ E2E flows: Cover all critical user paths

▸ Static analysis required on all code merges

---

## 🧪 TESTING STANDARDS BY LAYER (NEW)

▸ Tests are not optional — they are **governance tools**  
▸ For each layer:

- **Domain Layer (Entities, Value Objects)**  
  ▸ 100% unit test coverage required  
  ▸ Focus on rules, validation, state transitions

- **Application Layer (Use Cases)**  
  ▸ Integration tests with real data flow  
  ▸ Cover positive/negative business scenarios

- **Infrastructure / Interfaces**  
  ▸ E2E tests for APIs and UI (Cypress, Playwright, Postman)  
  ▸ Include failure paths, auth, and edge cases

- **On every PR**  
  ▸ Require corresponding test file  
  ▸ Explicitly cover use case logic  
  ▸ At least one negative test case required

---

## 🧯 ERROR HANDLING

▸ Categorize errors by type, severity, and domain impact  
▸ Use contextual logs (trace ID, timestamp, request payload)  
▸ Show user-friendly error messages (no stack traces in UI)  
▸ Always handle async failures (timeouts, retries, circuit breakers)  
▸ Provide loading/failure/retry states in UI

---

## 📊 AUDIT TRAIL & MUTATION LOGGING (NEW)

▸ Any sensitive mutation (data creation, update, deletion) must be logged:  
  ▸ User ID  
  ▸ Origin (API/UI/Internal/Automation)  
  ▸ Payload  
  ▸ Timestamp

▸ Logs must be:  
  ▸ Searchable  
  ▸ Persisted securely  
  ▸ Reviewed in observability tools (PostHog, Mixpanel, ELK)

▸ DO NOT log passwords or access tokens

---

## ⚙️ PERFORMANCE OPTIMIZATION

▸ Cache costly calculations and fetches  
▸ Use pagination and virtual scroll from day one  
▸ Prevent memory leaks (clear timers, listeners, subscriptions)  
▸ Apply lazy-loading and code splitting wisely  
▸ Optimize re-renders in React/Vue  
▸ Memoize pure functions where applicable

---

## 🗄 DATABASE EXCELLENCE

▸ Always use transactions for related operations  
▸ Implement rollbacks for failure scenarios  
▸ Use indexes and select only required fields  
▸ Apply row-level security (RLS) where supported  
▸ Avoid full scans or unfiltered fetches  
▸ Use pooling and retry logic for transient failures

---

## 🔌 API DESIGN PRINCIPLES

▸ Follow REST or GraphQL principles strictly  
▸ Use appropriate HTTP verbs and resource naming  
▸ Version every public API (`/v1/...`)  
▸ Return typed, structured responses

▸ Status Code Guidelines  
2XX – Success
4XX – Client Error
5XX – Server Error


▸ Document all endpoints  
  ▸ Swagger/OpenAPI preferred  
  ▸ Include real request/response examples  
  ▸ Validate payloads at schema level

---

## 🧑‍💻 FRONTEND QUALITY RULES

▸ Validate forms with real-time feedback  
▸ Always show contextual error messages  
▸ Provide clear loading and failure states  

▸ Manage state by scope:  
  - Local (component)  
  - Global (business-wide)  
  - Server-state (via API or caching libs)

▸ Ensure full accessibility (a11y):  
  - Use semantic HTML  
  - Add ARIA where needed  
  - Keyboard navigability  
  - Sufficient contrast ratio

---

## 🔐 SECURITY THREATS TO PREVENT

### SQL/NoSQL Injection  
▸ Never interpolate raw inputs  
▸ Always use ORM or query builder parameterization

### XSS (Cross-Site Scripting)  
▸ Sanitize output  
▸ Use framework protections (React auto-escapes by default)

### CSRF  
▸ Use CSRF tokens  
▸ Strict origin validation

### Broken Auth  
▸ Use hashed passwords (bcrypt, argon2)  
▸ Secure token/session lifecycle  
▸ Enforce 2FA for sensitive accounts

---

## 🔁 VIBE-CODE PRINCIPLES FOR INTELLIGENT SYSTEMS

✅ Think in **flows, not features**  
✅ Code must **tell a story from top to bottom**  
✅ Every module must serve a **clear domain purpose**  
✅ Favor **immutability, predictability, and clarity**  
✅ Build systems that are **debuggable blindfolded**

---

## 🧬 Core Belief  
You’re not coding features.  
You’re engineering a **living system** — built to evolve, scale, recover, and adapt.

That’s **VIBE CODING**.