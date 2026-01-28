## Summary
Adds a **complete e2e workflow** that runs with a **mocked backend** (no API required), plus video recording and a workflow index.

## What's included
- **complete-workflow-mocked.spec.js**: Full journey — analyze → audience → topics → generate → editor → export. All API calls intercepted via Playwright route mocks.
- **e2e/mocks/workflow-api-mocks.js**: Mocks for workflow, auth, user, analytics APIs. Fake JWT for logged-in flow.
- **Smoke** + **full workflow** tests; both pass.
- **Video**: `npm run test:e2e:complete-mocked:record` → records run and copies to `e2e/videos/complete-workflow-demo.webm`. A pre-recorded demo is committed.
- **E2E_WORKFLOWS_INDEX.md**: Maps important workflows to specs.
- **README-COMPLETE-WORKFLOW-MOCKED.md** + e2e README updates.

## Test results
- **Full e2e suite**: 42 passed, 4 skipped (auth skips when no login UI).
- **Complete-workflow-mocked**: smoke + full workflow both pass.

## Demo video
**`e2e/videos/complete-workflow-demo.webm`** — recorded run of the full-workflow test. Regenerate with `npm run test:e2e:complete-mocked:record`.

## Quick commands
```bash
npm run test:e2e                     # all e2e
npm run test:e2e:complete-mocked     # complete workflow (mocked)
npm run test:e2e:complete-mocked:record   # record video
```
