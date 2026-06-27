"""
A11y + keyboard tests for the Terra Belle gear-indent chapter rail
and the mobile chapter navigator.

Run with: python /tmp/browser/a11y/gear-rail.py
"""
import asyncio, json, sys
from pathlib import Path
from playwright.async_api import async_playwright

AXE = Path("/tmp/browser/a11y/node_modules/axe-core/axe.min.js").read_text()
SHOTS = Path(__file__).parent / "screenshots"
SHOTS.mkdir(exist_ok=True)
URL = "http://localhost:8080/"

FAILED: list[str] = []

def check(cond: bool, label: str):
    print(("PASS" if cond else "FAIL"), "-", label)
    if not cond:
        FAILED.append(label)

async def run_axe(page, include_selector: str, label: str):
    await page.add_script_tag(content=AXE)
    result = await page.evaluate(
        """async (sel) => await window.axe.run(
            { include: [[sel]] },
            { runOnly: ['wcag2a','wcag2aa','wcag21a','wcag21aa'] }
        )""",
        include_selector,
    )
    violations = result.get("violations", [])
    if violations:
        print(f"  axe violations for {label}:")
        for v in violations:
            print(f"    - [{v['impact']}] {v['id']}: {v['help']}")
            for n in v.get("nodes", [])[:2]:
                print(f"        target={n.get('target')}")
    check(len(violations) == 0, f"axe-core clean: {label}")

async def desktop_tests(browser):
    print("\n== Desktop gear rail ==")
    ctx = await browser.new_context(viewport={"width": 1280, "height": 1800})
    page = await ctx.new_page()
    await page.goto(URL, wait_until="domcontentloaded")
    await page.wait_for_selector('nav[aria-label="Chapter progress"] button', timeout=15000)
    await page.wait_for_timeout(800)

    rail = page.locator('nav[aria-label="Chapter progress"]')
    check(await rail.count() == 1, "gear rail is rendered on desktop")

    buttons = rail.locator("ol > li > button")
    n = await buttons.count()
    check(n == 7, f"rail exposes 7 chapter buttons (got {n})")

    # Every button must have an accessible name + aria-controls
    for i in range(n):
        b = buttons.nth(i)
        name = await b.get_attribute("aria-label")
        controls = await b.get_attribute("aria-controls")
        check(bool(name) and "Chapter" in name, f"button {i+1} has descriptive aria-label")
        check(bool(controls) and await page.locator(f"#{controls}").count() == 1,
              f"button {i+1} aria-controls points at an existing section (#{controls})")

    # Exactly one aria-current=step
    current_count = await rail.locator('button[aria-current="step"]').count()
    check(current_count == 1, f"exactly one aria-current=step button (got {current_count})")

    # Live region present
    live = await rail.locator('[aria-live="polite"]').count()
    check(live >= 1, "polite live region announces active chapter")

    # Roving tabindex: only one button is tabbable
    tabbables = await rail.locator('button[tabindex="0"]').count()
    check(tabbables == 1, f"roving tabindex: exactly one tabbable button (got {tabbables})")

    # Keyboard navigation: focus first tabbable, ArrowDown should change focus
    first_tabbable = rail.locator('button[tabindex="0"]').first
    await first_tabbable.focus()
    start_label = await page.evaluate("document.activeElement?.getAttribute('aria-label')")
    await page.keyboard.press("ArrowDown")
    await page.wait_for_timeout(50)
    next_label = await page.evaluate("document.activeElement?.getAttribute('aria-label')")
    check(start_label != next_label and "Chapter" in (next_label or ""),
          "ArrowDown moves focus to next chapter button")

    await page.keyboard.press("Home")
    home_label = await page.evaluate("document.activeElement?.getAttribute('aria-label')")
    check("Chapter 1 of 7" in (home_label or ""), "Home key focuses first chapter")

    await page.keyboard.press("End")
    end_label = await page.evaluate("document.activeElement?.getAttribute('aria-label')")
    check("Chapter 7 of 7" in (end_label or ""), "End key focuses last chapter")

    # Enter activates → scrolls to section + sets aria-current
    await page.keyboard.press("Enter")
    await page.wait_for_timeout(900)
    new_current = await rail.locator('button[aria-current="step"]').first.get_attribute("aria-label")
    check("Chapter 7 of 7" in (new_current or ""), "Enter on focused chapter activates it (becomes current)")

    await page.screenshot(path=str(SHOTS / "desktop_rail.png"))
    await run_axe(page, 'nav[aria-label="Chapter progress"]', "desktop gear rail")
    await ctx.close()

async def mobile_tests(browser):
    print("\n== Mobile chapter rail ==")
    ctx = await browser.new_context(
        viewport={"width": 390, "height": 844},
        is_mobile=True, has_touch=True,
    )
    page = await ctx.new_page()
    await page.goto(URL, wait_until="domcontentloaded")
    await page.wait_for_timeout(800)

    # Desktop rail must be hidden on mobile
    desk_visible = await page.locator('nav[aria-label="Chapter progress"]').is_visible()
    check(not desk_visible, "desktop gear rail is hidden on mobile viewport")

    pill = page.locator('button[aria-controls="chapter-sheet"]')
    check(await pill.count() == 1, "mobile pill is present")
    check(await pill.is_visible(), "mobile pill is visible")

    box = await pill.bounding_box()
    check(box is not None and box["height"] >= 44, f"pill meets 44px tap target (h={box and box['height']})")

    # ARIA on pill
    expanded = await pill.get_attribute("aria-expanded")
    check(expanded == "false", "pill aria-expanded starts false")
    check("Chapter" in (await pill.get_attribute("aria-label") or ""), "pill has descriptive aria-label")

    await page.screenshot(path=str(SHOTS / "mobile_collapsed.png"))

    # Open the sheet
    await pill.click()
    await page.wait_for_selector('div[role="dialog"][aria-modal="true"]', state="visible")
    await page.wait_for_timeout(400)

    expanded_after = await pill.get_attribute("aria-expanded")
    check(expanded_after == "true", "pill aria-expanded flips true after open")

    sheet = page.locator('div[role="dialog"]#chapter-sheet')
    check(await sheet.is_visible(), "sheet renders with role=dialog aria-modal=true")
    check(await sheet.get_attribute("aria-label") is not None, "sheet has aria-label")

    chapters = sheet.locator("ol > li > button")
    n = await chapters.count()
    check(n == 7, f"sheet lists 7 chapters (got {n})")

    # Tap targets in sheet
    for i in range(n):
        b = chapters.nth(i)
        bb = await b.bounding_box()
        check(bb and bb["height"] >= 44, f"sheet button {i+1} meets 44px tap target")

    # Keyboard nav inside the sheet
    await sheet.locator("ol > li > button[aria-current=\"step\"]").first.focus()
    await page.keyboard.press("ArrowDown")
    label = await page.evaluate("document.activeElement?.getAttribute('aria-label')")
    check(label and "Chapter" in label, "ArrowDown navigates between sheet chapters")

    await page.screenshot(path=str(SHOTS / "mobile_open.png"))

    # ESC closes
    await page.keyboard.press("Escape")
    await page.wait_for_timeout(500)
    still_visible = await sheet.evaluate("el => el.getBoundingClientRect().top < window.innerHeight - 20")
    check(not still_visible, "Escape closes the sheet")

    await run_axe(page, "button[aria-controls=\"chapter-sheet\"]", "mobile pill")
    # Re-open for sheet scan
    await page.locator('button[aria-controls="chapter-sheet"]').click()
    await page.wait_for_selector('div[role="dialog"]#chapter-sheet', state="visible")
    await page.wait_for_timeout(300)
    await run_axe(page, "#chapter-sheet", "mobile chapter sheet")
    await ctx.close()

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        try:
            await desktop_tests(browser)
            await mobile_tests(browser)
        finally:
            await browser.close()
    print("\n=========================")
    if FAILED:
        print(f"FAILED: {len(FAILED)} check(s)")
        for f in FAILED: print(" -", f)
        sys.exit(1)
    print("All a11y + keyboard checks passed.")

asyncio.run(main())
