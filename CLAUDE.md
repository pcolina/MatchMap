# MatchMap

Monorepo con pnpm workspaces. Las dependencias se instalan siempre desde la raíz (`pnpm install`).

- `apps/mobile`: app iOS/Android con Angular Native sobre Expo. Sus reglas están en `apps/mobile/AGENTS.md`.
- `apps/web`: app web con Angular CLI (HTML y DOM normales; aquí no aplican las reglas de Angular Native).
- `packages/shared` (`@matchmap/shared`): lógica común a web y móvil (modelos, servicios, cliente de API). No puede importar nada de `@ng-native/*` ni del DOM.
- `contracts/graphql`: contrato de la API.
- `docs`, `infra/docker`, `specs`: documentación, despliegue y especificaciones de Spec Kit.

Desde la raíz: `pnpm web`, `pnpm build:web`, `pnpm mobile`, `pnpm ios`, `pnpm android`, `pnpm test` y `pnpm typecheck`.
