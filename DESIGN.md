# Design

A monospace portfolio styled like a terminal session printed on graph paper. Most of the page is quiet grey ink on grey paper. Emphasis comes from structure (dotted rules, hard offset shadows, prompt glyphs), not from color. The one real color, the orange marker, appears only when something is being pointed at.

All site styles live in `app/globals.css`. The Bolo product page adds its own chrome at the bottom of `app/bolo/bolo.css`, built from the same tokens.

## Color

Tokens are CSS custom properties on `:root`. Dark mode redefines the same names under `:root[data-theme="dark"]`. Always use the tokens and never raw hex values, so both themes keep working.

| Token          | Light                   | Dark                     | Use                                                        |
| -------------- | ----------------------- | ------------------------ | ---------------------------------------------------------- |
| `--ink`        | `#202020`               | `#f0f0ed`                | Body text, heavy rules, portrait border                    |
| `--muted`      | `#666`                  | `#aaa`                   | Dates, tags, section subtitles, location                   |
| `--paper`      | `#e9e9e9`               | `#202020`                | Page background, text on inverted blocks                   |
| `--accent`     | `#5d5d5d`               | `#d1d1cb`                | Brand, `>` prompts, hover text, offset shadows, glyphs     |
| `--line`       | `#a8a8a8`               | `#555`                   | Light dotted dividers                                      |
| `--minor-grid` | `rgba(32,32,32,.045)`   | `rgba(240,240,237,.04)`  | Graph-paper background                                     |
| `--marker`     | `#d9571f`               | `#ff7a3d`                | The hand-drawn circle only                                 |

`--accent` is a grey, not a hue. The only saturated color on the site is `--marker`, so keep it for "look here" moments.

The one exception is organisation logos on the resume page (`public/logos/`), which keep their brand colors. They're `--spacing(6)` (1.5rem), set inline before the name like project glyphs. An organisation without a logo gets an initials monogram: a solid `--ink` tile with `--paper` letters.

Row hover uses a faint lavender wash, `rgba(189, 165, 255, .07)`, shared by `.listItem`, `.protoChip` and `.boloTile`. It's the one raw color value in use. Promote it to a token if it spreads further.

### Theme switching

- `app/layout.tsx` runs an inline script that sets `data-theme` on `<html>` from `localStorage` before first paint. The default is light.
- `ThemeToggle` (`app/theme-toggle.tsx`) has no state. It flips the attribute and saves it. CSS shows `◐` in light mode and `☼` in dark mode, keyed off the same attribute.
- New theme-dependent styles should be keyed off `:root[data-theme="dark"]` rather than `prefers-color-scheme`.

## Typography

Two monospace families, both from Google Fonts:

- **JetBrains Mono**: the default for everything. Used for UI, headings, nav, dates, tags and the footer.
- **IBM Plex Mono**: long-form reading. Used for the bio paragraphs, project/article descriptions, Bolo lede, stack descriptions and notes.

Rule of thumb: labels and structure use JetBrains, sentences you actually read use Plex.

Font sizes come from Tailwind's `--text-*` scale. `globals.css` uses `var(--text-*)`, and `bolo.css` uses `--theme(--text-*)`, which keeps a fallback for sizes `globals.css` doesn't emit. Don't write raw `px` or `rem` font sizes.

| Role                    | Size                                    | Weight | Tracking | Notes                                  |
| ----------------------- | --------------------------------------- | ------ | -------- | -------------------------------------- |
| Bio / intro `h1`        | `--text-base` (1rem)                    | 400    | normal   | Plex                                   |
| Page `h1`               | `clamp(--text-3xl, 5vw, --text-5xl)`    | 700    | -.05em   | line-height 1.1em, rounded up to whole cells |
| Display `h1` (Bolo)     | `clamp(--text-3xl, 6.1vw, --text-6xl)`  | 700    | -.055em  | line-height .93em, rounded up to whole cells |
| Section `h2`            | `--text-2xl` (1.5rem)                   | 700    | -.04em   | Prefixed with an accent `>`            |
| Item `h3`               | `--text-lg` (1.125rem)                  | 700    |          |                                        |
| Nav                     | `--text-xs` (.75rem)                    |        | .06em    | Uppercase                              |
| Section subtitles, footer | `--text-sm` (.875rem)                 |        |          | `--muted` subtitles                    |
| Dates, small caps       | `--text-xs` (.75rem)                    |        | .08em    | Uppercase labels, `--muted`            |

Line-height is one grid cell, `--grid` (1.75rem), for every text size, and it's set on `body` as an absolute length so it inherits unchanged. See [The grid](#the-grid).

### Voice in the type

Copy borrows from the shell and code:

- Brand: `~/priya`. Nav links: `./work`, `./writing`.
- Section headings open with `>`, and their subtitles are `// comments`. The resume page drops the subtitles.
- Contact is a `$ command` that types itself out.
- A blinking `▍` cursor closes the bio and the typed email.

## Surface and texture

The page background has three layers:

1. `--paper` as the base color.
2. A dotted graph-paper pattern on `body`, drawn in `--minor-grid`: dotted rows and columns every `--grid` (1.75rem), with a dot every 4px along each. The rows start at the top of the page, and the columns are centered on the page, so they line up with the content column.
3. A fixed SVG fractal-noise overlay (`body::after`) at 4.5% opacity for a printed grain.

The portrait gets its own halftone treatment: grayscale, extra contrast, and a dot screen overlay. It uses `screen` blending in dark mode and `multiply` in light mode.

## Rules and dividers

Dividers are always dotted, and weight shows hierarchy:

- `2px dotted var(--ink)`: a major boundary, such as the top of a section heading, the footer, or a grid top.
- `1px dotted var(--line)`: a minor boundary, such as the nav bottom, between list rows, or tile edges. On the resume page, section headings have no bottom rule and the last row in a list has none either.

Don't use solid rules. The only solid borders are on "object" elements like the portrait frame, CTAs and the Mac mockup.

## Depth

There's no blur shadow. Raised objects get a **hard offset shadow** in `--accent`:

- Resting: `--spacing(1)` (portrait, CTA), or `--spacing(2)` for the large Mac mockup.
- Hover: the shadow grows by one step, to `--spacing(2)` or `--spacing(3)`, and the element moves `translate(-2px, -2px)`, so it looks lifted off the page.

## Layout

### Sizing

All lengths use Tailwind's spacing function, `--spacing(n)`, which is `n × 0.25rem` (4px at the default root size). Only multiples of 0.25rem are used, so there are no in-between values like 27px or 38px. The exceptions stay in `px`:

- Hairlines: 1–2px borders and outlines, accent bars, the `-1px` offsets that center rules on grid lines, the 2px label nudge, and the `-2px` hover lift.
- Background textures: the graph-paper dots and the halftone screen.

Relative `em` values, like the sketch-circle ring and the cursor, stay in `em`.

### The grid

`--grid` is `--spacing(7)` (1.75rem, 28px). It's the graph paper's spacing and the line-height, and every dotted rule sits on one of its lines. That holds only if everything in the page flow comes in whole cells:

- **Text:** every line is one cell tall. Smaller inline text would stretch its line, so `small` inside rows is `display: block`, and inline `kbd` gets `line-height: 1`. Display headings use `round(up, …, var(--grid))` to get whole cells.
- **Vertical spacing:** margins, padding and fixed heights are multiples of `--grid`. Two values can split a cell between them, as long as they add up to whole cells (the mobile nav's 16px + 12px padding, for example).
- **Borders:** a border subtracts its width from the padding next to it, like `padding-bottom: calc(var(--grid) - 1px)` under a 1px rule. A 2px rule also moves up 1px with a negative margin so it's centered on the line. If there's no padding to absorb that pixel, the element gives it back with `margin-bottom: -1px`, as `.boloGrid` and `.protoChips` do.
- **Objects:** the portrait (it's a float, and text that wraps under it starts at its bottom edge), buttons and the Mac mockup are whole cells tall. The Mac keeps its 16:10.5 screen and rounds its total height down to whole cells.
- **Widths:** `main` and the Bolo demo are an even number of cells wide, found by rounding down to `2 × --grid`, and the paper's columns are centered on the page, so both edges fall on grid lines. List rows and `.boloStack` start their text column 5 cells in.

- **Icons:** project glyphs, organisation logos, social icons, the row arrows, the `>` prompts in section and article titles, and the Bolo chip icons each fill exactly one cell, with the icon centered by padding. The text after an icon starts on the next grid line. For the `>` prompts, `-1ch` cancels the space after them.
- **Link rows:** the nav and footer links have no fixed slots. Each component sets `--chars` to the label's length, and because the font is monospace, the text width is `var(--chars) * (1ch + tracking)`. Each link's right margin pads it out to whole cells plus one more as the gap, so every label starts on a grid line and the gaps differ by less than a cell. On phones the nav links don't fit in whole cells, so they spread evenly across the row instead.
- **Side nav:** it's fixed, starts 5 cells down, and every item is one cell tall. It lines up with the paper whenever the page is scrolled by whole cells, which includes every jump to a section.

Some elements are off the grid on purpose: the side edges of buttons (their width depends on the text), inline `kbd` key caps, and anything inside the Bolo app mockup.

- Content column: `main { width: min(32 cells, round(down, 100% - --spacing(12), 2 cells)) }`, which is 56rem at most, centered.
- Nav: 3 cells tall, with the brand on the left and links plus the theme toggle on the right.
- Intro: the portrait floats top-right (6 × 7 cells) and the bio wraps around it.
- List rows: a three-column grid `--spacing(25) 1fr --spacing(4)` (date, content, arrow) with a 1-cell gap and 1-cell vertical padding.
- Section rhythm: collections have 2 cells of bottom padding, and headings have 1 cell of vertical padding.
- The Bolo demo breaks out wider, at up to 38 cells, and is centered with `left: 50%` plus a translate.

### Breakpoint

There's a single breakpoint at `max-width: 40rem`, which is Tailwind's `sm`. Bolo adds a `59rem` one, the width at which `main` reaches its full 32 cells, so its tile grid only goes to four columns when each tile can be 8 whole cells. The resume side nav appears at `80rem` (`xl`). On mobile the side gutter is at least `--spacing(3)`, and grows a little because the column rounds down to whole pairs of cells. The mobile nav is two cells, one row for the brand and one for the links. Also on mobile, the portrait is smaller (4 × 5 cells), list rows are `--spacing(18) 1fr --spacing(5)`, and the footer stacks vertically.

## Motion

Motion is short, eased and one-shot. Nothing loops except the cursor blink and Bolo's hint nudge.

| Where                  | What                                                                          |
| ---------------------- | ----------------------------------------------------------------------------- |
| Page load              | Nav `fadeDown`, and each section `fadeUp` (`--spacing(3)`) staggered by .08–.3s         |
| Links (nav, footer)    | Underline wipes in from the left and out to the right (`scaleX`, .2s)         |
| Brand                  | Tracking tightens to -.04em on hover                                          |
| List rows              | 2px accent bar grows from the center of the left edge, text goes accent, lavender wash, glyph tilts -7° and scales to 1.12 |
| Theme toggle           | Rotates 18° on hover                                                          |
| Portrait               | Contrast eases and the image shifts up and left inside the frame              |
| Email                  | Types in at 42ms per character when the footer is 50% visible                 |
| Name circle            | See below                                                                     |

Durations stay in the .18–.3s range for hover and .55–.65s for entrances. Everything respects `prefers-reduced-motion`, which cuts animations and transitions down to effectively zero.

### Sketch circle

`SketchCircle` (`app/sketch-circle.tsx`) draws a hand-made lasso in `--marker` around the name in the intro.

- There are two passes. The main stroke is heavier and fully opaque. The second is lighter, at 45% opacity, and starts .16s later.
- Each pass samples a slightly-more-than-one-lap ellipse at the element's real aspect ratio, jitters the points with a seeded PRNG (so server and client output match), and smooths them with Catmull-Rom curves. A turbulence displacement filter then roughens the line.
- It draws itself once, 650ms after load, then stays. Each new hover replays the draw by re-keying the paths.
- With reduced motion, it appears already drawn.

Use it for at most one phrase per page, since it's the only thing on the site that uses the marker color.

## Iconography

- Project glyphs are inline 24×24 SVGs: stroke only, `1.55` stroke width, round caps and joins, in `--accent`. Keep new ones in the same style, drawn from simple primitives.
- Arrows: `→` for internal links and `↗` for external ones.
- Everything else is Unicode (`◐`, `☼`, `▍`, `>`) rather than an icon font.

## Components on the Bolo page

The Bolo page (`app/bolo/`) reuses the site vocabulary for its own chrome:

- **CTA** (`.boloCta`): an inverted block (ink background, paper text) with the hard offset shadow. The ghost variant is transparent with a dotted border.
- **Inverted highlight** (`.boloInvert`): an ink-filled span inside the display heading.
- **Tile grid** (`.boloGrid`): four columns bounded by dotted lines, with a 2px ink top rule.
- **Chips** (`.protoChip`): behave the same way as list rows.
- **Mac mockup**: the one place with rounded corners and a dark wallpaper, since it depicts another product.

The embedded app UI under `.bolo-app` is Bolo's own stylesheet, scoped to that class. It doesn't follow this document. Don't let its tokens leak out, and don't let site element styles leak in (the reset block at the top of `bolo.css` handles the second part).

## Navigation

- `SiteNav` (`app/site-nav.tsx`) is the one top bar on every page: `./work`, `./writing`, `./bolo`, `./resume` and the theme toggle. Off the home page the brand grows the route as a suffix (`~/priya/resume`), and the current page's link keeps its underline.
- Below 40rem the nav stacks: brand on one row, links spread across the next.
- The resume page adds a `SideNav` (`app/resume/side-nav.tsx`) in the left gutter at 80rem (1280px) and up. It lists sections with small stroke glyphs and tracks the one being read with the same 2px accent bar as list rows.

## Accessibility notes

- Decorative glyphs, cursors, arrows and the circle SVG are `aria-hidden`.
- The typed email link carries a real `aria-label`, because its visible text is animated.
- The theme toggle has a label and a visible `:focus-visible` outline. List rows show the hover treatment on `:focus-visible` too.
