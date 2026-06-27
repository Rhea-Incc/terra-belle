# A11y + keyboard tests

Headless Playwright + axe-core checks for the Terra Belle chapter rail
(desktop gear-indent rail and the mobile bottom-sheet navigator).

Covers:

- 7 chapter buttons exist, each with descriptive `aria-label` and
  `aria-controls` pointing at an existing section.
- Exactly one `aria-current="step"` button at a time.
- Polite `aria-live` region announces the active chapter.
- Roving `tabindex` (only one tabbable button).
- Keyboard navigation: ArrowDown / Home / End / Enter.
- Mobile: desktop rail is hidden, floating pill is visible with 44px tap target,
  `aria-expanded` toggles, sheet is a focus-trapped `role="dialog"`,
  every sheet item is 44px+, ArrowDown navigates, Escape closes.
- axe-core (WCAG 2.1 AA) scan of the desktop rail, the mobile pill, and
  the open mobile sheet.

## Run

The dev server must be running on `http://localhost:8080`.

```bash
# one-time: install axe-core anywhere on disk
mkdir -p /tmp/browser/a11y && (cd /tmp/browser/a11y && npm init -y && npm install axe-core)

# run the tests
python tests/a11y/gear-rail.py
```

Exits non-zero if any check fails. Screenshots land in
`tests/a11y/screenshots/` (or `/tmp/browser/a11y/screenshots/` when run
from the standalone copy).
