---
name: fullstack-debugging
description: "Use when debugging app issues, validating fixes, or tracing bugs across the backend, frontend, auth flow, or API contract in this music app. Covers reproduction, root-cause analysis, minimal fixes, and evidence-based verification."
---

# Full-Stack Debugging Workflow

## Purpose
Use this skill when a bug, regression, or feature issue affects the music app across the backend, frontend, or integration points.

## Workflow

1. Define the symptom clearly
   - Confirm the expected behavior versus the actual behavior.
   - Identify the affected area: API route, controller, model, React page, component state, auth flow, or upload/search/playback path.

2. Reproduce the problem with the smallest possible check
   - Run the smallest relevant command or request that exposes the bug.
   - For backend issues, inspect the route/controller/model chain and reproduce the failing API call.
   - For frontend issues, inspect the component, state transitions, and any API request or response assumptions.

3. Trace the root cause before changing code
   - Follow the data flow from trigger to failure.
   - Check whether the bug comes from malformed requests, validation gaps, missing auth, bad payload handling, state mutation, or mismatched response expectations.
   - Only patch after the failure point is understood.

4. Implement the minimal, targeted fix
   - Change the exact file or function responsible.
   - Avoid unrelated cleanup or refactors while debugging.
   - If needed, add a focused verification check or minimal reproduction to guard against regression.

5. Validate with evidence
   - Run the smallest test or command that proves the fix.
   - Verify the relevant backend server behavior, frontend render/build, or integration path.
   - Check for new errors, warnings, or side effects in the surrounding area.

6. Summarize the outcome
   - State the root cause and the fix.
   - Mention the command or validation evidence used to confirm success.
   - Note any remaining risk or follow-up work.

## Decision Points

- If the issue is backend-related, inspect routes, controllers, middleware, and models before editing.
- If the issue is frontend-related, inspect the React component tree, props, state, and API client usage.
- If the issue is auth-related, inspect middleware and token/session handling before changing UI assumptions.
- If the issue is data mismatch, compare the API response shape with the frontend's expected fields.
- If the problem cannot be reproduced, verify environment setup, configuration, and startup flow before patching.

## Completion Criteria

A fix is complete only when all of the following are true:
- The root cause is identified and explained.
- The fix is minimal and scoped to the actual problem.
- Relevant verification has been run and the evidence is reviewed.
- No obvious regression was introduced in adjacent behavior.
- The final response clearly states what changed and how it was validated.

## Repo Notes
For this project, common verification paths include:
- Backend: run the server in the backend folder and test the relevant routes or endpoints.
- Frontend: check the UI behavior or run a build for the React app in the frontend folder.
- Integration: verify that API responses and frontend state assumptions still match after the change.

## Example Prompts
- "Debug why playlist creation fails in the backend API."
- "Find the root cause of the failed song upload flow and fix it."
- "Trace the frontend error after a playlist request and verify the fix."
- "Review this feature change and validate that it does not regress auth or song handling."
