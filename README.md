# IncrediBro Games - 3D Arcade v2

A more structured virtual arcade for **IncrediBro Games**, using the supplied real 3D arcade cabinet model (`arcade-machine.glb`).

## Layout

- Entrance / studio identity
- Featured Games floor
- Game Jam Vault
- Studio / Press area
- Multiple real 3D arcade cabinets
- Clickable machines with game information
- Screenshots pulled from IncrediBro's itch.io game pages
- First-person WASD + mouse exploration

## Deploy

Keep these four files in the same GitHub Pages published folder:

- `index.html`
- `style.css`
- `app.js`
- `arcade-machine.glb`

Three.js and GLTFLoader are loaded from jsDelivr.

## Screenshot sourcing

The page uses image assets hosted by itch.io's image CDN. They are referenced directly in `app.js`, so an internet connection is required.

The source pages include Tethered Tilt, Be Positive, Golf Breaker, Pixel Bomber and Taiyo.
