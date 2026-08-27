# @swizzyweb/swizzy-backend-template-web-service

Minimal starting point for a swizzyweb backend service. It ships with a single
example route (`GET /api/hello/world?name=...`) that demonstrates the
router/controller/middleware pattern — delete it once you've added your own.

## Web service

The Swizzy web service logic lives in `src/`. Use the `swizzy-ai-skill` MCP
tools (`create_router`, `create_controller`, `create_middleware`) to extend it
rather than hand-editing generated files.

## Running

### Install

```sh
npm install
```

### Build and run immediately

```sh
npm run dev
```

### Only build

```sh
npm run build
```

### Running server after build

```sh
npm run server
```

### With swerve

After building, you can also just run `swerve` in the root directory.

## Testing

```sh
npm test
```

Uses `node:test` + `@swizzyai/swizzy-web-service-test-framework`. See
`test/routers/HelloRouter/controllers/world-controller.spec.ts` for the pattern.

## Docker

```sh
docker compose up
```

Builds and runs the service, mapping host port 3705 to container port 3005.

The container's `entrypoint.sh` does **not** read `web-service-config.local.json`
(that file is for local dev only, via `npm run server`/`npm run dev`). Instead it
runs `swizzy-service-config-gen` to build a config from environment variables —
`PORT`/`DEFAULT_PORT` for the listen port and `SERVICES_CONFIG_JSON` (a JSON object
of this service's `serviceArgs`) for everything else — then starts `swerve` against
that generated config. This is the same pattern every real deployed service in this
platform uses so `wuvable-cdk`-injected config/secrets reach the container; see
`@swizzyweb/swizzy-service-config-gen`'s own README for the full env var contract.
