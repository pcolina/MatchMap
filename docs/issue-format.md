# Issue format (front and back)

Every issue uses this structure, in this order. Issues live on GitHub only, not as local files. Technical text is in English (`CLAUDE.md` §2).

## Where each issue goes

- **Backend** issues go to `pcolina/matchMap-api`.
- **Frontend and mobile** issues go to the client repository (`pcolina/MatchMap`, as the README names it).

## Title and labels

- Title: a short imperative or noun phrase, with the area in brackets at the end: `(backend)`, `(web)` or `(mobile)`. For example `Enforce password complexity on registration (backend)`.
- Priority label: `P1`, `P2` or `P3`. `P1` is for issues that block a client task or a security requirement. `P2` is needed soon. `P3` is later or superseded.
- When an issue is superseded, say so in the title or the Summary, and point to the issue that replaces it.

## Sections

1. **Summary.** Two or three sentences: what must change and why it matters for the product. Say whether it is a feature, a bug or a compliance requirement.
2. **Note.** Scope and sequencing: priority, the spec or change it belongs to (for example `openspec/changes/add-login-page/`), and the issues it depends on or supersedes, written as `#N`. If nothing applies, write `None.`
3. **User stories.** One bullet per user, in the form `As a <role>, I want <goal>, so <reason>.`
4. **Proposed flow.** The entry points, the steps, the response, and any caching or audit step. Numbered where the order matters.
5. **Privacy, security and store rules (hard requirements).** Only what is mandatory: what must never be logged or returned, what must stay server-side, rate limits, data retention, and legal or store-review obligations. Write `None beyond the defaults in CLAUDE.md.` if there are none.
6. **Technical notes.** Contract changes (schema-first, `contracts/graphql/` or `contracts/openapi/`), data changes (Flyway migrations, new tables), libraries and algorithms, performance targets, and i18n keys. Never edit an applied Flyway migration.
7. **Success metrics.** A table with `Metric` and `Target` columns. Use `monitor, no target` or `define` when there is no number yet.

Optional, after the sections, when they apply:

- **Open questions.** Only questions that must be answered before implementing.
- **Acceptance.** Concrete checks that map to automated tests.

## Rules

- Do not implement an issue until its spec is approved, if the Note says so.
- Do not put the matched word, the raw candidate or the normalisation steps in error messages or logs.
- Do not ship blocklists or rules that the mobile or web client would duplicate. The client only renders the error code.
- Refer to other issues by their GitHub number (`#N`), never by a local file name.
- Once an issue exists on GitHub, the GitHub issue is the only copy. Edit it there.
