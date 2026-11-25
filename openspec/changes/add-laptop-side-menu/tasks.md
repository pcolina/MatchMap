# Tasks: add-laptop-side-menu

Each task names its failing test first. One task is one commit, with `Task: x.x` in the body.

## 1. Side menu component

- [ ] **1.1 Menu tests.** In `apps/web/src/app/shared/side-menu/side-menu.spec.ts`: a `nav` with the accessible name `map.sideMenu.label` holds two buttons named `map.controls.addPlace` and `map.controls.friends` in that order, then a skip link named `map.sideMenu.skip`. Pressing an item emits its output. The add place icon uses the accent colour and the friends icon uses `textSecondary`. Run them and show the failure.
- [ ] **1.2 Menu component.** Create `SideMenu` with the template and styles that make 1.1 pass.

## 2. Laptop layout

- [ ] **2.1 Layout tests.** In `main-layout.spec.ts`: the side menu is a child of the layout directly after the header; the stylesheet hides the menu below 601 px and offsets the layout by 200 px from 601 px. Run them and show the failure.
- [ ] **2.2 Layout.** Add the menu to `main-layout.ts` and the rules to `main-layout.css`. Make 2.1 pass.

## 3. Styles and accessibility

- [ ] **3.1 Focus and hover tests.** In `side-menu.spec.ts`, the stylesheet has the header focus ring rule and the hover rule inside `(hover: hover) and (pointer: fine)`. Run them and show the failure.
- [ ] **3.2 Focus and hover.** Add the rules. Make 3.1 pass.

## 4. Translations

- [ ] **4.1 Keys.** Add `map.sideMenu.label` ("Main menu" / "Menú principal") and `map.sideMenu.skip` ("Skip menu" / "Saltar menú") to `en.json` and `es.json`. Listed under "Translations to review".

## 5. Full check

- [ ] **5.1 Full check.** `pnpm check` and `pnpm build:web`.
- [ ] **5.2 Browser review.** Owner checks the menu in Chrome at laptop width, with Tab, and at phone width.

## Translations to review (for the PR)

- `map.sideMenu.label`: en "Main menu", es "Menú principal".
- `map.sideMenu.skip`: en "Skip menu", es "Saltar menú".
