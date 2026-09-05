# IncrediBro Games v13

Polished static studio website with a living Three.js background.

## Reliability
- The HTML/CSS site works independently of WebGL.
- Three.js tries jsDelivr first and unpkg second.
- The supplied `cabinet.glb` loads after the background is already running, so a slow GLB cannot block the page.
- If WebGL/CDN/model loading fails, the site remains fully usable with an animated CSS atmosphere.

## SEO
- Descriptive title and meta description
- Canonical URL
- Open Graph and Twitter metadata
- Semantic headings and crawlable HTML links
- JSON-LD Organization and WebSite structured data

Deploy the folder to GitHub Pages. Keep `cabinet.glb` beside `index.html`.
