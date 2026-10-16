# MatchMap

Monorepo de **MatchMap**: aplicación web y aplicación móvil nativa (iOS y Android), ambas escritas en **Angular 22** y compartiendo la lógica de negocio.

| App | Tecnología | Resultado |
|---|---|---|
| `apps/web` | Angular CLI | Web estática que se despliega en cualquier servidor |
| `apps/mobile` | [Angular Native](https://ng-native.com) sobre Expo / React Native | Apps nativas para App Store y Google Play |
| `packages/shared` | TypeScript | Modelos, servicios y cliente de API comunes a las dos |

Las dos apps usan Angular con signals y sin zone.js, así que se programan igual. Lo que cambia es la capa visual: la web pinta HTML (`<div>`, `<button>`) y el móvil pinta vistas nativas (`<view>`, `<text>`, `<pressable>`).

---

## Estructura

```
matchmap/
├── apps/
│   ├── web/                 # App web (Angular CLI)
│   └── mobile/              # App iOS/Android (Angular Native + Expo)
├── packages/
│   └── shared/              # @matchmap/shared: lógica común
├── contracts/
│   └── graphql/             # Contrato de la API
├── docs/                    # Documentación del proyecto
├── infra/
│   └── docker/              # Contenedores y despliegue
├── specs/                   # Especificaciones (Spec Kit)
├── package.json             # Raíz del workspace de pnpm
└── CLAUDE.md                # Contexto para agentes de IA
```

El repositorio usa **pnpm workspaces** (`pnpm-workspace.yaml`): hay un único `node_modules` y un único `pnpm-lock.yaml`, ambos en la raíz, y las dos apps comparten la misma copia de Angular.

---

## Requisitos

| Herramienta | Versión | Para qué |
|---|---|---|
| [Node.js](https://nodejs.org) | 22 LTS o superior | Todo |
| [pnpm](https://pnpm.io) | 11 o superior | Gestión de dependencias (`npm install -g pnpm` o `corepack enable`) |
| [Android Studio](https://developer.android.com/studio) | Última | Emulador de Android y Android SDK |
| [Expo Go](https://expo.dev/go) | Compatible con Expo SDK 57 | Probar la app móvil en un teléfono real |
| Xcode | Última, solo macOS | Simulador de iOS |

Para la web basta con Node.js. Para la app móvil necesitas además un emulador (o un teléfono real con Expo Go).

---

## Configurar el emulador de Android

La app móvil se prueba en un emulador de Android que se crea con Android Studio. Solo hay que hacerlo una vez.

### 1. Instalar Android Studio

1. Descárgalo de https://developer.android.com/studio e instálalo con las opciones por defecto.
2. Ábrelo y completa el asistente inicial (**Standard**). Se descargarán el Android SDK, las herramientas de plataforma (`adb`) y el emulador.

### 2. Comprobar el SDK

En **Settings → Languages & Frameworks → Android SDK**:

- **SDK Platforms:** marca la versión más reciente de Android (API 35 o superior).
- **SDK Tools:** marca **Android SDK Build-Tools**, **Android SDK Platform-Tools** y **Android Emulator**.

Apunta la ruta que aparece en **Android SDK Location**. En Windows suele ser `C:\Users\<usuario>\AppData\Local\Android\Sdk`.

### 3. Variables de entorno (Windows)

Expo necesita encontrar el SDK y `adb`. En **Configuración del sistema → Variables de entorno**, dentro de las variables de usuario:

1. Crea `ANDROID_HOME` con la ruta del SDK, por ejemplo `C:\Users\<usuario>\AppData\Local\Android\Sdk`.
2. Añade al `Path` estas dos entradas:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\emulator`

Abre una terminal nueva y comprueba que funciona:

```sh
adb --version
emulator -list-avds
```

### 4. Crear el dispositivo virtual

1. En Android Studio, abre **Device Manager** (en la pantalla de bienvenida, **More Actions → Virtual Device Manager**).
2. Pulsa **Create Virtual Device** (o el botón **+**).
3. **Hardware:** elige un teléfono **Pixel** reciente, por ejemplo Pixel 8.
4. **System image:** elige una imagen con **API 35 o superior** y ABI **x86_64** (en Mac con Apple Silicon, **arm64-v8a**). Si aparece un icono de descarga, pulsa para bajarla.
5. Deja el resto por defecto y pulsa **Finish**.

> Evita las imágenes de 32 bits (`x86`) y las versiones antiguas de Android. Las versiones recientes de Expo y React Native están pensadas para 64 bits.

### 5. Arrancar la app en el emulador

```sh
pnpm android
```

Expo enciende el emulador, instala Expo Go y abre la app. Si el emulador tarda en arrancar y se queda en la pantalla de inicio, pulsa **`a`** en la terminal de Metro cuando ya esté encendido.

Para que sea más rápido, puedes encender el emulador antes desde **Device Manager** (botón ▶).

### Problemas habituales

| Síntoma | Solución |
|---|---|
| El emulador se abre pero no aparece la app | Espera a que termine de arrancar y pulsa `a` en la terminal de Metro |
| `adb` no se reconoce como comando | Revisa `ANDROID_HOME` y el `Path`, y abre una terminal nueva |
| El emulador va muy lento | Usa una imagen `x86_64` y comprueba que la virtualización por hardware está activada en la BIOS |
| La app no conecta con Metro | Cierra Metro y vuelve a lanzar `pnpm android` |

---

## Puesta en marcha

### 1. Instalar dependencias

Siempre desde la **raíz** del repositorio, nunca dentro de una app:

```sh
git clone <url-del-repositorio> matchmap
cd matchmap
pnpm install
```

### 2. Arrancar la web

```sh
pnpm web
```

Abre http://localhost:4300. Se recarga sola al guardar cambios.

### 3. Arrancar la app móvil

```sh
pnpm mobile
```

Arranca Metro y muestra un código QR:

- **En tu teléfono:** escanea el QR con Expo Go (Android) o con la cámara (iOS). El teléfono y el ordenador deben estar en la misma red.
- **En un emulador:** pulsa `a` para Android o `i` para iOS.

También puedes abrir el emulador directamente con `pnpm android` o `pnpm ios`.

---

## Comandos

Todos se ejecutan desde la raíz.

| Comando | Qué hace |
|---|---|
| `pnpm web` | Servidor de desarrollo de la web |
| `pnpm build:web` | Build de producción de la web en `apps/web/dist/web` |
| `pnpm mobile` | Metro para la app móvil (QR para Expo Go) |
| `pnpm android` | App móvil en el emulador de Android |
| `pnpm ios` | App móvil en el simulador de iOS |
| `pnpm test` | Tests de todos los workspaces (Vitest) |
| `pnpm typecheck` | Comprobación de tipos y plantillas de la app móvil |

Para lanzar un script de un solo workspace:

```sh
pnpm --filter @matchmap/web <script>
pnpm --filter @matchmap/mobile <script>
```

---

## Código compartido

Todo lo que no pinta nada en pantalla va en `packages/shared` y se importa igual desde las dos apps:

```ts
import { ... } from '@matchmap/shared';
```

**Regla:** `@matchmap/shared` no puede depender del DOM (`document`, `window`) ni de `@ng-native/*`. Si algo solo funciona en una plataforma, va en su app.

| Va en `packages/shared` | Va en cada app |
|---|---|
| Modelos y tipos | Componentes y plantillas |
| Servicios con signals | Estilos |
| Cliente de API y consultas GraphQL | Configuración del router |
| Validaciones y reglas de negocio | Acceso a funciones del dispositivo |
| Utilidades (fechas, formatos) | Providers de plataforma (HTTP, etc.) |

---

## Tests

```sh
pnpm test
```

- **Web:** Vitest con jsdom, mediante `ng test`.
- **Móvil:** Vitest con `@ng-native/testing`. Se ejecuta en Node sobre una capa nativa simulada, así que no hace falta simulador ni dispositivo.

Cada cambio debería ir acompañado de su test.

---

## Despliegue

### Web

```sh
pnpm build:web
```

Genera archivos estáticos en `apps/web/dist/web/browser`. Se pueden servir con cualquier servidor web (Nginx, Apache, un contenedor Docker en `infra/docker`) o subir a un hosting estático. El servidor debe redirigir todas las rutas a `index.html` para que funcione el router de Angular.

### Móvil

Las builds de producción y la publicación en las tiendas se hacen con [EAS](https://docs.expo.dev/build/introduction/). Los pasos completos están en la [guía de despliegue de Angular Native](https://ng-native.com/guide/deployment).

---

## Desarrollo guiado por especificaciones

El proyecto usa [Spec Kit](https://github.com/github/spec-kit). Las especificaciones de cada funcionalidad se guardan en `specs/`, y desde Claude Code se trabaja con los comandos `/speckit-*`.

---

## Documentación de referencia

- [Angular](https://angular.dev)
- [Angular Native](https://ng-native.com): reglas específicas en [`apps/mobile/AGENTS.md`](apps/mobile/AGENTS.md)
- [Expo](https://docs.expo.dev)

## Licencia

[MIT](LICENSE)
