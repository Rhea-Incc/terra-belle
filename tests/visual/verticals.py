"""
Visual regression tests for the Terra Belle vertical pages.

Covers:
  - /verticals grid + filters
  - /verticals/<slug> hero band
  - JourneyLoop default, focused-neighbour, and after keyboard advance
  - PartnerApplyDialog opened at vertical level (form + error state + success)
  - PartnerApplyDialog opened at project level

All captures freeze CSS animations / transitions and force
prefers-reduced-motion so screenshots are stable across runs.

Workflow mirrors tests/visual/rail.py:
    python tests/visual/verticals.py            # compare vs baseline
    python tests/visual/verticals.py --update   # rewrite baselines

Dev server must be running at http://localhost:8080.
"""
import asyncio, sys
from pathlib import Path
from PIL import Image, ImageChops
from playwright.async_api import async_playwright, Page

HERE = Path(__file__).parent
BASELINES = HERE / "baselines"
DIFFS = HERE / "diffs"
ACTUAL = HERE / "actual"
for p in (BASELINES, DIFFS, ACTUAL):
    p.mkdir(exist_ok=True)

BASE = "http://localhost:8080"
TOLERANCE = 0.008  # verticals pages carry gradients/glow → allow 0.8%
UPDATE = "--update" in sys.argv
FAILED: list[str] = []

FREEZE_CSS = """
    *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        caret-color: transparent !important;
    }
    /* keep decorative canvas fields from bleeding non-determinism into hero
       screenshots. */
    canvas { visibility: hidden !important; }
"""

REDUCE_MOTION_INIT = (
    "() => { try {"
    "  const _mm = window.matchMedia;"
    "  window.matchMedia = (q) => {"
    "    const m = _mm ? _mm(q) : { matches:false, media:q };"
    "    return { ...m, matches: q.includes('reduce') ? true : m.matches,"
    "      addEventListener(){}, removeEventListener(){},"
    "      addListener(){}, removeListener(){} };"
    "  };"
    "} catch(e) {} }"
)


def diff_ratio(a: Image.Image, b: Image.Image) -> float:
    if a.size != b.size:
        b = b.resize(a.size)
    a = a.convert("RGB")
    b = b.convert("RGB")
    d = ImageChops.difference(a, b)
    px = list(d.getdata())
    total = sum(r + g + bl for r, g, bl in px)
    max_total = len(px) * 3 * 255
    return total / max_total if max_total else 0.0


def compare(name: str, capture_path: Path) -> None:
    baseline = BASELINES / f"{name}.png"
    if UPDATE or not baseline.exists():
        capture_path.replace(baseline)
        print(f"BASE - wrote baseline for {name}")
        return
    actual = Image.open(capture_path)
    base = Image.open(baseline)
    ratio = diff_ratio(base, actual)
    if ratio <= TOLERANCE:
        print(f"PASS - {name} (diff={ratio:.4%})")
    else:
        d = ImageChops.difference(
            base.convert("RGB"),
            actual.convert("RGB").resize(base.size),
        )
        d.save(DIFFS / f"{name}.diff.png")
        actual.save(DIFFS / f"{name}.actual.png")
        print(f"FAIL - {name} drift={ratio:.4%} (>{TOLERANCE:.2%})")
        FAILED.append(name)


async def prep_page(ctx, url: str) -> Page:
    page = await ctx.new_page()
    await page.add_init_script(REDUCE_MOTION_INIT)
    await page.goto(url, wait_until="domcontentloaded")
    await page.add_style_tag(content=FREEZE_CSS)
    return page


async def cap(loc, name: str) -> Path:
    out = ACTUAL / f"{name}.png"
    await loc.screenshot(path=str(out))
    return out


async def verticals_scenes(browser):
    print("\n== Verticals (desktop) ==")
    ctx = await browser.new_context(viewport={"width": 1280, "height": 1800})

    # ---- Grid + filters ----
    page = await prep_page(ctx, f"{BASE}/verticals")
    await page.wait_for_selector("main", timeout=15000)
    await page.wait_for_timeout(400)
    grid = page.locator("main")
    compare("verticals_grid_default", await cap(grid, "verticals_grid_default"))

    # ---- Detail: web3-mrv ----
    page = await prep_page(ctx, f"{BASE}/verticals/web3-mrv")
    await page.wait_for_selector('section[aria-label="Journey through connected verticals"]',
                                 timeout=15000)
    await page.wait_for_load_state("networkidle")
    await page.wait_for_timeout(1200)

    # Hero band — scroll to top and lock layout before capture
    await page.evaluate("window.scrollTo(0,0)")
    await page.wait_for_timeout(400)
    hero = page.locator('[id="hero-web3-mrv"]')
    await hero.scroll_into_view_if_needed()
    await page.wait_for_timeout(400)
    compare("vertical_hero_web3", await cap(hero, "vertical_hero_web3"))

    # JourneyLoop default
    loop = page.locator('section[aria-label="Journey through connected verticals"]')
    await loop.scroll_into_view_if_needed()
    await page.wait_for_timeout(200)
    compare("journey_loop_default", await cap(loop, "journey_loop_default"))

    # JourneyLoop after ArrowRight (roving focus moves to next node)
    first_node = loop.locator('a[data-loop-node]').first
    await first_node.focus()
    await page.keyboard.press("ArrowRight")
    await page.wait_for_timeout(150)
    compare("journey_loop_focus_next", await cap(loop, "journey_loop_focus_next"))

    # JourneyLoop after End key (focus jumps to last node)
    await page.keyboard.press("End")
    await page.wait_for_timeout(150)
    compare("journey_loop_focus_end", await cap(loop, "journey_loop_focus_end"))

    # ---- Partner apply dialog — vertical level ----
    partner_btn = page.get_by_role("button", name="Partner at vertical level")
    await partner_btn.scroll_into_view_if_needed()
    await partner_btn.click()
    dialog = page.locator('div[role="dialog"]#partner-apply-dialog')
    await dialog.wait_for(state="visible")
    await page.wait_for_timeout(300)
    compare("partner_dialog_vertical_empty",
            await cap(dialog, "partner_dialog_vertical_empty"))

    # Trigger validation errors
    await dialog.get_by_role("button", name="Send application").click()
    await page.wait_for_timeout(200)
    compare("partner_dialog_vertical_errors",
            await cap(dialog, "partner_dialog_vertical_errors"))

    # Fill valid values and submit → success state
    await dialog.locator("#pa-name").fill("Ada Lovelace")
    await dialog.locator("#pa-org").fill("Analytical Engines Ltd")
    await dialog.locator("#pa-email").fill("ada@example.org")
    await dialog.locator("#pa-role").fill("Director of Research")
    await dialog.get_by_role("radio", name="Research").click()
    await dialog.locator("#pa-msg").fill(
        "We would like to contribute measurement instrumentation and open datasets."
    )
    # Consent checkbox
    await dialog.locator('input[type="checkbox"]').check()
    await dialog.get_by_role("button", name="Send application").click()
    # wait for success node
    await dialog.locator("[data-partner-success]").wait_for(state="visible", timeout=5000)
    await page.wait_for_timeout(300)
    compare("partner_dialog_vertical_success",
            await cap(dialog, "partner_dialog_vertical_success"))

    # Close and open a project-level flow
    await dialog.get_by_role("button", name="Close", exact=True).click()
    await dialog.wait_for(state="hidden")

    project_btn = page.get_by_role("button", name="Partner on this project").first
    await project_btn.scroll_into_view_if_needed()
    await project_btn.click()
    dialog = page.locator('div[role="dialog"]#partner-apply-dialog')
    await dialog.wait_for(state="visible")
    await page.wait_for_timeout(300)
    compare("partner_dialog_project_empty",
            await cap(dialog, "partner_dialog_project_empty"))

    await ctx.close()


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        try:
            await verticals_scenes(browser)
        finally:
            await browser.close()

    print("\n=========================")
    if FAILED:
        print(f"FAILED: {len(FAILED)} scene(s)")
        for f in FAILED:
            print(" -", f)
        print(f"Diffs written to {DIFFS}")
        sys.exit(1)
    print("All vertical visual regression scenes within tolerance.")


asyncio.run(main())
