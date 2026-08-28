# denesgarda.com

A single page for showing UGC sample videos. Static HTML/CSS/JS — no build step, no dependencies.

```
index.html        page shell, meta tags, link-preview info
content.js        ← the only file you normally edit
assets/style.css  design system
assets/site.js    renderer (leave alone)
assets/work/      your videos and poster images
CNAME             the custom domain
```

## Editing the site

Everything lives in **`content.js`**. Change a value, save, refresh. Anything marked `<< REPLACE >>` is placeholder text.

### Turning sections on and off

Four sections are built. Each has an `enabled` flag:

```js
sections: {
  work:     { enabled: true,  ... },   // on — your samples
  stats:    { enabled: false, ... },   // built, hidden
  services: { enabled: false, ... },   // built, hidden
  brands:   { enabled: false, ... },   // built, hidden
}
```

Flip `false` → `true` and the section appears, the nav bar appears with it, and the alternating background shading re-flows on its own. Contact always renders.

Current state: **samples only**. Stats, rates, and past brands are written out and waiting — turn them on when you have real numbers and real clients to put in them, not before. A rate card with placeholder figures does more harm than no rate card.

To see what a hidden section looks like before committing to it, add `?preview=all` to the URL — <http://localhost:8000/?preview=all>. That force-shows every section for that one page view without changing any file.

### Adding a video

1. Drop the file in `assets/work/` — e.g. `assets/work/01.mp4`.
2. Export a still from it as `assets/work/01.jpg` (this is the poster; it loads instantly while the video streams).
3. Point the item at both:

```js
{ title: "Product demo", brand: "",
  video: "assets/work/01.mp4", poster: "assets/work/01.jpg", link: "" }
```

**`brand` is empty on purpose.** Filling it in puts a company name above the tile, which reads as a paid client credit. Leave it empty for spec and sample work; add it only once a piece really was made for that company.

Tiles preview muted on hover and open with sound on click. If you'd rather link out to the live post, set `link` to the URL and leave `video` empty — the tile becomes a link instead of a player.

An item with no `video` and no `poster` shows a slate with the filename it expects, so you can see exactly what's still missing.

**Keep files small.** Export at 1080×1920, H.264, ~2–4 Mbps. Anything over ~10 MB per clip makes the page slow, and GitHub Pages has a 1 GB repo soft limit. If your reel is long, host on a CDN and use `link` instead.

### Link previews

`index.html` has the Open Graph tags that control how the link renders in a DM, Slack, or email. Add a **1200×630 JPG at `assets/og.jpg`** — until that file exists the preview shows text only. Update the `og:title` / `og:description` text there too if you change your positioning.

## Publishing

```bash
git add -A
git commit -m "Update site"
git remote add origin git@github.com:<you>/<repo>.git
git push -u origin main
```

Then in the repo: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`**.

### Pointing denesgarda.com at it

At your DNS provider, for the apex domain add four `A` records pointing to GitHub:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

And a `CNAME` for `www` → `<you>.github.io`.

The `CNAME` file in this repo already holds `denesgarda.com`, so Pages picks the domain up on deploy. Once DNS resolves, tick **Enforce HTTPS** in Settings → Pages. DNS propagation usually takes under an hour but can run to 24.

## Working on it locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` directly with `file://` works too, but video playback is better over HTTP.

## Design notes

Typography is Archivo used across its width axis — expanded 800 for the masthead, condensed for labels and data — with Newsreader for reading copy. The palette is white paper, `#0a0a0a` ink, hairline rules, and `#e5341f` used only on the masthead rule, the CTA, and live states.

Every sample tile is a true 9:16 frame. Hovering one lifts it slightly and plays a muted preview; clicking opens the video with sound.

The page deliberately claims nothing it can't back up: no item counts, no availability status, no turnaround promises. The hero is short so the videos are reachable in one scroll, and the email address is the only call to action. As real work comes in, the pieces to add back are in `content.js` already.

The page prints cleanly (`Cmd+P` → Save as PDF) if someone asks for it as a file.
