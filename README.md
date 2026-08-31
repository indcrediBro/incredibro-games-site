# IncrediBro Games - Virtual Arcade v2

This version is intentionally more structured and less empty.

## Key changes

- Branding is consistently **IncrediBro Games**.
- The hero uses the real **Neo Blast Arcade Cabinet** Sketchfab model supplied by the owner.
- Game cards use live screenshots generated from the corresponding IncrediBro itch.io pages.
- The floor is organized into:
  - Featured Machines
  - Arcade Floor
  - Game Jam Vault
  - Media Room
  - Streaming Booth
- The arcade catalogue is based on the current IncrediBro itch.io profile.

## Important external assets

The site uses:
- Sketchfab embed for the Neo Blast Arcade Cabinet.
- thum.io screenshot service for live screenshots of the itch.io game pages.

If you want a fully self-contained production site, download/export your actual itch screenshots and replace the remote image URLs in `index.html` with local files under an `assets/` folder.

## GitHub Pages

Upload `index.html` and `style.css` to the repository. No build step is needed.

## Sources used

Current games/content were checked against:
https://incredibro.itch.io/

The supplied arcade cabinet:
https://sketchfab.com/3d-models/neo-blast-arcade-cabinet-2f3ee5fba763476a9e280925218cad40
