# MoveSmart

MoveSmart is a mobile moving companion that turns planning, packing, delivery access, and move-in protection into clear next steps.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/movesmart/app/(tabs)/index.tsx` — move overview, route snapshot, survival kit, and AI entry points
- `artifacts/movesmart/app/(tabs)/stuff.tsx` — inventory decisions, photos, and sell descriptions
- `artifacts/movesmart/app/(tabs)/boxes.tsx` — box weight guidance and Packing → Loaded → Sealed progression
- `artifacts/movesmart/app/(tabs)/tasks.tsx` — color-coded priority tasks and snooze/complete actions
- `artifacts/movesmart/app/(tabs)/settle.tsx` — move-in checklist, inspection photos, and condition log
- `artifacts/movesmart/app/scan.tsx` and `app/chat.tsx` — Gemini room planning and context-aware assistant
- `artifacts/movesmart/context/MoveContext.tsx` — AsyncStorage-backed local move state
- `artifacts/api-server/src/routes/gemini.ts` — Gemini room scan and assistant endpoints
- `lib/api-spec/openapi.yaml` — source-of-truth API contract for AI endpoints

## Architecture decisions

- The first release is local-first: move state persists with AsyncStorage so the core app works without an account or database.
- Native Expo capabilities are used for inventory photos and move-in inspection photos.
- AI calls run through the shared Express API server so the Gemini key never ships to the mobile bundle.
- Box status is derived from each box record and updated independently, preventing the summary count from drifting from the visible state.

## Product

- Active move snapshot with next-step guidance and a clear route/access map
- Inventory workflows for move, sell, donate, and later decisions
- Color-coded boxes with light, medium, and heavy weight guidance
- Packing, loading, and sealing status progression
- High, medium, and low priority tasks
- First-night survival kit categories for tech, clothes, documents, and care
- Gemini-powered room scan/layout suggestions and a context-aware assistant
- Furnishing mode, elevator access, duplicate furniture guidance, and move-in condition logging

## User preferences

 - Keep the interface colorful, friendly, and useful on a phone.
 - Make important statuses visually explicit rather than relying on dense text.

## Gotchas

- `GEMINI_API_KEY` is a Replit Secret used only by the API server for AI features.
- Expo camera/gallery features require permission on a physical device; the app shows a clear error when access is denied.
- Run `pnpm run typecheck` after changes to shared API types or the mobile screens.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
