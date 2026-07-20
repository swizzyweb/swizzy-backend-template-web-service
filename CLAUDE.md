# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npm run build        # Compile TypeScript (tsc → dist/)
npm run server       # Run the server after building (via swerve)
npm run dev          # Build then run immediately
npm test             # Compile + run the test suite (node:test)
```

Run a single test file:
```bash
npm run build:service && tsc -p tsconfig.test.json && node --test dist/test/routers/HelloRouter/controllers/world-controller.spec.js
```

Docker:
```bash
docker compose up    # Builds and runs; maps host 3705 → container 3005
```

## Architecture

This service is built on `@swizzyweb/swizzy-web-service`. The framework uses a three-layer hierarchy: **WebService → WebRouter → WebController**, each with its own scoped state slice.

### Layer pattern

**`src/web-service.ts`** — `SwizzyBackendTemplateWebService` extends `WebService`. It defines `SwizzyBackendTemplateWebServiceState` (currently empty — add fields here as you introduce clients/stores) and registers all router classes. Instantiated by `src/app.ts`, which builds the state and passes it in.

**`src/routers/<Name>Router/<name>-router.ts`** — Each router extends `WebRouter<GlobalState, RouterState>`. It declares a local `RouterState` (a subset of global state), a `StateConverter` function to project global → local, the URL path prefix, and the list of `WebController` subclasses.

**`src/routers/<Name>Router/controllers/<name>-controller.ts`** — Each controller extends `WebController<RouterState, ControllerState>`. It declares: `name`, `action` (URL segment appended to the router path), HTTP `method`, a `stateConverter` (usually `DefaultStateExporter`), and per-route `middleware` (e.g. a validation middleware). The request handler is returned from `getInitializedController()`.

**Never hand-edit a generated router/controller/middleware file directly** — use the MCP tools (`create_router`, `create_controller`, `create_middleware`, `update_controller_implementation`, `update_middleware_implementation`) so the generated state/request interfaces stay consistent. Use `serviceArgs`/`web-service-config.json`, not `process.env`, for configuration.

### State flow

```
SwizzyBackendTemplateWebServiceState
  └─ StateConverter → HelloRouterState
       └─ DefaultStateExporter → controller's getState()
```

### URL structure

All routes are under `/api` (set in `web-service.ts`):
- `GET /api/hello/world?name=<string>` — example route; returns `{ message: "Hello, <name>!" }`

### Testing

Tests use `node:test` + `@swizzyai/swizzy-web-service-test-framework` (which wraps supertest). Pattern:

```ts
import { createTestApp, request, assertOk, assertError } from "@swizzyai/swizzy-web-service-test-framework";
import { SwizzyBackendTemplateWebService } from "../../src/web-service.js";

before(async () => {
  ({ app } = await createTestApp((app, logger) =>
    new SwizzyBackendTemplateWebService({ port: 0, app, logger, state: {} }),
  ));
});
```

See `test/helpers/create-swizzy-backend-template-test-app.ts` for the shared factory, and pass state overrides (mocked clients, etc.) as you add dependencies.
