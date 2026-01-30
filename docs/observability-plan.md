# Observability Plan

We want to see what’s happening in the app at runtime—errors, performance, and how people use it—so we can fix issues and improve things without guessing.

This doc summarizes where we are today and what to add next.

---

## Where We Are Today

**Analytics.** We have `AnalyticsContext`, the `useAnalytics()` hook in several components, and backend endpoints for tracking (`/api/v1/analytics/track` and `/track-batch`). A lot of user flows still aren’t instrumented, and we don’t have a third-party tool (e.g. PostHog or GA) for session replay or funnels.

**Errors.** We use `console.error` in many places (dozens of files). There’s no React Error Boundary, so a single render error can white-screen the app. We don’t send errors to the backend or to a service like Sentry.

**Performance.** The `web-vitals` package is installed and `reportWebVitals()` is called in `index.js`, but we never pass it a callback. So we never actually record or send Core Web Vitals (e.g. LCP, FCP, CLS).

**Logging.** Logging is ad-hoc `console.log` / `console.warn` / `console.error`. There are no log levels, no consistent structure, and nothing is forwarded to the backend or a log system.

**API layer.** `makeRequest()` in `api.js` does the HTTP work but doesn’t record how long requests take or their status. We can’t easily see which endpoints are slow or failing.

---

## What to Improve

### 1. Error observability (high impact)

**Why:** Crashes and errors are hard to see and debug if they only hit the console.

**What to do:**

- Add a **React Error Boundary** so an uncaught error in the tree shows a fallback UI instead of a blank screen, and we can report it.
- Introduce a single **error reporting function** (e.g. `reportError(error, context)`) that:
  - In development: logs to the console.
  - In production: can send to the backend (e.g. `POST /api/v1/analytics/error`) or to Sentry (or similar).
- Optionally integrate **Sentry** (or similar) for stack traces, releases, and alerts.

**Where:** An Error Boundary wrapping the app in `App.js` or `index.js`, plus a small `utils/errorReporting.js` used by the boundary and by important `catch` blocks.

---

### 2. Wire Web Vitals to the backend

**Why:** Right now we never record Core Web Vitals, so we don’t know how the app feels in terms of load and interaction.

**What to do:**

- In `src/index.js`, pass a callback to `reportWebVitals()` that sends each metric (name, value, id) to our analytics backend—e.g. as a `web_vital` event via our existing `trackEvent` or a dedicated endpoint.
- On the backend, store these so we can build dashboards or SLOs (e.g. “LCP under 2.5s”).

**Example idea:**

```js
reportWebVitals((metric) => {
  // Send to existing analytics (e.g. trackEvent('web_vital', { name, value, id }))
});
```

---

### 3. API request observability

**Why:** We can’t easily see which endpoints are slow or failing.

**What to do:**

- Inside `makeRequest()` in `api.js`:
  - Record start time with `performance.now()`, then compute duration after the request.
  - Send a simple event or metric (e.g. `api_request` or a dedicated metrics endpoint) with: endpoint, HTTP status, duration in ms. No PII.
- If the backend sends a `X-Request-Id` (or similar) header, we can log or attach it when reporting errors so frontend and backend logs line up.

One change in `makeRequest` gives us latency and error rates per endpoint without touching every call site.

---

### 4. Expand analytics instrumentation

**Why:** We already have a plan; we just need to use it consistently.

**What to do:**

- Follow **`docs/frontend-ux-analytics-plan.md`** for event definitions and where to instrument.
- Prioritize:
  - **Navigation** — every tab/section change sends a `page_view` (we already have tab tracking in `DashboardLayout`; align names with the backend).
  - **Auth** — `signup_started`, `signup_completed`, `login_completed` (partially done; finish and verify they fire).
  - **Content lifecycle** — e.g. `content_generation_completed`, `post_created`, `post_edited`, `export_completed`, `publish_success` / `publish_failed` (many are already in PostsTab/ExportModal; fill gaps).
  - **Failures** — track `content_generation_failed`, `export_failed`, and API errors (via `reportError` or the API layer) so we can measure failure rates.

Use `useAnalytics()` (or the same event shape) everywhere so we keep one consistent pipeline for our backend and any third-party tool.

---

### 5. Structured logging (optional)

**Why:** Right now logs are scattered and not queryable.

**What to do:**

- Add a small **logger** (e.g. `utils/logger.js`) with levels like `debug`, `info`, `warn`, `error`:
  - In development: output to the console in a consistent format.
  - In production: send `warn` and `error` (and optionally `info`) to the backend or a log system, with context (e.g. userId, sessionId, page).
- Gradually replace important `console.*` calls with this logger so we can search and correlate logs.

---

### 6. Optional third-party tools

**Why:** They can add session replay, funnels, or dedicated error tracking without us building everything ourselves.

**Options:**

- **PostHog** — session replay, feature flags, event funnels; works alongside our existing analytics.
- **Sentry** (or similar) — error tracking, release mapping, alerts.
- **LogRocket / FullStory** — session replay for support and debugging.

Pick one or two so we don’t duplicate. Prefer tools that work with a single “track” or “report” abstraction so we can switch later if needed.

---

## Suggested order of work

1. **Error Boundary + centralized error reporting** — stops invisible crashes and gives one place to plug in Sentry or the backend later.
2. **Web Vitals callback** — small change, immediate visibility into load and interaction metrics.
3. **API timing (and optional metrics)** — one change in `makeRequest` for latency and error rates per endpoint.
4. **Expand analytics** — implement the key events from `frontend-ux-analytics-plan.md`.
5. **Structured logger** — introduce it and migrate critical `console.*` calls over time.
6. **Third-party (PostHog/Sentry)** — add when we want replay or advanced error workflows.

---

## Quick wins you can do right away

- **Error Boundary** — A small class component that catches render errors, shows a fallback UI, and calls `reportError`. Wrap the app in `App.js` or `index.js`.
- **Web Vitals** — In `index.js`, pass a function to `reportWebVitals()` that calls our existing `trackEvent` with something like `eventType: 'web_vital'` and `eventData: { name, value, id }`.
- **API** — In `makeRequest`, add timing and one `trackEvent('api_request', { endpoint, status, durationMs })` (or a dedicated metrics endpoint) so we can see slow or failing endpoints.
