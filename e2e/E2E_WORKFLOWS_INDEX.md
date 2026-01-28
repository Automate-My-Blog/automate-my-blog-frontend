# E2E Test Coverage – Important Workflows

This index maps **important product workflows** to the e2e specs that cover them.

## Workflows and Coverage

| Workflow | Spec(s) | Notes |
|----------|---------|-------|
| **Complete flow (no backend)** | `complete-workflow-mocked.spec.js` | Full journey with mocked APIs: analyze → audience → topics → generate → editor → export. **Primary suite for frontend-only iteration.** |
| **Website analysis** | `workflow.spec.js`, `complete-workflow-mocked.spec.js`, `full-workflow.spec.js` | URL input, Analyze, loading, results. |
| **Audience strategy selection** | `complete-workflow-mocked.spec.js` | Select strategy → posts section with “Generate post”. |
| **Topic generation & selection** | `workflow.spec.js`, `complete-workflow-mocked.spec.js` | Generate topics, select topic, trigger content generation. |
| **Content generation → editor → export** | `complete-workflow-mocked.spec.js`, `workflow.spec.js`, `content-management.spec.js`, `full-workflow.spec.js` | Editor, export modal, content CRUD. |
| **Auth (login, signup, logout)** | `auth.spec.js` | Login form, validation, sign up, logout. Some tests skip when no login UI. |
| **Dashboard navigation** | `dashboard.spec.js` | Tabs (Home, Audience, Posts, Analytics, Settings), layout, responsive, user menu. |
| **Content management (posts)** | `content-management.spec.js` | List, create, edit, delete, preview, export, schedule, filter. |
| **End-to-end scenarios** | `full-workflow.spec.js` | Homepage → analysis → export; auth → create → save; tab navigation; create → edit → preview → export. |

## Spec Summary

| Spec | Purpose |
|------|---------|
| **complete-workflow-mocked.spec.js** | Full workflow with **mocked backend**. Smoke + full test. Use when changing frontend without running the API. |
| **workflow.spec.js** | Content generation workflow (analysis, steps, topic, editor, export). Can run with or without backend. |
| **auth.spec.js** | Authentication flows. |
| **dashboard.spec.js** | Dashboard layout and navigation. |
| **content-management.spec.js** | Post CRUD, export, scheduling. |
| **full-workflow.spec.js** | Higher-level end-to-end scenarios across app. |

## Demo Video

A **recorded run** of the complete-workflow-mocked “full workflow” test is available at:

**`e2e/videos/complete-workflow-demo.webm`**

To regenerate it:

```bash
npm run test:e2e:complete-mocked:record
```

The video is overwritten each time you run that script.

## Quick Commands

```bash
# All e2e tests
npm run test:e2e

# Complete workflow with mocks (recommended for frontend work)
npm run test:e2e:complete-mocked

# Record video of complete-workflow run
npm run test:e2e:complete-mocked:record

# Individual suites
npm run test:e2e:auth
npm run test:e2e:workflow
npm run test:e2e:dashboard
npm run test:e2e:content
npm run test:e2e:full
```
