# Observability Plan

**Goal:** Increase visibility into runtime behavior, errors, performance, and usage so you can debug and improve the application reliably.

---

## Current State

| Area | What Exists | Gaps |
|------|-------------|------|
| **Analytics** | `AnalyticsContext` with batched events, `useAnalytics()` in ~8 components, backend `POST /api/v1/analytics/track` and `/track-batch` | Many flows not instrumented; no third-party (PostHog, GA) for session replay or funnels |
| **Errors** | `console.error` in ~43 files (545 calls) | No React Error Boundary; no centralized error reporting (e.g. Sentry); errors not sent to backend |
| **Performance** | `web-vitals` installed; `reportWebVitals()` called in `index.js` | **Not wired**—called with no callback, so CLS/LCP/FCP/INP/TTFB are never sent anywhere |
| **Logging** | Ad-hoc `console.log/warn/error` | No levels, no structure, no forwarding to backend or log aggregation |
| **API layer** | `makeRequest()` in `api.js` | No request timing, no status/metrics, no correlation IDs |

---

## Recommended Improvements

### 1. **Error observability (high impact)**

- **Add a React Error Boundary** so uncaught render errors don’t white-screen; optionally report to backend or Sentry.
- **Centralize error reporting**: one place (e.g. `reportError(error, context)`) that can:
  - `console.error` in dev
  - Send to backend (e.g. `POST /api/v1/analytics/error` or `/api/v1/events/error`) or Sentry in prod
- **Optionally add Sentry** (or similar) for stack traces, release tracking, and alerts.

**Where:** Wrap the app in `App.js` with an Error Boundary; add a small `utils/errorReporting.js` and call it from boundary + critical catch blocks.

---

### 2. **Wire Web Vitals to your backend**

`reportWebVitals` is invoked with no callback, so Core Web Vitals are never recorded.

- In `src/index.js`, pass a callback that sends metrics to your analytics backend, e.g.:

  ```js
  reportWebVitals((metric) => {
    // Option A: send to existing analytics
    if (window.__analyticsTrack) {
      window.__analyticsTrack('web_vital', { name: metric.name, value: metric.value, id: metric.id });
    }
    // Option B: call api.trackEvent or a dedicated endpoint
  });
  ```

- Ensure your backend accepts a `web_vital` (or similar) event and stores name/value/id (and optionally rating) for dashboards and SLOs.

---

### 3. **API request observability**

In `api.js` `makeRequest()`:

- **Timing:** Record `start = performance.now()`, then `durationMs = performance.now() - start` after the request.
- **Structured payload:** Send to analytics or a dedicated endpoint: `{ endpoint, method, status, durationMs, errorMessage? }` (no PII).
- **Optional:** If backend returns a `X-Request-Id` (or similar), log or attach it to errors so frontend and backend logs can be correlated.

This gives you latency and error rates per endpoint without changing every call site.

---

### 4. **Structured logging (optional but useful)**

- Add a small `utils/logger.js` with levels (e.g. `debug`, `info`, `warn`, `error`) that:
  - In development: forward to `console` with a consistent format.
  - In production: send `warn`/`error` (and optionally `info`) to your backend or log aggregation, with context (e.g. userId, sessionId, page).
- Gradually replace critical `console.*` calls with this logger so logs are queryable and correlatable.

---

### 5. **Expand analytics instrumentation**

Your `docs/frontend-ux-analytics-plan.md` already defines events and instrumentation points. Prioritize:

- **Navigation:** Ensure every tab/section change sends a `page_view` (you have `tab_switched` / `trackPageView` in `DashboardLayout`—align naming with backend).
- **Auth:** `signup_started` / `signup_completed` / `login_completed` (partially done; complete and ensure they’re sent).
- **Content lifecycle:** `content_generation_completed`, `post_created`, `post_edited`, `export_completed`, `publish_success` / `publish_failed` (many already in PostsTab/ExportModal; fill gaps).
- **Failures:** Track `content_generation_failed`, `export_failed`, and API errors (e.g. via `reportError` or API layer) so you can measure failure rates and debug.

Using `useAnalytics()` (or the same event shape) everywhere keeps one consistent pipeline (your backend + optional third-party).

---

### 6. **Optional: third-party tools**

- **PostHog:** Session replay, feature flags, and event funnels; can sit alongside your existing analytics.
- **Sentry (or similar):** Dedicated error tracking, release mapping, and alerts.
- **LogRocket / FullStory:** Session replay focused on support/debugging.

Choose one or two to avoid duplication; prefer tools that accept the same event shape or a single “track” abstraction so you can switch providers later.

---

## Implementation order

1. **Error Boundary + centralized error reporting** — prevents invisible crashes and gives a single place to attach Sentry/backend later.
2. **Web Vitals callback** — low effort, immediate visibility into LCP, FCP, CLS, INP, TTFB.
3. **API timing + optional error/latency events** — one change in `makeRequest`, big gain in API observability.
4. **Expand analytics** — follow `frontend-ux-analytics-plan.md` for key user and failure events.
5. **Structured logger** — incremental replacement of `console.*` where it matters most.
6. **Third-party (PostHog/Sentry)** — once the above is in place, add if you need replay or advanced error workflows.

---

## Quick wins you can do now

- **Error Boundary:** Add a small class component that catches render errors and renders a fallback UI + calls `reportError`; wrap `<App />` in `index.js` or inside the top-level provider in `App.js`.
- **Web Vitals:** In `index.js`, pass a function to `reportWebVitals()` that calls your existing `trackEvent` (e.g. via a ref or a global set by AnalyticsProvider) with `eventType: 'web_vital'` and `eventData: { name, value, id }`.
- **API:** In `makeRequest`, add timing and one `trackEvent('api_request', { endpoint, status, durationMs })` (or send to a dedicated metrics endpoint) so you can see which endpoints are slow or failing.

If you tell me which of these you want to implement first (errors, Web Vitals, or API metrics), I can outline the exact code changes file-by-file.
