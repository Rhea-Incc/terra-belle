# Visual regression tests

Pixel-diff regression checks for the Terra Belle chapter rail on desktop
and mobile. Captures element screenshots of the floating pill, the open
chapter sheet, the desktop gear rail, and several focus / active states,
then compares each capture against a committed baseline image.

Tolerance is set to a mean per-pixel RGB diff of 0.5%. Animations and
transitions are disabled at capture time so the test surface is stable.

## Layout

```
tests/visual/
  rail.py            # the test runner
  README.md          # this file
  baselines/         # committed reference PNGs
  actual/            # last run captures (gitignored)
  diffs/             # diff images on failure (gitignored)
```

## Run

The dev server must be running on `http://localhost:8080`.

```bash
python tests/visual/rail.py            # compare against baselines
python tests/visual/rail.py --update   # rewrite baselines (after a deliberate UI change)
```

Exits non-zero when any scene drifts past tolerance and writes a
`*.diff.png` plus `*.actual.png` to `tests/visual/diffs/` so the
regression is easy to inspect.

## When to refresh baselines

Only after a deliberate visual change to the rail / pill / sheet. Review
the diff images, confirm the new look is intended, then run with
`--update` and commit the new baselines.

## Vertical pages

`verticals.py` covers `/verticals` (grid), `/verticals/web3-mrv` (hero),
the `JourneyLoop` in default / focused-next / focused-end states, and
the `PartnerApplyDialog` in empty / validation-error / success / project
scopes. It freezes CSS animations and forces `prefers-reduced-motion: reduce`
so screenshots are stable; canvas layers are hidden during capture. Runs
with the same interface:

```bash
python tests/visual/verticals.py            # compare against baselines
python tests/visual/verticals.py --update   # rewrite baselines
```

