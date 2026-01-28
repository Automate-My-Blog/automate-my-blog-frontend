# Complete Workflow E2E (Mocked Backend)

End-to-end tests that run the **full content workflow** (website analysis → audience → topics → generate → editor → export) **without a real backend**. All API calls are intercepted and mocked via Playwright route handlers.

## Quick start

```bash
npm run test:e2e:complete-mocked
```

**Demo video:** After running `npm run test:e2e:complete-mocked:record`, watch **`e2e/videos/complete-workflow-demo.webm`** for a recording of the full workflow test.

Or run a single test:

```bash
npx playwright test e2e/complete-workflow-mocked.spec.js --grep "smoke"
npx playwright test e2e/complete-workflow-mocked.spec.js --grep "full workflow"
```

## What’s covered

- **Smoke test**: Homepage → Create New Post → analyze URL → continue to audience → select strategy → posts section with “Generate post”. Ensures mocks and flow through audience work.
- **Full workflow**: Same path, then generate topics → (optional) select topic → content generation → editor with mock content → Export modal. Validates the full journey with mocked APIs.

## Mocks

- **Location**: `e2e/mocks/workflow-api-mocks.js`
- **APIs mocked**:  
  `analyze-website`, `generate-audiences`, `generate-pitches`, `generate-audience-images`,  
  `trending-topics`, `tweets/search-for-topic`, `generate-content`,  
  `session/create`, `auth/me`, `auth/refresh`, `auth/logout`,  
  `user/credits`, `audiences`, `analytics/track`, `analytics/track-batch`
- **Auth**: A fake JWT is injected so the app treats the user as logged in. No real login.

## Use case

Use these tests to **refactor or change the frontend** with confidence. They run against the real UI and mock all backend calls, so you can iterate without starting the API server.

## Configuration

- **Base URL**: App runs at `http://localhost:3000` (Playwright `webServer`).
- **Backend URL**: Mocks apply to whatever `REACT_APP_API_URL` the app uses (e.g. Vercel); routes are matched by path, not host.
- **Timeout**: Full workflow test uses a 90s timeout; smoke uses 60s.

## Adding or changing mocks

Edit `e2e/mocks/workflow-api-mocks.js`:

1. Add or adjust entries in the `patterns` array passed to `installWorkflowMocks`.
2. Use the `json()` helper for JSON responses.
3. Match by path (e.g. `/api/analyze-website`) and method; the handler matches any host.

## Troubleshooting

- **“Generate post” / “Create Post” not found**: The flow may have already moved to the editor (e.g. single-topic auto-advance). The full-workflow test allows skipping the topic button click if the editor is already visible.
- **Webpack overlay blocks clicks**: The spec removes `#webpack-dev-server-client-overlay` before key actions. If overlay-related failures persist, run the dev server with fewer warnings or disable the overlay.
- **Credits show “0 posts left”**: The `/api/v1/user/credits` mock must return `{ data: { availableCredits: 10, ... } }`. Confirm the mock path and payload match what the app expects.
