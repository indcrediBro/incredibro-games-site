import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const games={
 tethered:{title:'Tethered Tilt',tag:'UPCOMING · STEAM',desc:'A compact 3D puzzle game about two cubes, a tether and a carefully designed collection of problems.',url:'https://incredibro.itch.io/tethered-tilt',image:'https://img.itch.zone/aW1nLzI3NDE0NTA0LnBuZw%3D%3D/original/srvy4z.png',chips:['PUZZLE','3D','STEAM']},
 positive:{title:'Be Positive',tag:'IN DEVELOPMENT',desc:'A magnetic cube puzzle game built around polarity, positioning and finding the one move that makes everything click.',url:'https://incredibro.itch.io/be-positive',image:'https://img.itch.zone/aW1nLzEzODQ4MTU0LnBuZw%3D%3D/original/LEGJGc.png',chips:['PUZZLE','3D','STEAM']},
 bullets:{title:'100 Bullets To Die',tag:'GMTK GAME JAM 2026',desc:'A recent game jam project built around one simple problem: you have 100 bullets. Make them count.',url:'https://incredibro.itch.io/100-bullets-to-die',image:'',chips:['ACTION','GMTK 2026']},
 taiyo:{title:'Taiyo',tag:'PUZZLE',desc:'Merge planets and work toward the sun in a compact 3D space puzzle.',url:'https://incredibro.itch.io/taiyo',image:'https://img.itch.zone/aW1nLzE2NTczODY5LnBuZw%3D%3D/original/O1%2Bu%2F9.png',chips:['PUZZLE','3D','SPACE']},
 golf:{title:'Golf Breaker',tag:'RELEASED',desc:'A fast arcade experiment mixing golf, destruction and leaderboard chasing.',url:'https://incredibro.itch.io/golf-breaker',image:'https://img.itch.zone/aW1nLzE2OTEzNjk4LnBuZw%3D%3D/original/cUUXu6.png',chips:['ACTION','RETRO']}
};

const scene=new THREE.Scene(); scene.background=new THREE.Color(0x101522); scene.fog=new THREE.Fog(0x101522,10,42);
const camera=new THREE.PerspectiveCamera(58,innerWidth/innerHeight,.1,100); camera.position.set(0,2.7,15);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'}); renderer.setPixelRatio(Math.min(devicePixelRatio,1.7)); renderer.setSize(innerWidth,innerHeight); renderer.outputColorSpace=THREE.SRGBColorSpace; document.querySelector('#webgl').appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xcdefff,0x1a1d2b,2.2));
const key=new THREE.DirectionalLight(0xffffff,3); key.position.set(4,9,8); scene.add(key);
const cyan=new THREE.PointLight(0x00eaff,35,20); cyan.position.set(-5,4,3); scene.add(cyan);
const pink=new THREE.PointLight(0xff2bd6,30,18); pink.position.set(6,3,-4); scene.add(pink);
const yellow=new THREE.PointLight(0xffe600,22,15); yellow.position.set(-1,5,-15); scene.add(yellow);

const mat=(color,rough=.55,metal=.15)=>new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal});
const floor=new THREE.Mesh(new THREE.PlaneGeometry(70,70),mat(0x20283a,.8)); floor.rotation.x=-Math.PI/2; floor.position.y=0; scene.add(floor);
const grid=new THREE.GridHelper(70,35,0x00a8c4,0x334052); grid.position.y=.015; grid.material.opacity=.22; grid.material.transparent=true; scene.add(grid);
const ceiling=new THREE.Mesh(new THREE.PlaneGeometry(70,70),mat(0x181e2c)); ceiling.rotation.x=Math.PI/2; ceiling.position.y=7; scene.add(ceiling);
function box(x,y,z,sx,sy,sz,color,glow=false){const m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),mat(color,.45,.25));m.position.set(x,y,z);scene.add(m);if(glow){const l=new THREE.PointLight(color,8,8);l.position.set(x,y,z);scene.add(l)}return m}
// Walls, kept bright enough to read as architecture.
box(-10,3.5,-12,0.4,7,45,0x252d40); box(10,3.5,-12,.4,7,45,0x252d40); box(0,7,-12,20,.35,45,0x202739);
for(let z=-3;z>-39;z-=7){box(-9.7,4,z,.15,.12,5,0x00eaff,true);box(9.7,4,z,.15,.12,5,0xff2bd6,true)}

function cabinet(x,z,screenTexture,accent){
 const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
 const body=new THREE.Mesh(new THREE.BoxGeometry(2.7,4.7,1.25),mat(0x293247,.42,.3));body.position.y=2.35;g.add(body);
 const hood=new THREE.Mesh(new THREE.BoxGeometry(2.9,1.0,1.45),mat(0x323b53,.38,.35));hood.position.set(0,4.45,.02);hood.rotation.x=-.12;g.add(hood);
 const tex=new THREE.TextureLoader().load(screenTexture||''); if(screenTexture)tex.colorSpace=THREE.SRGBColorSpace;
 const screen=new THREE.Mesh(new THREE.PlaneGeometry(2.15,1.65),new THREE.MeshBasicMaterial({map:screenTexture?tex:null,color:screenTexture?0xffffff:0x0a0e17}));screen.position.set(0,3.45,.69);screen.rotation.x=-.08;g.add(screen);
 const glowMat=new THREE.MeshBasicMaterial({color:accent}); const marquee=new THREE.Mesh(new THREE.BoxGeometry(2.25,.42,.05),glowMat);marquee.position.set(0,4.35,.74);g.add(marquee);
 const control=new THREE.Mesh(new THREE.BoxGeometry(2.4,.35,1.0),mat(0x161b28,.3,.4));control.position.set(0,2.2,.55);control.rotation.x=.12;g.add(control);
 for(let i=0;i<3;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(.11,12,12),new THREE.MeshBasicMaterial({color:i===1?0xff2bd6:accent}));b.position.set(-.35+i*.35,2.42,.99);g.add(b)}
 const light=new THREE.PointLight(accent,10,8);light.position.set(0,3.6,1.2);g.add(light);return g;
}
cabinet(-4,-7,'https://img.itch.zone/aW1nLzI3NDE0NTA0LnBuZw%3D%3D/original/srvy4z.png',0x00eaff);
cabinet(4,-7,'https://img.itch.zone/aW1nLzEzODQ4MTU0LnBuZw%3D%3D/original/LEGJGc.png',0xff2bd6);
cabinet(-5,-19,'https://img.itch.zone/aW1nLzE2OTEzNjk4LnBuZw%3D%3D/original/cUUXu6.png',0xffe600);
cabinet(0,-23,'https://img.itch.zone/aW1nLzE2NTczODY5LnBuZw%3D%3D/original/O1%2Bu%2F9.png',0x00eaff);
cabinet(5,-27,'https://img.itch.zone/aW1nLzI3NDE0NTA0LnBuZw%3D%3D/original/srvy4z.png',0xff2bd6);

// Large physical letters at the end of the route.
function makeTextSprite(text,color){const c=document.createElement('canvas');c.width=1024;c.height=256;const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);x.font='bold 92px Arial';x.textAlign='center';x.textBaseline='middle';x.fillStyle=color;x.shadowBlur=24;x.shadowColor=color;x.fillText(text,512,128);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true}));s.scale.set(9,2.25,1);return s}
const sign=makeTextSprite('INCREDIBRO GAMES','#00eaff');sign.position.set(0,4,-35);scene.add(sign);

let scrollTarget=0,scrollPos=0,mouseX=0,mouseY=0,lookX=0,lookY=0;let maxScroll=1;
function sync(){maxScroll=Math.max(1,document.documentElement.scrollHeight-innerHeight);scrollTarget=scrollY/maxScroll}
addEventListener('scroll',sync,{passive:true});sync();
addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;mouseX=(e.clientX/innerWidth-.5);mouseY=(e.clientY/innerHeight-.5)},{passive:true});
function animate(){requestAnimationFrame(animate);scrollPos+=(scrollTarget-scrollPos)*.075;lookX+=(mouseX-lookX)*.04;lookY+=(mouseY-lookY)*.04;
 const routeZ=15-scrollPos*49; camera.position.x=lookX*1.0;camera.position.y=2.8-lookY*.35;camera.position.z=routeZ; camera.rotation.y=lookX*.055; camera.rotation.x=-lookY*.025;
 // move light accents with the route for a continuous cinematic feel
 cyan.position.z=routeZ-3; pink.position.z=routeZ-8; yellow.position.z=routeZ-15;
 renderer.render(scene,camera)}animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);sync()});

const modal=document.querySelector('#modal'),mimg=document.querySelector('#mimg');function openGame(id){const g=games[id];if(!g)return;document.querySelector('#mtag').textContent=g.tag;document.querySelector('#mtitle').textContent=g.title;document.querySelector('#mdesc').textContent=g.desc;document.querySelector('#chips').innerHTML=g.chips.map(x=>`<i>${x}</i>`).join('');document.querySelector('#mlink').href=g.url;if(g.image){mimg.src=g.image;mimg.style.display='block'}else mimg.style.display='none';modal.classList.add('open')}
document.querySelectorAll('[data-game]').forEach(e=>e.addEventListener('click',()=>openGame(e.dataset.game)));document.querySelector('#close').onclick=()=>modal.classList.remove('open');modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});
const nav=document.querySelector('nav');document.querySelector('#menu').onclick=()=>nav.classList.toggle('open');nav.querySelectorAll('a').forEach(a=>a.onclick=()=>nav.classList.remove('open'));
setTimeout(()=>{const l=document.querySelector('#loader');l.style.opacity=0;setTimeout(()=>l.remove(),600)},1000);
