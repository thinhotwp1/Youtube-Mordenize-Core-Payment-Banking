# Series Background: JO · Core Banking Payments Modernization

One beige background image, reused for every episode in this series.
The deck draws the header (with the JO logo), the panels, the footer, the text and the emoji **on top of** this image.
So the image must contain **no text, no logos and no UI boxes**. It only gives the paper, the warmth and a quiet decorated border.

## Brand palette

| Role | Color |
|---|---|
| Paper (base) | `#F3ECDF` → `#E7DBC5` |
| Ink (JO logo, text, step tags) | `#222530` |
| Accent: new platform | `#0F7F77` (deep teal) |
| Accent: risk | `#C9661E` (burnt orange) |
| Highlight (step numbers) | `#E8B931` (mustard) |

## Layout the image must respect (1920 × 1080 base; export at 3840 × 2160)

| Zone | Pixels (1920 × 1080) | What goes there | Background detail |
|---|---|---|---|
| Header bar | x 32–1888, y 20–104 | JO logo, series title, Part 1–6 tracker | Low |
| Left panel (diagram) | x 32–1352, y 116–1000 | Diagram + demo bar | **Very low**: plain paper |
| Right panel (script) | x 1376–1888, y 116–1000 | Script steps | **Very low**: plain paper |
| Footer bar | x 32–1888, y 1012–1060 | Key message | Low |
| Outer border | outer ~32 px on every side | Decoration | **Higher**: put the art here |

Rule of thumb: **put the decoration in the outer 5–8 % of the frame and in the corners, and keep the center a calm, flat beige.**

## Master prompt (works in any image generator)

> Ultra-wide 16:9 background for a premium enterprise architecture video series. Warm beige paper base (#F3ECDF fading to #E7DBC5 at the edges) with a very fine natural paper grain and a soft, warm vignette. The center of the frame is flat, calm and almost empty, so content panels can sit on top. All decoration is pushed to the outer border and the four corners: faint charcoal (#222530) blueprint line-art at about 10 % opacity, with thin architecture grid lines, small connected nodes and arrows like a hand-drawn system diagram. A few delicate deep-teal (#0F7F77) accent strokes appear in the top-left and bottom-right corners only. Lower-left corner: a very faint sketch of a vintage mainframe cabinet. Upper-right corner: a very faint sketch of connected cloud nodes. Minimal, editorial, Swiss-design feel, clean and bright, soft natural light, no harsh shadows. No text, no letters, no numbers, no logos, no watermark, no people, no UI windows, no frames with content.

## Tool-specific versions

**Midjourney (v7)**
```
16:9 editorial background, warm beige paper #F3ECDF with fine paper grain and soft warm vignette, flat calm empty center for overlay panels, faint charcoal blueprint line-art only along the outer border and corners, thin grid lines, small connected nodes and arrows like a hand-drawn system diagram, subtle deep teal #0F7F77 accent strokes in top-left and bottom-right corners, faint sketch of a vintage mainframe cabinet lower-left, faint sketch of connected cloud nodes upper-right, minimal Swiss design, bright soft light --ar 16:9 --style raw --stylize 100 --no text, letters, numbers, logo, watermark, people, ui, dark background
```
When you find one you like, write down its `--seed` and reuse it for variations in later episodes.

**ChatGPT / DALL·E / gpt-image**: paste the master prompt, then add:
> Landscape format, wide aspect. Keep the central 85 % of the image a flat, light beige with no drawings. Do not draw rectangles, panels, cards, text or interface elements.

Crop the result to exactly 16:9, then upscale to 3840 × 2160 if the tool outputs a smaller size.

**Ideogram / Flux / SDXL**
- Prompt: the master prompt.
- Negative prompt: `text, letters, typography, numbers, logo, watermark, signature, people, faces, hands, UI, dashboard, buttons, windows, busy center, dark background, neon, glow, clutter, heavy shadows, blurry, jpeg artifacts`
- Size: 1920 × 1080 (or the closest 16:9 size, then upscale), guidance 6–7.

## How to use it

1. Save the image as `assets/background.png`, next to `assets/jo-logo.png`.
2. Run `export-slides.ps1` again. Every slide is re-rendered on top of your background,
   and the built-in dot grid switches off automatically.
3. Use the same file for every future episode in this series.

## JO logo files
- `assets/jo-logo.png`: transparent background, ink `#222530`. Use it on beige or white (header, watermark, thumbnails).
- `assets/jo-logo-original.jpg`: your original file.

## Consistency checklist for future episodes
- Same background file, same JO header, same Part 1–6 tracker, same footer.
- Same color meanings: gray = legacy, teal = new AWS, orange = risk, red dashed = compensation,
  green = happy path, violet = AI, blue = human approval, **charcoal pill with mustard number = step tag**.
- Pen color for live drawing on beige: **red `#C0392B`** or **charcoal**. Both read clearly, and neither clashes with the teal lines.
