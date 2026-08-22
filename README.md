# IncrediBro Games website

Static, framework-free production starter for the IncrediBro Games homepage.

## Structure

- `index.html` semantic homepage
- `styles.css` responsive styling and accessibility states
- `script.js` mobile navigation + dynamic copyright year
- `assets/` actual uploaded IncrediBro branding and game screenshots

## Deploy

This is a static site. Upload the folder to any static host such as GitHub Pages, Cloudflare Pages, Netlify, Vercel, or a traditional web host.

Before launch:

1. Buy/configure the final domain.
2. Create `hello@incredibrogames.com` with your email provider.
3. Replace any placeholder game links if an itch slug differs.
4. Add a final favicon/OG image if desired.
5. Add a privacy policy only if the final site uses analytics, forms, cookies, or other tracking that requires one.
6. Add the final Steam link when the Steam page is live.


### Image handling
All game screenshots preserve their original aspect ratio. Game cards no longer crop screenshots to a forced 16:10 frame, and the featured Tethered Tilt images use contain-style presentation on desktop and stack naturally on small screens.
