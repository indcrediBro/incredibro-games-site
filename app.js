import * as THREE from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";

const canvas=document.querySelector("#scene");
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x04050a);
scene.fog=new THREE.FogExp2(0x070812,.026);

const camera=new THREE.PerspectiveCamera(70,innerWidth/innerHeight,.1,180);
camera.position.set(0,1.65,10);

const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;

const C={cyan:0x00eaff,pink:0xff2bd6,yellow:0xffe600,purple:0x7d5cff,green:0x57ff9a,blue:0x386cff};
scene.add(new THREE.HemisphereLight(0x29305a,0x050509,1.8));

const floorMat=new THREE.MeshStandardMaterial({color:0x090b12,roughness:.88,metalness:.08});
const floor=new THREE.Mesh(new THREE.PlaneGeometry(34,75),floorMat);floor.rotation.x=-Math.PI/2;floor.position.set(0,0,-22);floor.receiveShadow=true;scene.add(floor);
const carpet=new THREE.Mesh(new THREE.PlaneGeometry(20,57),new THREE.MeshStandardMaterial({color:0x101122,roughness:1}));
carpet.rotation.x=-Math.PI/2;carpet.position.set(0,.006,-19);scene.add(carpet);

function cube(w,h,d,c,e=0,ei=0){const m=new THREE.MeshStandardMaterial({color:c,roughness:.7,metalness:.15,emissive:e,emissiveIntensity:ei});const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.castShadow=true;o.receiveShadow=true;return o}
function neon(x,y,z,w,h,c,rot=0){const o=cube(w,h,.05,c,c,6);o.position.set(x,y,z);o.rotation.z=rot;scene.add(o);return o}
function light(x,y,z,c,intensity=4,dist=12){const p=new THREE.PointLight(c,intensity,dist);p.position.set(x,y,z);p.castShadow=true;scene.add(p)}
function label(text,color,size=22,scale=1){
 const cv=document.createElement("canvas");cv.width=1024;cv.height=256;const x=cv.getContext("2d");
 x.font=`${size}px "Press Start 2P", monospace`;x.textAlign="center";x.textBaseline="middle";x.fillStyle=color;x.shadowColor=color;x.shadowBlur=24;x.fillText(text,512,128);
 const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;
 const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false}));s.scale.set(5.5*scale,1.35*scale,1);return s;
}

// Room architecture
const back=cube(34,7,.3,0x080a11);back.position.set(0,3.5,-49);scene.add(back);
for(const x of[-17,17]){const wall=cube(.3,7,75,0x080a11);wall.position.set(x,3.5,-22);scene.add(wall)}
const ceiling=cube(34,.3,75,0x080a11);ceiling.position.set(0,7,-22);scene.add(ceiling);

for(let z=8;z>-49;z-=3.5){
 neon(0,.035,z,33,.035,z%7===0?C.pink:C.purple);
}
for(let x=-16;x<=16;x+=4){const bar=neon(x,.04,-22,.035,57,C.cyan);bar.rotation.z=Math.PI/2}
for(let z=6;z>-49;z-=7){
 for(const x of[-16.7,16.7]){neon(x,3.2,z,.07,3.8,C.cyan);light(x*0.92,3,z,C.cyan,2.2,8)}
}
for(let z=5;z>-49;z-=12){light(-8,5,z,C.pink,5,14);light(8,5,z,C.cyan,5,14)}
light(0,5,2,C.purple,6,18);light(0,5,-46,C.yellow,5,16);

// Entrance
const sign=label("INCREDIBRO GAMES","#ff2bd6",30);sign.position.set(0,5.4,1);sign.scale.set(7.5,1.7,1);scene.add(sign);
const sub=label("EXPLORE THE GAMES","#00eaff",12);sub.position.set(0,4.35,1);sub.scale.set(4.5,.6,1);scene.add(sub);

// Back room signage
function addSectionSign(text,z,c){const s=label(text,"#"+c.toString(16).padStart(6,"0"),18);s.position.set(0,5.2,z);s.scale.set(5.8,1.2,1);scene.add(s)}
addSectionSign("GAMES",-9,C.cyan);
addSectionSign("GAME JAMS",-28,C.yellow);
addSectionSign("PRESS + STUDIO",-43,C.pink);

// Shelves and decor make the room feel inhabited
function shelf(x,z){
 const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
 const back=cube(4.6,3.2,.22,0x111426);back.position.y=1.7;g.add(back);
 for(let y=.5;y<3.1;y+=.75){const s=cube(4.4,.07,.5,0x242945);s.position.set(0,y,.1);g.add(s)}
 for(let i=0;i<10;i++){const col=[C.cyan,C.pink,C.yellow,C.green][i%4];const item=cube(.25,.42,.3,col,col,3);item.position.set(-1.9+i*.42,.82,.2);g.add(item)}
}
shelf(-14,-10);shelf(14,-10);shelf(-14,-30);shelf(14,-30);

// Posters
function poster(text,x,z,c){
 const p=label(text,"#"+c.toString(16).padStart(6,"0"),13);p.position.set(x,2.9,z);p.scale.set(2.7,.8,1);p.rotation.y=x<0?.02:-.02;scene.add(p)
}
poster("PLAY SOMETHING", -16.7,-4,C.yellow);poster("32+ JAMS",16.7,-4,C.pink);
poster("STEAM SOON",-16.7,-23,C.cyan);poster("HIGH SCORES",16.7,-23,C.green);

// Game data, using screenshots surfaced from the IncrediBro itch pages.
const games=[
 {name:"Tethered Tilt",tag:"UPCOMING",desc:"A short but infuriating puzzle game with leaderboards. Two cubes, a tether, and a very yellow floor.",url:"https://incredibro.itch.io/tethered-tilt",image:"https://img.itch.zone/aW1nLzI3NDE0NTA0LnBuZw%3D%3D/original/srvy4z.png",chips:["PUZZLE","3D","UPCOMING"],pos:[-6,0,-11],color:C.cyan},
 {name:"Be Positive",tag:"STEAM IN DEVELOPMENT",desc:"The magnetic maze that won a game jam is being expanded for a Steam release with 3D gameplay, VR compatibility, handcrafted levels and online leaderboards.",url:"https://incredibro.itch.io/be-positive",image:"https://img.itch.zone/aW1nLzEzODQ4MTU0LnBuZw%3D%3D/original/LEGJGc.png",chips:["PUZZLE","JAM WINNER","STEAM"],pos:[6,0,-11],color:C.green},
 {name:"100 Bullets To Die",tag:"2026 GAME JAM",desc:"Survive waves of AI-driven robot enemies with only 100 bullets. A recent GMTK Game Jam collaboration.",url:"https://incredibro.itch.io/100-bullets-to-die",image:"https://img.itch.zone/aW1nLzE2NTczODY5LnBuZw%3D%3D/original/O1%2Bu%2F9.png",chips:["SHOOTER","GMTK 2026","NEW"],pos:[-6,0,-18],color:C.pink},
 {name:"Golf Breaker",tag:"JAM WINNER",desc:"An updated, juiced-up take on Golf Pong with retro CRT vibes, power-ups and leaderboard chasing.",url:"https://incredibro.itch.io/golf-breaker",image:"https://img.itch.zone/aW1nLzE2OTEzNjk4LnBuZw%3D%3D/original/cUUXu6.png",chips:["ARCADE","RETRO","WINNER"],pos:[6,0,-18],color:C.yellow},
 {name:"Pixel Bomber",tag:"ARCADE",desc:"Pixel arcade action with a deliberately cabinet-shaped identity. A perfect machine for the back row.",url:"https://incredibro.itch.io/pixel-bomber",image:"https://img.itch.zone/aW1nLzI0MjE4Njc3LnBuZw%3D%3D/original/bnc3oL.png",chips:["ARCADE","PIXEL","ACTION"],pos:[-6,0,-31],color:C.blue},
 {name:"Taiyo",tag:"PUZZLE",desc:"Merge planets and reach the sun in limited space. A 3D space puzzle from Micro Jam 016.",url:"https://incredibro.itch.io/taiyo",image:"https://img.itch.zone/aW1nLzE2NTczODY5LnBuZw%3D%3D/original/O1%2Bu%2F9.png",chips:["PUZZLE","3D","SPACE"],pos:[6,0,-31],color:C.purple},
 {name:"Back To The West",tag:"DECK BUILDER",desc:"A strategic Wild West deck-building duel with a branching map, cards, combos and leaderboard chasing.",url:"https://incredibro.itch.io/back-to-the-west",image:"https://img.itch.zone/aW1nLzI0MjE4Njc3LnBuZw%3D%3D/original/bnc3oL.png",chips:["CARD GAME","3D","WESTERN"],pos:[-6,0,-38],color:0xff9d3d},
 {name:"The Night Shift",tag:"HORROR",desc:"A first-person horror experience set during a security guard's night shift in a run-down apartment complex.",url:"https://incredibro.itch.io/the-night-shift",image:"https://img.itch.zone/aW1nLzE3MjQ4NjI2LnBuZw%3D%3D/original/7w4K7x.png",chips:["HORROR","3D","CO-DEV"],pos:[6,0,-38],color:C.pink}
];

// Screenshot URLs below are sourced from the corresponding IncrediBro itch.io pages.

const loader=new GLTFLoader();
const frameClock=new THREE.Clock();
let templateScene=null;
loader.load("arcade-machine.glb",g=>{
 templateScene=g.scene;templateScene.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});
 games.forEach((game,i)=>addMachine(game,i));
},undefined,e=>{console.error("Arcade cabinet failed to load",e);document.body.classList.add("cabinet-fallback");games.forEach(addFallbackMachine);});

const machineHits=[];
function addFallbackMachine(game){
 const g=new THREE.Group(); g.position.set(game.pos[0],0,game.pos[1]);
 const body=box(2.8,3.8,1.15,0x111426); body.position.y=1.9; g.add(body);
 const top=box(2.95,.16,1.25,game.color,game.color,4); top.position.y=3.82; g.add(top);
 scene.add(g);
 const hit=box(3.3,4.2,1.8,0); hit.material.transparent=true; hit.material.opacity=0; hit.position.set(game.pos[0],2.1,game.pos[1]); hit.userData.game=game; scene.add(hit); machineHits.push(hit);
}
function addMachine(game,index){
 const g=templateScene.clone(true);
 g.position.set(game.pos[0],game.pos[1],game.pos[2]);
 g.scale.setScalar(1.0);
 // The supplied model is used as the actual cabinet. Rotate each cabinet inward toward the aisle.
 g.rotation.y=game.pos[0]<0?Math.PI*0.08:-Math.PI*0.08;
 scene.add(g);
 const box3=new THREE.Box3().setFromObject(g);const size=box3.getSize(new THREE.Vector3());
 const hit=cube(Math.max(size.x,2.2),Math.max(size.y,3.2),Math.max(size.z,1.4),0,0,0);
 hit.material.transparent=true;hit.material.opacity=0;hit.position.copy(g.position);hit.position.y+=size.y*.5;hit.userData.game=game;scene.add(hit);machineHits.push(hit);
 // Place a floating game title above the real machine.
 const title=label(game.name,"#"+game.color.toString(16).padStart(6,"0"),13,.7);title.position.set(game.pos[0],4.15,game.pos[2]-.15);scene.add(title);
 light(game.pos[0],2.5,game.pos[2]-.7,game.color,2.8,7);
}

// Mouse + touch only. No keyboard and no pointer-lock.
const ray = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const panel = document.querySelector("#gamePanel");
const image = document.querySelector("#gameImage");
let yaw = 0, pitch = 0;
let moveTarget = null;
let activePointer = null;
let dragging = false;
let didDrag = false;
let lastX = 0, lastY = 0;
let downX = 0, downY = 0;

function openGame(game){
 document.querySelector("#gameTag").textContent=game.tag;
 document.querySelector("#gameTitle").textContent=game.name;
 document.querySelector("#gameDesc").textContent=game.desc;
 image.style.display="block";
 image.src=game.image;
 image.alt=game.name+" screenshot";
 image.onerror=()=>image.style.display="none";
 image.onload=()=>image.style.display="block";
 document.querySelector("#chips").innerHTML=game.chips.map(x=>`<span class="chip">${x}</span>`).join("");
 document.querySelector("#gameLink").href=game.url;
 panel.classList.add("visible");
}
document.querySelector("#gameClose").onclick=()=>panel.classList.remove("visible");

function rayFromClient(x,y){
 pointer.x=(x/innerWidth)*2-1;
 pointer.y=-(y/innerHeight)*2+1;
 ray.setFromCamera(pointer,camera);
}

function clickWorld(x,y){
 if(panel.classList.contains("visible")) return;
 rayFromClient(x,y);
 const machine=ray.intersectObjects(machineHits,false);
 if(machine.length){ openGame(machine[0].object.userData.game); return; }
 const ground=ray.intersectObjects([carpet,floor],false);
 if(ground.length){
   const p=ground[0].point;
   moveTarget=new THREE.Vector3(
     THREE.MathUtils.clamp(p.x,-13.5,13.5),
     1.65,
     THREE.MathUtils.clamp(p.z,-45,7)
   );
 }
}

function beginLook(e){
 if(panel.classList.contains("visible")) return;
 if(activePointer!==null) return;
 activePointer=e.pointerId;
 dragging=true;
 didDrag=false;
 downX=lastX=e.clientX;
 downY=lastY=e.clientY;
 canvas.setPointerCapture(e.pointerId);
}
function continueLook(e){
 if(!dragging || e.pointerId!==activePointer) return;
 const dx=e.clientX-lastX;
 const dy=e.clientY-lastY;
 if(Math.hypot(e.clientX-downX,e.clientY-downY)>7) didDrag=true;
 yaw-=dx*0.004;
 pitch-=dy*0.003;
 pitch=THREE.MathUtils.clamp(pitch,-1.05,1.05);
 lastX=e.clientX;
 lastY=e.clientY;
}
function finishLook(e){
 if(e.pointerId!==activePointer) return;
 canvas.releasePointerCapture?.(e.pointerId);
 const shouldClick=!didDrag;
 dragging=false;
 activePointer=null;
 if(shouldClick) clickWorld(e.clientX,e.clientY);
}

canvas.addEventListener("pointerdown",beginLook,{passive:true});
canvas.addEventListener("pointermove",continueLook,{passive:true});
canvas.addEventListener("pointerup",finishLook,{passive:true});
canvas.addEventListener("pointercancel",finishLook,{passive:true});
canvas.addEventListener("lostpointercapture",()=>{dragging=false;activePointer=null});
canvas.addEventListener("contextmenu",e=>e.preventDefault());

function move(dt){
 if(panel.classList.contains("visible")){moveTarget=null;return}
 if(moveTarget){
   const d=new THREE.Vector3().subVectors(moveTarget,camera.position);d.y=0;
   const distance=d.length();
   if(distance<.08){camera.position.copy(moveTarget);moveTarget=null}
   else{d.normalize();camera.position.addScaledVector(d,Math.min(4.5,distance*5)*dt)}
 }
 camera.position.x=THREE.MathUtils.clamp(camera.position.x,-14.2,14.2);
 camera.position.z=THREE.MathUtils.clamp(camera.position.z,-45,8);
 camera.position.y=1.65;
 camera.rotation.order="YXZ";camera.rotation.y=yaw;camera.rotation.x=pitch;
}
function updateLocation(){const z=camera.position.z;document.querySelector("#location").textContent=z>-9?"ENTRANCE":z>-27?"FEATURED FLOOR":z>-36?"GAME JAMS":"STUDIO / PRESS"}
function animate(){requestAnimationFrame(animate);const dt=Math.min(frameClock.getDelta(),.05);move(dt);updateLocation();renderer.render(scene,camera)}animate();

// menu
document.querySelector("#menuBtn").onclick=()=>document.querySelector("#menu").classList.add("visible");
document.querySelector("#menuClose").onclick=()=>document.querySelector("#menu").classList.remove("visible");
document.querySelectorAll("[data-jump]").forEach(b=>b.onclick=()=>{document.querySelector("#menu").classList.remove("visible");const z={featured:-11,jam:-31,press:-43}[b.dataset.jump];camera.position.set(0,1.65,z+5);yaw=0;});
document.querySelector("#enter").onclick=()=>document.querySelector("#intro").classList.remove("visible");

addEventListener("resize",()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
setTimeout(()=>{document.querySelector("#boot").style.opacity=0;setTimeout(()=>document.querySelector("#boot").remove(),600)},1800);
