# MatchMap — Definición del MVP

**Versión 0.5** · 16 de octubre de 2026 · Autor: Pablo AC

Documento de producto (en español). Las reglas técnicas de obligado cumplimiento están en
`CLAUDE.md` y `.specify/memory/constitution.md`; si algo de aquí las contradice, mandan ellas.

**Stack:** web Angular 22 · móvil ng-native (Angular 22 sobre Expo SDK 57 / React Native 0.86) ·
Java 25 (LTS) + Spring Boot 4 + Spring for GraphQL · PostgreSQL 16 + PostGIS 3 · monorepo pnpm.

## 1. Problema y propuesta

Las apps de tracking de viajes actuales o son meros "rascamapas" individuales (Visited, Been) o
están pensadas para nómadas digitales (Nomad List). Ninguna resuelve bien la pregunta social:
"¿dónde hemos estado tú y yo, y a dónde podríamos ir juntos?"

MatchMap permite pinear los países y ciudades que has visitado o quieres visitar, verlos en tu
mapa del mundo y compararlo con el de tus amigos para descubrir qué compartís, qué os falta y qué
viaje podríais hacer juntos. Y si vais a viajar en grupo, MatchMap os propone destinos que ninguno
conoce, puntuados según lo que queréis vosotros y lo que han hecho viajeros con mapas parecidos a
los vuestros.

### Hipótesis que valida el MVP

A los viajeros les engancha ver su mapa, compararlo con el de sus amigos y decidir juntos el
próximo destino a partir de esa comparación.

El MVP se centra en lo visual y social, con una primera versión del recomendador para grupos
basada solo en los pines (deseo del grupo + viajeros parecidos). Los gustos explícitos (clima,
coste, playa…) llegan en la fase 2; el modelo de datos y la fórmula se diseñan para añadirlos sin
rehacer nada.

### Público objetivo

- **Principal:** viajeros de 22–40 años que viajan 2+ veces al año, con pareja o grupo de amigos,
  y que ya comparten viajes en redes.
- **Secundario:** parejas que planifican su próximo viaje juntos.
- **Terciario:** nómadas digitales que quieren cambiar de base. Sus propuestas dependen de su
  nacionalidad (qué países pueden visitar sin visado y cuánto tiempo) y de sus intereses. En el
  MVP reciben un modo individual "quiero mudarme" con filtro de visado; las señales específicas de
  nómada (visados nómada, coste de vida, internet, zona horaria) llegan en la fase 2.

### Métricas de éxito (8 semanas tras el lanzamiento)

| Métrica | Objetivo |
|---|---|
| Usuarios que pinean ≥ 5 destinos | 60 % de los registrados |
| Usuarios con ≥ 1 amigo conectado | 40 % |
| Comparaciones por usuario activo y semana | ≥ 2 |
| Usuarios que crean o se unen a un grupo de viaje | 20 % |
| Grupos que guardan al menos una propuesta como favorita | 30 % |
| Usuarios con nacionalidad informada que usan el modo "quiero mudarme" | 15 % |
| Retención D7 | ≥ 25 % |

Estas métricas se miden después del MVP: el MVP no incluye despliegue (ver §2).

## 2. Alcance

### ✅ Dentro del MVP

- **Plataformas:** app móvil (Android e iOS) y app web (Chrome y Edge).
- **Cuenta:** registro con email, username y contraseña; login; perfil; privacidad del mapa.
- **Pinear destinos** a nivel país y ciudad con tres estados: `VISITED` (visitado), `WANT_TO_GO`
  (quiero ir), `LIVED` (he vivido aquí).
- **Mapa personal** con países coloreados por estado y pines de ciudades.
- **Amigos:** buscar usuarios, enviar/aceptar/rechazar/cancelar solicitudes, eliminar amigos, ver
  el mapa de un amigo.
- **Comparar con un amigo:** en común, solo yo, solo él/ella, wishlist compartida, ideas para
  viajar juntos y % de compatibilidad.
- **Listados y estadísticas:** lista filtrable, nº de países, % del mundo, continentes, ranking de
  amigos.
- **Viajes en grupo:** crear un grupo con amigos (2–6 personas en total) y recibir propuestas de
  destinos que nadie del grupo ha visitado, ordenadas por puntuación y con su explicación.
- **Nacionalidad y visados:** nacionalidad(es) en el perfil y requisito de entrada por país (sin
  visado y días, a la llegada, ETA, eVisa, visado, sin admisión), usado para filtrar y explicar
  todas las propuestas.
- **Modo "quiero mudarme"** (nómadas): propuestas individuales de países no visitados,
  filtrables por facilidad de entrada y estancia mínima sin visado.
- **Multiidioma:** español (por defecto) e inglés desde el día 1.

### ❌ Fuera del MVP (fase 2+)

- Login social (Google / Apple).
- Gustos explícitos y matching vectorial (cuestionario de gustos + similitud del coseno sobre
  clima, coste, playa, montaña…) como tercera señal del recomendador.
- Recomendaciones a nivel ciudad (en el MVP solo países).
- Señales para nómadas: visados de nómada digital, coste de vida, velocidad de internet,
  diferencia horaria con el cliente/empresa, clima del mes, comunidad nómada; perfil de intereses
  del nómada.
- Filtro por estacionalidad mes a mes (Open-Meteo).
- Precios de vuelos (Amadeus/Skyscanner) y coste de vida (Numbeo/World Bank).
- Nivel de exploración por regiones/provincias (% de un país).
- Chat del grupo, votaciones, fechas y presupuesto del viaje, feed social, fotos, notificaciones
  push.
- Modo sin conexión (lectura del mapa desde caché y reintento de cambios al reconectar).
- Navegadores distintos de Chrome y Edge (Safari, Firefox).
- Tests end-to-end.
- **Despliegue:** ni API en la nube, ni web publicada, ni distribución en App Store / Google Play
  (tampoco betas en TestFlight o pista interna). El MVP se desarrolla y prueba en local: API y
  base de datos con Docker Compose, web en el navegador del PC, móvil en el emulador de Android o
  en un teléfono en la misma red Wi-Fi. La infraestructura se decide en una spec posterior.

## 3. Historias de usuario

Las historias se detallan con criterios de aceptación (Given/When/Then) en cada
`specs/<spec>/spec.md`. Aquí solo se fija el alcance. Salvo que se indique lo contrario, cada
historia se implementa en web y en móvil, cada una en su propia spec.

### Épica A — Cuenta

- **A1.** Como usuario quiero registrarme con email, username único y contraseña para tener mi
  mapa.
- **A2.** Quiero iniciar sesión y que la sesión se mantenga entre aperturas de la app.
- **A3.** Quiero cerrar sesión.
- **A4.** Quiero editar mi perfil: nombre visible, avatar, país de origen, nacionalidad(es) y
  privacidad del mapa (`PUBLIC` / `FRIENDS` / `PRIVATE`, por defecto `FRIENDS`).
- **A5.** Quiero exportar mis datos y borrar mi cuenta (RGPD).

### Épica B — Pinear destinos

- **B1.** Quiero tocar un país en el mapa y marcarlo como visitado, quiero ir o he vivido.
- **B2.** Quiero buscar una ciudad por nombre y añadirla con un estado.
- **B3.** Quiero añadir opcionalmente el año de visita y una nota corta (≤ 280 caracteres).
- **B4.** Quiero cambiar el estado de un pin o eliminarlo.

**Regla:** marcar una ciudad como `VISITED` o `LIVED` marca su país como `VISITED` si no lo
estaba ya (ver decisiones abiertas §10).

### Épica C — Amigos

- **C1.** Quiero buscar usuarios por username (parcial) o email (exacto).
- **C2.** Quiero enviar, aceptar, rechazar y cancelar solicitudes de amistad.
- **C3.** Quiero ver mi lista de amigos y eliminar a alguien.
- **C4.** Quiero ver el mapa de un amigo, respetando su privacidad.

### Épica D — Comparar

- **D1.** Quiero superponer mi mapa con el de un amigo con tres colores: solo yo, solo él/ella,
  ambos.
- **D2.** Quiero ver las diferencias en lista ("Has estado en 12 países donde Ana no").
- **D3.** Quiero ver la wishlist compartida: países que ambos queremos visitar.
- **D4.** Quiero ver ideas para viajar juntos: países que ninguno ha visitado y al menos uno
  quiere visitar.
- **D5.** Quiero ver un % de compatibilidad viajera.

### Épica E — Listados y estadísticas

- **E1.** Quiero ver la lista de mis destinos filtrada por estado, continente y año.
- **E2.** Quiero ver: nº de países, % del mundo, nº de ciudades y continentes visitados.
- **E3.** Quiero ver un ranking de mis amigos por nº de países visitados.

### Épica F — Viajes en grupo

- **F1.** Quiero crear un grupo de viaje con nombre e invitar a amigos (máximo 6 personas
  incluyéndome).
- **F2.** Como invitado quiero aceptar o rechazar la invitación; quiero poder salir de un grupo.
- **F3.** Como miembro quiero ver las propuestas de destino del grupo: países que ningún miembro
  ha visitado, ordenados por puntuación.
- **F4.** Quiero ver por qué se propone cada destino ("3 de vosotros queréis ir · popular entre
  viajeros con mapas como los vuestros").
- **F5.** Quiero marcar propuestas como favoritas del grupo para tener una lista corta
  compartida.
- **F6.** Las propuestas se recalculan cuando cualquier miembro cambia sus pines.

### Épica G — Nómada digital: "quiero mudarme"

- **G1.** Quiero indicar mi nacionalidad (una o varias) para que las propuestas tengan en cuenta
  si necesito visado.
- **G2.** Quiero ver en cada país mi requisito de entrada (sin visado y nº de días, a la llegada,
  ETA, eVisa, visado, sin admisión).
- **G3.** Como nómada quiero activar el modo "quiero mudarme" y recibir propuestas individuales de
  países que no he visitado, ordenadas por puntuación.
- **G4.** Quiero filtrar las propuestas por facilidad de entrada (p. ej. "solo sin visado o a la
  llegada") y por estancia mínima sin visado (p. ej. ≥ 90 días).
- **G5.** Quiero ver por qué se me propone cada país ("90 días sin visado con tu pasaporte ·
  popular entre viajeros con mapas como el tuyo").
- **G6.** En los grupos, quiero que las propuestas tengan en cuenta la nacionalidad de todos: se
  usa el requisito más restrictivo del grupo y se avisa de quién necesitaría visado.

**Aviso legal:** los requisitos de visado son orientativos; la app muestra la fecha de
actualización del dato y recomienda verificar en fuentes oficiales.

### Épica H — Idioma

- **H1.** Quiero usar la app en español o en inglés; por defecto, el idioma del dispositivo o del
  navegador (si no es ninguno de los dos, español).
- **H2.** Quiero cambiar el idioma desde ajustes.

## 4. Pantallas y navegación

| Pantalla | Contenido |
|---|---|
| Onboarding / Login / Registro | 2–3 slides de bienvenida, formularios de acceso |
| Mapa (principal) | Mapa del mundo coloreado + botón "Añadir destino" + panel al tocar un país |
| Mis destinos | Lista con filtros (estado, continente, año) y estadísticas arriba |
| Amigos | Buscador, solicitudes pendientes, lista de amigos, ranking, mis grupos de viaje |
| Grupo de viaje | Miembros, invitaciones, propuestas (lista + mapa) con puntuación y explicación, favoritas del grupo |
| Comparar | Selector de amigo → pestañas Mapa · Diferencias · Wishlist · Ideas |
| Quiero mudarme | Propuestas individuales con filtros de visado y estancia, lista + mapa, explicación y aviso de fuente |
| Perfil y ajustes | Datos de perfil, nacionalidad(es), privacidad, idioma, exportar/borrar cuenta, cerrar sesión, créditos (GeoNames, Natural Earth, mapa) |

La estructura de navegación de cada plataforma (tabs nativos en móvil; menú o barra en web) se
decide en su propia spec.

## 5. Arquitectura

Monorepo con despliegues independientes. Una sola fuente de verdad para el contrato de la API,
pero cada app se construye, testea y despliega por separado.

```
matchmap/
├── apps/api           → API Spring Boot (imagen Docker propia)
├── apps/web           → app web Angular (build estático)
├── apps/mobile        → app ng-native (iOS y Android vía EAS)
├── packages/shared    → operaciones GraphQL, tipos generados, traducciones y lógica pura (web + móvil)
├── contracts/graphql  → esquema GraphQL (schema-first)
├── infra/docker       → docker-compose para desarrollo local (PostGIS + API)
├── specs/             → una carpeta por spec (GitHub Spec Kit)
└── docs/              → este documento + ADRs
```

```
┌──────────────────────────┐   ┌──────────────────────────┐
│  App web (Angular)       │   │  App móvil (ng-native)   │
│  Apollo · SignalStore ·  │   │  Angular + Expo + Fabric │
│  MapLibre GL JS ·        │   │  Apollo · SignalStore ·  │
│  ngx-translate           │   │  MapLibre · ngx-translate│
└────────────┬─────────────┘   └────────────┬─────────────┘
             │      @matchmap/shared        │
             └──────────────┬───────────────┘
                            │ HTTPS · GraphQL
                            ▼
              ┌───────────────────────────────┐
              │  API — monolito modular       │
              │  Java 25 · Spring Boot 4      │
              │  Spring for GraphQL · JWT     │
              │  Spring Modulith (hexagonal)  │
              │  auth · users · places · pins │
              │  friends · compare · stats ·  │
              │  groups · recommendations ·   │
              │  visas                        │
              └──────────────┬────────────────┘
                             │ JPA/Hibernate Spatial · Flyway
                             ▼
              ┌───────────────────────────────┐
              │  PostgreSQL 16 + PostGIS 3    │
              │  Seed: Natural Earth (países) │
              │        GeoNames (ciudades)    │
              └───────────────────────────────┘
```

**Por qué monolito modular y no microservicios:** para un MVP con una sola persona reduce mucho
el coste operativo. Cada módulo tiene fronteras estrictas (verificadas por tests de
arquitectura), así que el futuro motor de recomendación se podrá extraer como servicio aparte sin
reescribir.

## 6. Frontend

### Móvil — ng-native

| Pieza | Elección |
|---|---|
| Framework | ng-native 0.x (alpha): Angular 22 como vistas nativas sobre React Native Fabric + Expo SDK 57. Node ≥ 22.18. Versiones fijadas exactas |
| Navegación | `@ng-native/router` (tabs y stacks nativos sobre `@angular/router`) |
| Mapa | MapLibre (`@maplibre/maplibre-react-native`), GeoJSON de países empaquetado, estilo por código ISO |
| API | `apollo-angular` sobre el HttpClient de `@ng-native/platform`; operaciones y tipos de `@matchmap/shared` |
| Estado | NgRx SignalStore por feature + caché de Apollo |
| Sesión | Access token en memoria, refresh token en `expo-secure-store` |
| i18n | `@ngx-translate`; catálogos `es.json` y `en.json` en `@matchmap/shared` |
| Builds | Development build (MapLibre no está en Expo Go): `expo run:android` en local; iOS con EAS Build |
| Calidad | Vitest + `@ng-native/testing` (TDD) · ESLint · Prettier · pnpm |

### Web — Angular

| Pieza | Elección |
|---|---|
| Framework | Angular 22 (Angular CLI), zoneless, signals |
| Navegadores | Chrome y Edge, últimas versiones estables |
| Navegación | `@angular/router` |
| Mapa | MapLibre GL JS, mismo GeoJSON de países, estilo por código ISO |
| API | `apollo-angular`; operaciones y tipos de `@matchmap/shared` |
| Estado | NgRx SignalStore por feature + caché de Apollo |
| Sesión | Access token en memoria; dónde vive el refresh token se decide en A002/W002 (decisión 20) |
| i18n | `@ngx-translate`; mismos catálogos de `@matchmap/shared` |
| Calidad | Vitest (`ng test`) · axe · ESLint · Prettier · pnpm |

Organización por feature en las dos apps: `data/` (llamadas Apollo) · `state/` (SignalStore) ·
`ui/` (componentes de presentación) · `pages/` (pantallas enrutadas).

**Mapa eficiente:** el GeoJSON de Natural Earth 1:50m simplificado (~1 MB) va dentro de cada app;
el backend solo envía pares `{countryCode, status}`. Los colores se aplican con estilos de
MapLibre sin redibujar geometrías, e incluyen un borde o patrón distinguible para personas con
daltonismo. Para el código de país se usa el campo `ISO_A2_EH` de Natural Earth, porque `ISO_A2`
vale `-99` en algunos países (Francia, Noruega, Kosovo…).

## 7. Backend — Java + GraphQL

| Pieza | Elección |
|---|---|
| Runtime | Java 25 LTS (virtual threads) |
| Framework | Spring Boot 4 (Spring Framework 7) + Spring for GraphQL + Spring Modulith 2 |
| Arquitectura | Hexagonal por módulo: domain (sin frameworks) · application (casos de uso) · infrastructure (GraphQL, JPA) |
| Seguridad | Spring Security, JWT propio (access 15 min + refresh 30 días rotatorio), BCrypt |
| Persistencia | Spring Data JPA + Hibernate Spatial; SQL nativo para la comparación y estadísticas |
| Migraciones | Flyway |
| Build | Gradle (Kotlin DSL) con version catalog |
| Calidad | JUnit 5 · AssertJ · Testcontainers (PostGIS) · ArchUnit · JaCoCo · Spotless · Checkstyle |

### Contrato GraphQL (borrador — la versión definitiva vive en `contracts/graphql/`)

Reglas: schema-first; cada mutación recibe un único `input`; los errores de negocio son tipos en
una unión (`... | ValidationError | NotFoundError`); las listas que crecen usan paginación por
cursor (Relay). Los comentarios del esquema van en inglés.

```graphql
scalar DateTime

enum PinStatus { VISITED WANT_TO_GO LIVED }
enum Privacy { PUBLIC FRIENDS PRIVATE }
enum FriendshipStatus { PENDING ACCEPTED }
enum PlaceType { COUNTRY CITY }
enum ErrorCode { VALIDATION NOT_FOUND CONFLICT FORBIDDEN_BY_PRIVACY }

interface UserError { code: ErrorCode!, message: String!, field: String }
type ValidationError implements UserError { code: ErrorCode!, message: String!, field: String }
type NotFoundError   implements UserError { code: ErrorCode!, message: String!, field: String }
type ConflictError   implements UserError { code: ErrorCode!, message: String!, field: String }
type ForbiddenError  implements UserError { code: ErrorCode!, message: String!, field: String }

type PageInfo { hasNextPage: Boolean!, endCursor: String }

type User {
  id: ID!
  username: String!
  displayName: String
  avatarUrl: String
  homeCountry: Country
  privacy: Privacy!
  stats: UserStats!
  pins(status: PinStatus, type: PlaceType, first: Int = 50, after: String): PinConnection!
}

# Private data of the signed-in user. Never exposed on User (decision 15).
type Viewer {
  user: User!
  email: String!
  nationalities: [Country!]!
}

type Country { code: ID!, name: String!, continent: String!, centroid: GeoPoint! }
type City    { id: ID!, name: String!, country: Country!, location: GeoPoint! }
type GeoPoint { lat: Float!, lng: Float! }

type Pin {
  id: ID!
  status: PinStatus!
  country: Country!
  city: City
  visitedYear: Int
  note: String
  createdAt: DateTime!
}
type PinEdge { cursor: String!, node: Pin! }
type PinConnection { edges: [PinEdge!]!, pageInfo: PageInfo!, totalCount: Int! }

type UserEdge { cursor: String!, node: User! }
type UserConnection { edges: [UserEdge!]!, pageInfo: PageInfo!, totalCount: Int! }

type UserStats {
  countriesVisited: Int!
  citiesVisited: Int!
  worldPercentage: Float!
  continentsVisited: [String!]!
}

type Friendship { id: ID!, requester: User!, addressee: User!, status: FriendshipStatus!, createdAt: DateTime! }
type FriendshipEdge { cursor: String!, node: Friendship! }
type FriendshipConnection { edges: [FriendshipEdge!]!, pageInfo: PageInfo!, totalCount: Int! }

type Comparison {
  friend: User!
  common: [Country!]!
  onlyMe: [Country!]!
  onlyFriend: [Country!]!
  sharedWishlist: [Country!]!
  tripIdeas: [Country!]!
  compatibility: Float!        # 0..100
}

type Query {
  me: Viewer!
  user(username: String!): User
  countries: [Country!]!
  searchCities(query: String!, countryCode: ID, first: Int = 20): [City!]!
  searchUsers(query: String!, first: Int = 20, after: String): UserConnection!
  friends(first: Int = 50, after: String): UserConnection!
  friendRequests(first: Int = 50, after: String): FriendshipConnection!
  compare(friendId: ID!): CompareResult!
  leaderboard(first: Int = 50, after: String): UserConnection!
  myGroups(first: Int = 20, after: String): TripGroupConnection!
  group(id: ID!): TripGroup
  entryRequirement(destination: ID!): EntryInfo        # for the signed-in user
  relocationRecommendations(filter: RecommendationFilter, first: Int = 20, after: String): RecommendationConnection!
}

# Auth
input RegisterInput { email: String!, username: String!, password: String! }
input LoginInput { email: String!, password: String! }
input RefreshInput { refreshToken: String! }               # transport on web: decision 20
input LogoutInput { refreshToken: String! }                # revokes the refresh token
type AuthSuccess { accessToken: String!, refreshToken: String!, viewer: Viewer! }
union AuthResult = AuthSuccess | ValidationError | ConflictError
type LogoutSuccess { loggedOut: Boolean! }
union LogoutResult = LogoutSuccess | ValidationError

# Account (GDPR)
input ExportMyDataInput { format: String! }                # format: decision 21
type ExportMyDataSuccess { downloadUrl: String!, expiresAt: DateTime! }
union ExportMyDataResult = ExportMyDataSuccess | ValidationError
input DeleteAccountInput { password: String! }
type DeleteAccountSuccess { deletedUserId: ID! }
union DeleteAccountResult = DeleteAccountSuccess | ValidationError

# Profile
input UpdateProfileInput { displayName: String, avatarUrl: String, homeCountry: ID, nationalities: [ID!], privacy: Privacy }
union UpdateProfileResult = Viewer | ValidationError

# Pins
input UpsertPinInput { countryCode: ID!, cityId: ID, status: PinStatus!, visitedYear: Int, note: String }
input DeletePinInput { id: ID! }
union UpsertPinResult = Pin | ValidationError | NotFoundError
type DeletePinSuccess { deletedId: ID! }
union DeletePinResult = DeletePinSuccess | NotFoundError

# Friends
input SendFriendRequestInput { userId: ID! }
input RespondFriendRequestInput { id: ID!, accept: Boolean! }
input CancelFriendRequestInput { id: ID! }
input RemoveFriendInput { userId: ID! }
union FriendshipResult = Friendship | NotFoundError | ConflictError
type CancelFriendRequestSuccess { cancelledId: ID! }
union CancelFriendRequestResult = CancelFriendRequestSuccess | NotFoundError
type RemoveFriendSuccess { userId: ID! }
union RemoveFriendResult = RemoveFriendSuccess | NotFoundError

union CompareResult = Comparison | NotFoundError | ForbiddenError

# Groups and recommendations
enum GroupMemberStatus { INVITED ACCEPTED }
type TripGroup {
  id: ID!
  name: String!
  owner: User!
  members: [GroupMember!]!                                 # at most 6
  recommendations(filter: RecommendationFilter, first: Int = 20, after: String): RecommendationConnection!
  favorites: [GroupFavorite!]!                             # short list, bounded by the catalog
}
type TripGroupEdge { cursor: String!, node: TripGroup! }
type TripGroupConnection { edges: [TripGroupEdge!]!, pageInfo: PageInfo!, totalCount: Int! }
type GroupMember { user: User!, status: GroupMemberStatus! }
type GroupFavorite { country: Country!, markedBy: User! }
enum ReasonCode { GROUP_WANTS SIMILAR_TRAVELERS_VISITED SIMILAR_TRAVELERS_WANT EASY_ENTRY LONG_VISA_FREE_STAY }
enum EntryRequirement { VISA_FREE VISA_ON_ARRIVAL ETA E_VISA VISA_REQUIRED NO_ADMISSION }
type EntryInfo {
  requirement: EntryRequirement!
  visaFreeDays: Int                   # null when not applicable or unknown
  dataUpdatedAt: DateTime!
}
type MemberEntry { user: User!, entry: EntryInfo! }
type RecommendationReason { code: ReasonCode!, count: Int! }   # the apps translate the code
type Recommendation {
  country: Country!
  score: Float!                       # 0..100
  groupDesire: Float!                 # 0..1
  similarTravelers: Float!            # 0..1
  entryEase: Float                    # 0..1, null when nobody gave a nationality
  entry: EntryInfo                    # most restrictive in the group / the user's own
  memberEntries: [MemberEntry!]!      # empty in individual mode; exposure: decision 18
  reasons: [RecommendationReason!]!
}
type RecommendationEdge { cursor: String!, node: Recommendation! }
type RecommendationConnection { edges: [RecommendationEdge!]!, pageInfo: PageInfo!, totalCount: Int! }

input RecommendationFilter { allowedRequirements: [EntryRequirement!], minVisaFreeDays: Int }

input CreateGroupInput { name: String!, memberIds: [ID!]! }
input InviteToGroupInput { groupId: ID!, userIds: [ID!]! }  # who may invite: decision 10
input RespondGroupInviteInput { groupId: ID!, accept: Boolean! }
input LeaveGroupInput { groupId: ID! }
input ToggleGroupFavoriteInput { groupId: ID!, countryCode: ID! }
union GroupResult = TripGroup | ValidationError | NotFoundError | ForbiddenError
type LeaveGroupSuccess { groupId: ID! }
union LeaveGroupResult = LeaveGroupSuccess | NotFoundError

type Mutation {
  register(input: RegisterInput!): AuthResult!
  login(input: LoginInput!): AuthResult!
  refreshToken(input: RefreshInput!): AuthResult!
  logout(input: LogoutInput!): LogoutResult!
  updateProfile(input: UpdateProfileInput!): UpdateProfileResult!
  exportMyData(input: ExportMyDataInput!): ExportMyDataResult!
  deleteAccount(input: DeleteAccountInput!): DeleteAccountResult!

  upsertPin(input: UpsertPinInput!): UpsertPinResult!
  deletePin(input: DeletePinInput!): DeletePinResult!

  sendFriendRequest(input: SendFriendRequestInput!): FriendshipResult!
  respondFriendRequest(input: RespondFriendRequestInput!): FriendshipResult!
  cancelFriendRequest(input: CancelFriendRequestInput!): CancelFriendRequestResult!
  removeFriend(input: RemoveFriendInput!): RemoveFriendResult!

  createGroup(input: CreateGroupInput!): GroupResult!
  inviteToGroup(input: InviteToGroupInput!): GroupResult!
  respondGroupInvite(input: RespondGroupInviteInput!): GroupResult!
  leaveGroup(input: LeaveGroupInput!): LeaveGroupResult!
  toggleGroupFavorite(input: ToggleGroupFavoriteInput!): GroupResult!
}
```

Errores técnicos y de autenticación van en `errors[]` con `extensions.code` (`UNAUTHENTICATED`,
`FORBIDDEN`, `INTERNAL`). Las apps muestran siempre el texto traducido a partir del `code`, nunca
el `message`. Límites activos: profundidad máx. 8 y complejidad de query.

### Lógica de comparación

Con **V(u)** = países visitados (incluye `LIVED`) y **W(u)** = países `WANT_TO_GO`:

- **En común:** V(yo) ∩ V(amigo)
- **Solo yo / solo amigo:** V(yo) − V(amigo) / V(amigo) − V(yo)
- **Wishlist compartida:** W(yo) ∩ W(amigo)
- **Ideas para viajar juntos:** (W(yo) ∪ W(amigo)) − (V(yo) ∪ V(amigo)), primero los de la
  wishlist compartida
- **Compatibilidad (Jaccard):** 100 × |V(yo) ∩ V(amigo)| / |V(yo) ∪ V(amigo)| (caso de dos mapas
  vacíos: decisión 19)

Se resuelve con una sola consulta SQL. Para dos personas, las "ideas" usan el mismo recomendador
que los grupos (ver abajo) en cuanto esté disponible.

### Recomendador de grupo (MVP)

Para un grupo G con miembros m₁…mₙ (2 ≤ n ≤ 6):

1. **Candidatos:** C = Países − ⋃ V(mᵢ) → países que ningún miembro ha visitado.
2. **Deseo del grupo** para cada destino d: deseo(d) = nº de miembros con d en `WANT_TO_GO` / n
   → 0..1
3. **Viajeros parecidos** (filtrado colaborativo usuario-usuario):
   - Para cada miembro m, se buscan los K usuarios más parecidos (fuera del grupo) con similitud
     de Jaccard sobre sus países visitados: sim(m,u) = |V(m) ∩ V(u)| / |V(m) ∪ V(u)|, exigiendo
     un mínimo de países en común para evitar ruido.
   - Afinidad de m con d: media ponderada por sim de si esos vecinos han visitado o quieren ir a
     d.
   - Se agrega a nivel de grupo con media + menor miseria:
     parecidos(d) = λ·media(afinidadₘ(d)) + (1−λ)·mín(afinidadₘ(d)), para que ningún miembro
     quede descolgado.
4. **Puntuación final:** score(d) = 100 × (a·deseo(d) + b·parecidos(d)), con a + b = 1.
   **Arranque en frío:** mientras haya pocos usuarios, b se reduce automáticamente (p. ej.
   proporcional al nº de vecinos válidos encontrados), de modo que manda el deseo del grupo.
5. **Explicación:** cada propuesta devuelve sus razones (`GROUP_WANTS`,
   `SIMILAR_TRAVELERS_VISITED`, `SIMILAR_TRAVELERS_WANT`) con un número, y las apps las traducen.

**Privacidad:** los datos de usuarios ajenos al grupo solo se usan agregados y anónimos; nunca se
revela quién es un "viajero parecido". Los usuarios con mapa `PRIVATE` no se usan como vecinos
(ver decisión abierta 13).

**Rendimiento:** cálculo en el backend (módulo `recommendations`) con SQL + caché por grupo
invalidada cuando un miembro cambia pines; objetivo < 500 ms.

**Facilidad de entrada (nacionalidad):** si los miembros han indicado nacionalidad, para cada
destino se toma, por miembro, el mejor requisito entre sus pasaportes y, para el grupo, el peor
entre miembros. Se convierte en entrada(d) 0..1 (p. ej. `VISA_FREE` = 1 … `VISA_REQUIRED` = 0,2)
y se suma a la fórmula con peso e: score = 100 × (a·deseo + b·parecidos + e·entrada).
`NO_ADMISSION` excluye el destino. Si nadie ha indicado nacionalidad, e = 0.

### Modo "quiero mudarme" (nómada, MVP)

Mismo recomendador con un "grupo" de una sola persona: candidatos = países que el usuario no ha
visitado; señales = su deseo (`WANT_TO_GO`), viajeros parecidos y facilidad de entrada con su
pasaporte; filtros por requisito y por días mínimos sin visado (`visaFreeDays ≥ N`). En el modo
nómada el peso de entrada es mayor que en los viajes de grupo.

**Fase 2:** se añade la tercera señal c·gustos(d) (similitud del coseno entre el vector de
preferencias del grupo y el vector de características del destino) y la estacionalidad mes a mes.
La fórmula ya está pensada para sumar ese término.

## 8. Datos — PostgreSQL + PostGIS

| Tabla | Contenido |
|---|---|
| `country` | Código ISO alfa-2 (`ISO_A2_EH`), nombres ES/EN, continente, centroide y geometría (Natural Earth) |
| `city` | Id GeoNames, nombre, país, población, ubicación; índice trigram para búsqueda |
| `app_user` | Email y username únicos (case-insensitive), hash de contraseña, perfil, privacidad (`FRIENDS` por defecto) |
| `pin` | Usuario, país, ciudad opcional, estado, año, nota; único por (usuario, país) sin ciudad y por (usuario, ciudad) |
| `friendship` | Solicitante, destinatario, estado; un único registro por pareja |
| `refresh_token` | Hash del token, usuario, caducidad |
| `trip_group` | Nombre, propietario, fecha de creación |
| `trip_group_member` | Grupo, usuario, estado (`INVITED`/`ACCEPTED`); máximo 6 por grupo |
| `trip_group_favorite` | Grupo, país, quién lo marcó |
| `user_nationality` | Usuario, país (una fila por pasaporte) |
| `entry_requirement` | Pasaporte, destino, requisito, días sin visado, fecha del dato; ~199 × 199 filas |

El SQL definitivo se escribe como migraciones Flyway en la spec correspondiente.

**Preparado para la fase 2 (no se crea aún):** `destination_features` (vector 0–1 de clima,
coste, playa, montaña…), `monthly_climate`, `user_preferences` (pesos), `region` (provincias).

### Datos semilla y licencias

| Fuente | Uso | Licencia |
|---|---|---|
| Natural Earth Admin 0 (1:50m) | Países y geometrías | Dominio público |
| GeoNames cities15000 | ~30 000 ciudades > 15 000 hab. | CC BY 4.0 → atribución obligatoria en las apps |
| Passport Index dataset (datos de passportindex.org) | Requisitos de entrada por pasaporte | MIT; el repo original está archivado (enero 2025) y enlaza a uno nuevo con datos desde febrero 2026 → verificar licencia y frescura del nuevo antes de usarlo |
| Tiles del mapa (MapTiler / OpenFreeMap) | Fondo del mapa | Revisar términos comerciales antes de lanzar |

## 9. Requisitos no funcionales

| Área | Requisito |
|---|---|
| Rendimiento | p95 < 300 ms en la API; mapa fluido (60 fps) con ~250 países; presupuestos según la constitución (§XIII) |
| Seguridad | BCrypt, JWT firmado, rate limiting en login, HTTPS, privacidad comprobada en el servidor en cada dato de otro usuario; constitución §XII |
| Privacidad / RGPD | Exportar y borrar cuenta, consentimiento explícito (para qué: decisión 22), datos alojados en la UE cuando se despliegue |
| Plataformas | Web: Chrome y Edge (últimas versiones estables). Móvil: iOS 15+ y Android 8+, a confirmar contra los mínimos de Expo SDK 57 |
| Accesibilidad | Constitución §VIII: WCAG 2.2 AA + contraste 7:1, zonas táctiles 44×44 y sin límites de tiempo; patrón alternativo para daltonismo; responsive y textos escalables |
| Idiomas | ES (por defecto) y EN; añadir un idioma = añadir un JSON |
| Calidad | TDD estricto; cobertura ≥ 80 % en dominio/aplicación (API), estado/lógica (web y móvil) y `packages/*`; ≥ 70 % global API |

## 10. Decisiones abiertas

Se resolverán con `/speckit-clarify` en la spec donde aplican; hasta entonces no se implementan.
La columna "Spec" usa la nomenclatura de §11.

| # | Pregunta | Spec |
|---|---|---|
| 1 | Si un país está en `WANT_TO_GO` y pineo una ciudad como `VISITED`, ¿el país pasa a `VISITED`? | A004 |
| 2 | Si borro la última ciudad visitada de un país, ¿el país sigue como `VISITED`? | A004 |
| 3 | ¿Qué cuenta como "país" para el % del mundo (195 de la ONU, o la lista de Natural Earth)? ¿Cómo se tratan territorios dependientes y países en disputa? | A003 |
| 4 | Requisitos de contraseña y de username (longitud, caracteres permitidos) | A002 |
| 5 | ¿Verificación de email en el MVP? | A002 |
| 6 | Un mapa `PUBLIC`: ¿visible para cualquier usuario registrado o también sin cuenta? | A005 |
| 7 | ¿Pueden buscarme usuarios si mi mapa es `PRIVATE`? | A006 |
| 8 | Avatar: ¿subida de imagen o solo iniciales/emoji en el MVP? | A005 |
| 9 | Paleta de colores del mapa y de la comparación | W003 / M003, W007 / M007 |
| 10 | ¿Solo se puede invitar a amigos aceptados a un grupo? ¿Quién puede invitar (solo el creador o cualquier miembro)? | A009 |
| 11 | ¿Qué pasa con el grupo si el creador sale? | A009 |
| 12 | Valores de a, b, λ, K y mínimo de países en común; umbral de usuarios para activar la señal de viajeros parecidos | A010 |
| 13 | ¿Los mapas `FRIENDS` de usuarios ajenos al grupo pueden usarse de forma anónima como vecinos? ¿Hace falta un opt-out explícito? | A010 |
| 14 | ¿Se cuentan los miembros que aún no han aceptado la invitación en el cálculo? | A010 |
| 15 | ¿La nacionalidad es visible para amigos o solo la usa el sistema? (el borrador del contrato la deja solo en `Viewer`) | A011 |
| 16 | Peso e y escala de entrada por tipo de requisito; ¿distinto en grupo y en modo nómada? | A011 |
| 17 | Frecuencia de actualización del dataset de visados y qué hacer si un dato tiene más de N meses | A011 |
| 18 | ¿Se avisa en grupo de qué miembro necesita visado (dato sensible de nacionalidad)? | A011 |
| 19 | Compatibilidad cuando los dos mapas están vacíos (división entre cero): ¿0 %, oculto, otro? | A007 |
| 20 | Web: ¿dónde vive el refresh token (cookie httpOnly o cuerpo de la respuesta)? | A002 / W002 |
| 21 | Exportación RGPD: formato (JSON, CSV…) y entrega (descarga directa, email) | A005 |
| 22 | ¿Para qué se pide consentimiento explícito (uso anónimo como vecino, analítica…)? | A005 / A010 |

## 11. Plan de entrega

**Trabajo:** Pablo + Claude, con Spec-Driven Development (GitHub Spec Kit) y rebanadas
verticales: cada spec entrega algo usable de punta a punta en su plataforma.

**Nomenclatura de specs** (carpeta `specs/<prefijo><NNN>-<nombre>` y rama del mismo nombre):

| Prefijo | Ámbito |
|---|---|
| `A` | API y contrato GraphQL (`apps/api`, `contracts/graphql`) |
| `W` | App web (`apps/web` y lo que necesite de `packages/shared`) |
| `M` | App móvil (`apps/mobile` y lo que necesite de `packages/shared`) |
| sin letra | Cambios transversales de plan o de arquitectura |

- Cada prefijo tiene su propia numeración, independiente de los demás.
- **Solo hay una spec abierta a la vez en todo el repositorio.** No se empieza otra hasta que la
  actual está fusionada en `main` vía pull request.
- Cada spec indica en "Depends on" las specs de las que depende (p. ej. W003 depende de A003).
- Web y móvil tienen specs separadas aunque repitan contenido: la accesibilidad, la navegación y
  otros detalles difieren entre plataformas.

**Orden previsto:**

| Orden | Spec | Entrega |
|---|---|---|
| 1 | A001 walking-skeleton | Docker Compose con PostGIS, API con query `health`, contrato inicial, CI de la API, logs con correlation ID |
| 2 | W001 walking-skeleton | Web que llama a `health`, i18n ES/EN, codegen en `packages/shared`, lint/format, CI web, captura de errores |
| 3 | M001 walking-skeleton | Móvil que llama a `health`, i18n ES/EN, development build, CI móvil, captura de errores. Prueba en ng-native: Apollo, SignalStore, ngx-translate y mapa MapLibre |
| 4–6 | A002 · W002 · M002 auth | Registro, login, refresh, logout, me |
| 7–9 | A003 · W003 · M003 pin-country-on-map | Catálogo de países, pinear/despinear país, mapa MapLibre coloreado |
| 10–12 | A004 · W004 · M004 city-pins | Catálogo de ciudades, búsqueda, pines de ciudad |
| 13–15 | A005 · W005 · M005 profile-privacy | Perfil, privacidad, exportar y borrar cuenta |
| 16–18 | A006 · W006 · M006 friends | Búsqueda, solicitudes, lista, mapa de un amigo |
| 19–21 | A007 · W007 · M007 compare | Mapa superpuesto, diferencias, wishlist, ideas, compatibilidad |
| 22–24 | A008 · W008 · M008 stats-and-lists | Lista filtrable, estadísticas, ranking |
| 25–27 | A009 · W009 · M009 trip-groups | Crear grupo, invitar, aceptar/rechazar, salir, ver miembros |
| 28–30 | A010 · W010 · M010 group-recommendations | Propuestas con puntuación (deseo del grupo + viajeros parecidos), explicación y favoritas |
| 31–33 | A011 · W011 · M011 nationality-and-relocation | Nacionalidad(es), dataset de visados, facilidad de entrada en grupos, modo "quiero mudarme" |

El orden y la numeración pueden cambiar con una spec transversal; los números coinciden al
principio por conveniencia, no por regla.

Cada spec pasa por: especificar → aclarar → planificar → tareas → analizar → implementar (TDD, un
commit por tarea) → PR.

## 12. Criterios de aceptación del MVP

- [ ] Un usuario nuevo puede registrarse y pinear su primer país en menos de 60 s, en web y en
      móvil.
- [ ] El mapa refleja al instante cualquier cambio de pin.
- [ ] Dos usuarios pueden hacerse amigos y comparar sus mapas.
- [ ] La comparación muestra correctamente comunes, solo-yo, solo-amigo, wishlist compartida,
      ideas y compatibilidad.
- [ ] Un mapa `PRIVATE` no lo ve nadie más; uno `FRIENDS` solo los amigos aceptados.
- [ ] Un grupo de 4 amigos recibe propuestas que no incluyen ningún país visitado por ninguno de
      ellos, cada una con su explicación.
- [ ] Ninguna propuesta revela la identidad de usuarios ajenos al grupo.
- [ ] Un usuario con pasaporte X que filtra "solo sin visado ≥ 90 días" solo recibe países que
      cumplen esa condición según el dataset, con la fecha del dato visible.
- [ ] Toda la app funciona en español y en inglés, sin textos sin traducir.
- [ ] Coberturas mínimas cumplidas y CI en verde en `main`.
- [ ] Todo el MVP funciona en local: API con Docker Compose, web en Chrome y Edge, móvil en el
      emulador de Android.

## 13. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| ng-native está en alpha; las APIs cambian entre versiones 0.x | Versiones exactas fijadas; prueba de mapa + GraphQL + estado en M001; plan B: NativeScript-Angular o Ionic/Capacitor |
| Desarrollo en Windows sin Mac | Android en emulador; iOS solo con EAS Build (development build), que requiere cuenta de Apple Developer |
| Geometrías pesadas en el móvil | GeoJSON simplificado dentro de la app; la API solo envía códigos y estados |
| Países en disputa (Kosovo, Taiwán, Sáhara Occidental…) | Criterio documentado (decisión abierta 3); usar `ISO_A2_EH` de Natural Earth |
| Arranque en frío del recomendador: pocos usuarios → "viajeros parecidos" poco fiable | El peso b crece con los datos disponibles; mientras tanto manda el deseo del grupo |
| Datos de visados desactualizados o erróneos | Fecha del dato visible, aviso legal, enlace a fuentes oficiales, actualización periódica |
| Nacionalidad como dato personal sensible | Opcional, solo en `Viewer` por defecto (decisión 15), borrable |
| Percepción de privacidad al usar mapas ajenos | Solo datos agregados y anónimos, explicado en las apps y en la política de privacidad; opt-out (decisión 13) |
| Efecto red débil: sin amigos no hay comparación | Invitación por enlace compartible; comparación contra la media de la comunidad (fase 2) |
| Coste del proveedor de tiles al crecer | Monitorizar uso; alternativa OpenFreeMap o tiles propios |
| Doble trabajo al mantener web y móvil por separado | Lógica, operaciones GraphQL y traducciones en `packages/shared`; specs separadas solo para la capa visual y de plataforma |
| Explotación comercial futura | El MVP vive en un repo público sin licencia (todos los derechos reservados) como portfolio; la versión completa irá en un repo privado aparte. Atribuciones de datos cumplidas desde el inicio |
