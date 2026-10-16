# CLAUDE.md: apps/api

Read the root `CLAUDE.md` and `.specify/memory/constitution.md` first.

## 1. Backend

Stack: Java 25 (toolchain), Spring Boot 4 (Spring Framework 7), Spring for GraphQL, Spring
Security (JWT: access 15 min + rotating refresh 30 days, BCrypt), Spring Data JPA + Hibernate
Spatial, Flyway, PostgreSQL 16 + PostGIS 3, Spring Modulith 2, Gradle Kotlin DSL with a version
catalog (`gradle/libs.versions.toml`). Exact versions are fixed in A001's `plan.md` and pinned in
the catalog.

Architecture: hexagonal modules inside a modular monolith (Spring Modulith).

```
apps/api/src/main/java/com/matchmap/
├── MatchmapApplication.java
├── shared/                         # cross-cutting: errors, ids, time, security utils
└── <module>/                       # auth, users, places, pins, friends, compare, stats,
    │                               # groups, recommendations, visas
    ├── domain/                     # entities, value objects, domain services, ports (interfaces)
    ├── application/                # use cases (one class per use case), DTOs, port interfaces
    └── infrastructure/
        ├── graphql/                # @Controller resolvers, @BatchMapping, input/output mappers
        ├── persistence/            # JPA entities, Spring Data repos, adapters implementing ports
        └── config/
```

- `domain` has no Spring, JPA, Jackson or GraphQL imports. ArchUnit and Spring Modulith tests
  enforce this.
- Modules talk to each other only through application ports or Spring Modulith events. They never
  use another module's `domain` or `infrastructure` packages.
- JPA entities never leave `infrastructure.persistence`. They are mapped to domain models in
  adapters.
- Complex reads (the compare sets, stats) use native SQL in a persistence adapter, with a test
  against a real PostGIS (Testcontainers).
- Use cases are `@Transactional` at the application layer. Resolvers contain no business logic.
- Use `@BatchMapping`/DataLoader for every nested field that loads data. N+1 is a bug.
- IDs are UUIDs (`gen_random_uuid()`). Times are `Instant`/`timestamptz` in UTC.
- Flyway migrations live in `src/main/resources/db/migration/V<NNN>__<snake_description>.sql`.
  Applied migrations are immutable.
- Every request carries a correlation ID, propagated to every log line. Logs are structured and
  never contain personal data, tokens or secrets.

Testing (TDD):

- Domain: plain JUnit 5 + AssertJ, no Spring context.
- Application: JUnit 5 with in-memory fakes of the ports (prefer fakes over Mockito).
- Persistence and GraphQL: `@SpringBootTest` + Testcontainers (`postgis/postgis` image) +
  `HttpGraphQlTester`.
- Architecture: ArchUnit + `ApplicationModules.verify()`.
- Coverage (JaCoCo, enforced by `check`): ≥ 80 % lines on domain + application, ≥ 70 % overall.
- Test names follow `methodOrBehaviour_condition_expectedResult` or `@DisplayName` in plain
  English.

Style: Spotless with google-java-format, plus Checkstyle. Prefer records for DTOs and value
objects. No Lombok. No field injection: constructor injection only. Keep `Optional` out of fields
and parameters.

## 2. API contract (`contracts/graphql/`)

- `*.graphqls` files are the source of truth, one file per module (`pins.graphqls`,
  `friends.graphqls`, …) plus `common.graphqls`.
- Errors:
  - Business errors are typed unions in the mutation payload, for example
    `union UpsertPinResult = UpsertPinSuccess | ValidationError | NotFoundError`. Every error type
    implements `interface UserError { code: ErrorCode!, message: String!, field: String }`.
  - Technical and auth errors go in `errors[]` with `extensions.code` (`UNAUTHENTICATED`,
    `FORBIDDEN`, `INTERNAL`).
  - `message` is an English developer message. Web and mobile show translated text from `code`,
    never `message`.
- Pagination: every list that can grow (user search, friends, pins, leaderboard) is a Relay
  connection: `XConnection { edges { cursor node } pageInfo { hasNextPage endCursor } totalCount }`
  with `first`/`after`. Fixed catalogs (countries) may return plain lists.
- Naming: types in PascalCase, fields in camelCase, enums in SCREAMING_SNAKE. Mutations are verbs
  (`upsertPin`, `sendFriendRequest`). Every mutation takes a single `input:` argument.
- Breaking changes need the user's explicit approval in `plan.md`.
- Enable query depth (max 8) and complexity limits.
- Privacy is enforced in the backend for every field that exposes another user's data. Never rely
  on the client.
