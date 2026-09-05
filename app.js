const root = document.querySelector('#webgl');

async function importWithFallback(primary, fallback) {
  try { return await import(primary); }
  catch (first) {
    try { return await import(fallback); }
    catch (second) { throw second; }
  }
}

async function boot3D() {
  if (!root || !window.WebGLRenderingContext) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const THREE = await importWithFallback(
    'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js',
    'https://unpkg.com/three@0.180.0/build/three.module.js'
  );
  const { GLTFLoader } = await importWithFallback(
    'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js',
    'https://unpkg.com/three@0.180.0/examples/jsm/loaders/GLTFLoader.js'
  );

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05070d, 0.032);
  const camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, .1, 100);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x05070d, 0);
  root.appendChild(renderer.domElement);

  const world = new THREE.Group();
  scene.add(world);

  scene.add(new THREE.HemisphereLight(0x9edcff, 0x05060c, 1.15));
  const cyan = new THREE.PointLight(0x00eaff, 25, 18); cyan.position.set(-6, 4, -7); world.add(cyan);
  const pink = new THREE.PointLight(0xff2b73, 30, 20); pink.position.set(7, 4, -15); world.add(pink);
  const purple = new THREE.PointLight(0x9b4dff, 26, 18); purple.position.set(-2, 5, -30); world.add(purple);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    new THREE.MeshStandardMaterial({ color: 0x070b12, roughness: .94, metalness: .08 })
  );
  floor.rotation.x = -Math.PI / 2;
  world.add(floor);

  const grid = new THREE.GridHelper(80, 40, 0x00a9bb, 0x1c2735);
  grid.material.transparent = true;
  grid.material.opacity = .11;
  grid.position.y = .012;
  world.add(grid);

  // Distant silhouettes create depth even before the supplied cabinet model finishes loading.
  const cabinetMaterial = new THREE.MeshStandardMaterial({ color: 0x101622, roughness: .5, metalness: .35 });
  for (let i = 0; i < 9; i++) {
    const g = new THREE.Group();
    const x = -9 + i * 2.3;
    g.position.set(x, 0, -5 - i * 5.2);
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.45, 2.7, .62), cabinetMaterial);
    body.position.y = 1.35;
    g.add(body);
    const glowColor = i % 3 === 0 ? 0x00eaff : i % 3 === 1 ? 0xff2bd6 : 0x7e4cff;
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.08, .78), new THREE.MeshBasicMaterial({ color: glowColor }));
    screen.position.set(0, 2.05, .33);
    g.add(screen);
    const lamp = new THREE.PointLight(glowColor, 2.2, 4.5);
    lamp.position.set(0, 2.0, .65);
    g.add(lamp);
    world.add(g);
  }

  const particles = new THREE.Group();
  const particleGeo = new THREE.SphereGeometry(.018, 5, 5);
  for (let i = 0; i < 90; i++) {
    const color = i % 2 ? 0x00eaff : 0xff2bd6;
    const p = new THREE.Mesh(particleGeo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .28 }));
    p.position.set((Math.random() - .5) * 24, Math.random() * 8, -Math.random() * 58);
    p.userData.phase = Math.random() * Math.PI * 2;
    p.userData.speed = .15 + Math.random() * .35;
    particles.add(p);
  }
  world.add(particles);

  let heroCabinet = null;
  const loadCabinet = () => new Promise(resolve => {
    const loader = new GLTFLoader();
    loader.load('cabinet.glb', gltf => {
      heroCabinet = gltf.scene;
      heroCabinet.scale.setScalar(1.35);
      heroCabinet.position.set(4.6, -.02, -4.3);
      heroCabinet.rotation.y = -.18;
      world.add(heroCabinet);
      heroCabinet.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; } });
      resolve(true);
    }, undefined, () => resolve(false));
  });

  root.classList.add('ready');

  let targetX = 0, targetY = 0, mouseX = 0, mouseY = 0, scroll = 0, scrollSmooth = 0;
  const pointer = e => { targetX = e.clientX / innerWidth - .5; targetY = e.clientY / innerHeight - .5; };
  addEventListener('pointermove', pointer, { passive: true });
  addEventListener('scroll', () => {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    scroll = scrollY / max;
  }, { passive: true });

  const clock = new THREE.Clock();
  function frame() {
    requestAnimationFrame(frame);
    const elapsed = clock.getElapsedTime();
    const ease = reduced ? 1 : .035;
    mouseX += (targetX - mouseX) * ease;
    mouseY += (targetY - mouseY) * ease;
    scrollSmooth += (scroll - scrollSmooth) * (reduced ? .2 : .045);

    const depth = scrollSmooth * 15;
    camera.position.x = 1.1 + mouseX * .72;
    camera.position.y = 2.45 - mouseY * .3;
    camera.position.z = 8 - depth * .48;
    camera.lookAt(2.1 + mouseX * .15, 2.0, -8 - depth * .16);

    world.rotation.y = mouseX * .016;
    world.rotation.x = mouseY * .005;
    cyan.intensity = 23 + Math.sin(elapsed * 1.1) * 3;
    pink.intensity = 28 + Math.sin(elapsed * .8 + 1.4) * 4;
    purple.intensity = 24 + Math.sin(elapsed * .65 + 2) * 3;

    particles.children.forEach((p, i) => {
      p.position.y += Math.sin(elapsed * p.userData.speed + p.userData.phase) * .0008;
      p.position.x += Math.sin(elapsed * .12 + p.userData.phase) * .00015;
    });

    if (heroCabinet) {
      heroCabinet.position.x = 4.6 + mouseX * .45;
      heroCabinet.position.y = -.02 - mouseY * .1;
      heroCabinet.position.z = -4.3 - depth * .12;
      heroCabinet.rotation.y = -.18 + mouseX * .055;
    }
    renderer.render(scene, camera);
  }
  frame();
  loadCabinet();

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
}

boot3D().catch(error => {
  console.warn('Living 3D background unavailable; static site remains active.', error);
  root?.classList.remove('ready');
});

// Navigation
const menu = document.querySelector('#menu');
const nav = document.querySelector('nav');
menu?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menu?.setAttribute('aria-expanded', 'false');
}));

// Scroll reveals, with a no-JS-safe fallback.
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in-view'); io.unobserve(entry.target); }
  }), { threshold: .12 });
  reveals.forEach(el => io.observe(el));
} else reveals.forEach(el => el.classList.add('in-view'));

// Subtle cursor energy on desktop.
const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow && matchMedia('(pointer:fine)').matches) {
  addEventListener('pointermove', e => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
    cursorGlow.style.opacity = '.75';
  }, { passive: true });
}
