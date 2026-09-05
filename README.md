# IncrediBro Games v12

Static studio website with a living Three.js background.

## Design direction
- Clean editorial website inspired by the supplied IncrediBro Games mockup.
- Normal HTML/CSS content and navigation.
- Three.js is atmospheric background only.
- Real arcade cabinet GLB included as `cabinet.glb`.
- Mouse movement creates subtle camera parallax.
- Scrolling moves the 3D environment slowly behind the page.
- Game cards remain ordinary HTML and never depend on the 3D layer.
- Mobile layout simplifies the composition rather than forcing the desktop scene onto the screen.

## Run locally
Serve this folder from a local web server because ES modules and GLTF loading require HTTP.

Examples:
- VS Code Live Server
- `python -m http.server`
- GitHub Pages
