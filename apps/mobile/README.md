# My Angular Native app

An Angular app rendering real native views, created from `@ng-native/template`.

```sh
pnpm start          # Metro; scan the QR code with Expo Go, or press i / a for a simulator
pnpm ios        # straight to the iOS simulator
pnpm android    # straight to the Android emulator
pnpm test           # the example test in src/app/app.test.ts, in Node with no simulator
pnpm typecheck
```

`src/app/app.ts` is the root component and `src/main.ts` mounts it. Expo Go is enough for development; a
release build or a native module Expo Go does not include needs a development build
(`npx expo run:ios`).

The app targets iOS and Android, so `pnpm web`, which `create-expo-app` suggests as it finishes,
only says so and exits. Angular Native components can also render in a browser, set up as
https://ng-native.com/packages/web#beside-a-native-app describes.

`AGENTS.md` tells a coding agent how this framework differs from the web Angular it knows
(Claude Code reads it through `CLAUDE.md`). Add your own conventions to it as the app grows.

Docs: https://ng-native.com
