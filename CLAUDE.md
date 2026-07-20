# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npm run build        # Compile TypeScript (tsc → dist/)
npm run server       # Run the server after building (via swerve)
npm run dev          # Build then run immediately
```

There is no `test` script in `package.json`. Tests use Node's built-in test runner and can be run after adding one, e.g.:
```bash
node --test --experimental-strip-types 'test/**/*.spec.ts'
```

To run a single test file:
```bash
node --test --experimental-strip-types test/routers/MessageRouter/controllers/send-controller.spec.ts
```

Docker:
```bash
docker compose up    # Builds and runs; maps host 3705 → container 3005
```

## Architecture

This service is built on `@swizzyweb/swizzy-web-service`. The framework uses a three-layer hierarchy: **WebService → WebRouter → WebController**, each with its own scoped state slice.

### Layer pattern

**`src/web-service.ts`** — `SampleBackendWebService` extends `WebService`. It defines `SampleBackendWebServiceState` (the global state: clients + in-memory stores) and registers all router classes. Instantiated by `src/app.ts`, which constructs the concrete clients and wires up state.

**`src/routers/<Name>Router/<name>-router.ts`** — Each router extends `WebRouter<GlobalState, RouterState>`. It declares a local `RouterState` (a subset of global state), a `StateConverter` function to project global → local, the URL path prefix, and the list of `WebController` subclasses.

**`src/routers/<Name>Router/controllers/<name>-controller.ts`** — Each controller extends `WebController<RouterState, ControllerState>`. It declares: `name`, `action` (URL segment appended to the router path), HTTP `method`, a `stateConverter` (usually `DefaultStateExporter`), and per-route `middleware` (e.g., `json()` body parsing + a validation middleware). The request handler is returned from `getInitializedController()` and accesses state via `this.getState()`.

### State flow

```
SampleBackendWebServiceState
  └─ RouterStateConverter → ForecastRouterState / MessageRouterState / ...
       └─ DefaultStateExporter → controller's getState()
```

Clients (`IFunnyJokeClient`, `IWeatherClient`) live in `src/client/` as interface + implementation pairs — inject the interface in tests, use the real implementation in `app.ts`.

### URL structure

All routes are under `/api` (set in `web-service.ts`):
- `POST /api/forecast/hourly` — weather forecast via Open-Meteo
- `GET /api/funny/joke` — random joke via official-joke-api
- `GET /api/stats/uptime` — server uptime
- `PUT /api/message/send`, `GET /api/message/get`, `DELETE /api/message/delete` — in-memory message store

### Testing

Tests use `node:test` + `@swizzyweb/swizzy-web-service-test-framework` (which wraps supertest). Pattern:

```ts
import { createTestApp, mock, request, assertOk } from "@swizzyweb/swizzy-web-service-test-framework";

before(async () => {
  ({ app } = await createTestApp(() =>
    new SampleBackendWebService({
      port: 0,
      state: {
        someClient: mock<ISomeClient>({ someMethod: async () => result }),
      } as any,
    }),
  ));
});
```

Pass mocked clients through `state` — the service accepts `any` to allow partial mocks in tests.
