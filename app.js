import * as THREE from "three";

const canvas = document.querySelector("#scene");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x04050a);
scene.fog = new THREE.FogExp2(0x05060d, 0.035);

const camera = new THREE.PerspectiveCamera(72, innerWidth/innerHeight, .1, 250);
camera.position.set(0, 1.65, 12);

const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const center = new THREE.Vector2(0,0);

const neon = {
  cyan: 0x00eaff, pink: 0xff2bd6, yellow: 0xffe600,
  purple: 0x7d5cff, green: 0x57ff9a, blue: 0x386cff
};

scene.add(new THREE.AmbientLight(0x1a1b35, 1.1));

function box(w,h,d,color, emissive=0, intensity=0){
  const m = new THREE.MeshStandardMaterial({color, roughness:.65, metalness:.2, emissive, emissiveIntensity:intensity});
  const o = new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);
  o.castShadow=true; o.receiveShadow=true;
  return o;
}
function neonBar(length,color,vertical=false){
  const o=box(vertical?.06:length,.06,vertical?.06:length,color,color,5);
  return o;
}
function textSprite(text, color="#00eaff", size=42){
  const c=document.createElement("canvas"); c.width=1024;c.height=256;
  const x=c.getContext("2d"); x.clearRect(0,0,c.width,c.height);
  x.font=`${size}px "Press Start 2P", monospace`; x.textAlign="center"; x.textBaseline="middle";
  x.shadowColor=color;x.shadowBlur=28;x.fillStyle=color;x.fillText(text,c.width/2,c.height/2);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false}));
  s.scale.set(5.8,1.45,1);return s;
}

const floor=box(34,.25,70,0x090b14);
floor.position.y=-.15;floor.position.z=-10;scene.add(floor);

const ceiling=box(34,.25,70,0x090b14);ceiling.position.y=7;ceiling.position.z=-10;scene.add(ceiling);
const leftWall=box(.25,7,70,0x080a12);leftWall.position.set(-17,3.5,-10);scene.add(leftWall);
const rightWall=box(.25,7,70,0x080a12);rightWall.position.set(17,3.5,-10);scene.add(rightWall);
const backWall=box(34,7,.25,0x080a12);backWall.position.set(0,3.5,-44);scene.add(backWall);

for(let z=18;z>-44;z-=4){
  const l=neonBar(34, z%8===0?neon.pink:neon.blue);
  l.position.set(0,.01,z);scene.add(l);
}
for(let z=16;z>-44;z-=6){
  for(const x of [-16.8,16.8]){
    const l=neonBar(6,neon.cyan,true);l.position.set(x,2.8,z);scene.add(l);
  }
}

function addLight(x,y,z,color,intensity=4,distance=12){
  const p=new THREE.PointLight(color,intensity,distance);p.position.set(x,y,z);p.castShadow=true;scene.add(p);return p;
}
addLight(0,5,7,neon.purple,8,22);
addLight(-8,4,0,neon.cyan,5,14);
addLight(8,4,-7,neon.pink,5,14);
addLight(0,4,-25,neon.yellow,4,14);

const machines=[];
const games=[
 {title:"TETHERED TILT", color:neon.cyan, pos:[-8,0,-5], url:"https://incredibro.itch.io/tethered-tilt", tag:"UPCOMING", desc:"A puzzle game built around movement, gravity, and keeping everything where it belongs.", meta:["PUZZLE","UPCOMING","STEAM"]},
 {title:"BE POSITIVE", color:neon.green, pos:[8,0,-5], url:"https://incredibro.itch.io/be-positive", tag:"IN DEVELOPMENT", desc:"A magnetic puzzle game born from a game jam and expanded into something bigger.", meta:["PUZZLE","IN DEVELOPMENT"]},
 {title:"GOLF BREAKER", color:neon.yellow, pos:[-8,0,-17], url:"https://incredibro.itch.io/golf-breaker", tag:"ARCADE", desc:"A compact arcade experiment from the jam vault.", meta:["ARCADE","GAME JAM"]},
 {title:"TAIYO", color:neon.pink, pos:[8,0,-17], url:"https://incredibro.itch.io/taiyo", tag:"PUZZLE", desc:"One of the little experiments hiding in the IncrediBro catalogue.", meta:["PUZZLE","GAME JAM"]},
 {title:"PIXEL BOMBER", color:neon.purple, pos:[-8,0,-29], url:"https://incredibro.itch.io/pixel-bomber", tag:"ARCADE", desc:"Pixel chaos from the jam years.", meta:["ARCADE","GAME JAM"]},
 {title:"NIGHT SHIFT", color:neon.blue, pos:[8,0,-29], url:"https://incredibro.itch.io/the-night-shift", tag:"SURVIVAL", desc:"A darker corner of the archive.", meta:["HORROR","GAME JAM"]}
];

function createMachine(g){
  const group=new THREE.Group();group.position.set(...g.pos);scene.add(group);
  const body=box(3.2,3.9,1.15,0x101426);body.position.y=1.95;group.add(body);
  const top=box(3.35,.18,1.25,g.color,g.color,2);top.position.y=3.9;group.add(top);
  const screen=box(2.65,1.65,.08,0x02050b,g.color,1.8);screen.position.set(0,2.55,-.61);group.add(screen);
  const inner=box(2.3,1.3,.04,0x07101a,g.color,3);inner.position.set(0,2.55,-.67);group.add(inner);
  const logo=textSprite(g.title,"#"+g.color.toString(16).padStart(6,"0"),25);logo.position.set(0,2.58,-.73);logo.scale.set(2.65,.7,1);group.add(logo);
  const panel=box(2.8,.75,1.05,0x151a2b);panel.position.y=1.48;group.add(panel);
  const btn1=box(.25,.08,.25,g.color,g.color,4);btn1.position.set(-.65,1.58,-.65);group.add(btn1);
  const btn2=box(.25,.08,.25,neon.pink,neon.pink,4);btn2.position.set(.65,1.58,-.65);group.add(btn2);
  const label=textSprite("PLAY","#ffffff",18);label.position.set(0,1.75,-.66);label.scale.set(1.3,.32,1);group.add(label);
  const glow=addLight(g.pos[0],3.1,g.pos[2]-.8,g.color,2.5,7);
  const hit=box(3.8,4.3,1.8,0x000000);hit.material.transparent=true;hit.material.opacity=0;hit.position.y=2.1;hit.userData.game=g;group.add(hit);
  machines.push(hit);
}
games.forEach(createMachine);

function createSign(text,x,z,color){
  const s=textSprite(text,"#"+color.toString(16).padStart(6,"0"),28);s.position.set(x,5.3,z);s.scale.set(5.8,1.4,1);scene.add(s);
}
createSign("INCREDIBRO ARCADE",0,5,neon.pink);
createSign("GAME JAM VAULT",-5,-36,neon.yellow);

const info=[
 {t:"32+ GAME JAMS",x:-11,z:-36,c:neon.yellow},
 {t:"SOLO DEV",x:0,z:-36,c:neon.cyan},
 {t:"∞ IDEAS",x:11,z:-36,c:neon.pink}
];
info.forEach(i=>{const s=textSprite(i.t,"#"+i.c.toString(16).padStart(6,"0"),18);s.position.set(i.x,2.8,i.z);s.scale.set(3.4,.8,1);scene.add(s)});

const pressZone=textSprite("PRESS / BUSINESS"," #00eaff",17);pressZone.position.set(-11,2,-41);pressZone.scale.set(3.6,.8,1);scene.add(pressZone);
const streamZone=textSprite("STREAM"," #ff2bd6",17);streamZone.position.set(11,2,-41);streamZone.scale.set(3.6,.8,1);scene.add(streamZone);

const keys={};
addEventListener("keydown",e=>{keys[e.code]=true;if(e.code==="Escape")document.exitPointerLock()});
addEventListener("keyup",e=>keys[e.code]=false);

let yaw=0,pitch=0,locked=false;
document.addEventListener("pointerlockchange",()=>{locked=document.pointerLockElement===canvas});
canvas.addEventListener("click",()=>{if(!locked)canvas.requestPointerLock()});
document.addEventListener("mousemove",e=>{
  if(!locked)return;
  yaw-=e.movementX*.0022;
  pitch-=e.movementY*.0018;
  pitch=Math.max(-1.35,Math.min(1.35,pitch));
});

function move(dt){
  const speed=keys.ShiftLeft||keys.ShiftRight?7:4.2;
  const dir=new THREE.Vector3();
  if(keys.KeyW)dir.z-=1;if(keys.KeyS)dir.z+=1;if(keys.KeyA)dir.x-=1;if(keys.KeyD)dir.x+=1;
  if(dir.lengthSq())dir.normalize();
  const forward=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw));
  const right=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw));
  camera.position.addScaledVector(forward,dir.z*speed*dt);
  camera.position.addScaledVector(right,dir.x*speed*dt);
  camera.position.x=THREE.MathUtils.clamp(camera.position.x,-14.5,14.5);
  camera.position.z=THREE.MathUtils.clamp(camera.position.z, -40, 10);
  camera.position.y=1.65;
  camera.rotation.order="YXZ";camera.rotation.y=yaw;camera.rotation.x=pitch;
}
const infoPanel=document.querySelector("#info");
const title=document.querySelector("#infoTitle"),text=document.querySelector("#infoText"),meta=document.querySelector("#infoMeta"),link=document.querySelector("#infoLink"),tag=document.querySelector("#infoTag");

function interact(){
  raycaster.setFromCamera(center,camera);
  const hits=raycaster.intersectObjects(machines,false);
  if(!hits.length)return;
  const g=hits[0].object.userData.game;
  title.textContent=g.title;text.textContent=g.desc;tag.textContent=`${g.tag} // INTERACTIVE`;
  meta.innerHTML=g.meta.map(x=>`<span class="meta">${x}</span>`).join("");
  link.href=g.url;infoPanel.classList.add("visible");document.exitPointerLock();
}
addEventListener("mousedown",e=>{if(e.button===0 && !document.querySelector("#intro").classList.contains("visible"))interact()});

document.querySelector("#enter").addEventListener("click",()=>{
  document.querySelector("#intro").classList.remove("visible");
  canvas.requestPointerLock();
});
document.querySelector("#closeInfo").addEventListener("click",()=>infoPanel.classList.remove("visible"));

const zone=document.querySelector("#zone");
function updateZone(){
  const z=camera.position.z;
  zone.textContent=z> -11?"LOBBY":z>-24?"ARCADE FLOOR":z>-34?"JAM FLOOR":"BACK OFFICE";
}
function animate(){
  requestAnimationFrame(animate);
  const dt=Math.min(clock.getDelta(),.05);
  if(!infoPanel.classList.contains("visible"))move(dt);
  machines.forEach((m,i)=>{m.children.forEach(c=>{if(c.material?.emissiveIntensity!==undefined)c.material.emissiveIntensity=1.7+Math.sin(performance.now()*.002+i)*.8})});
  updateZone();
  renderer.render(scene,camera);
}
animate();

addEventListener("resize",()=>{
 camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);
});
setTimeout(()=>{document.querySelector("#loading").style.opacity="0";setTimeout(()=>document.querySelector("#loading").remove(),700)},1900);
