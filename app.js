import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x080b12);
scene.fog=new THREE.FogExp2(0x080b12,.045);
const camera=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.1,80);
camera.position.set(3.2,3.2,12);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;
document.querySelector('#webgl').appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xaadfff,0x10131e,1.7));
const cyan=new THREE.PointLight(0x00eaff,38,18);cyan.position.set(4,4,1);scene.add(cyan);
const pink=new THREE.PointLight(0xff2bd6,30,17);pink.position.set(7,3,-9);scene.add(pink);
const yellow=new THREE.PointLight(0xffe600,24,16);yellow.position.set(-3,4,-19);scene.add(yellow);

const floor=new THREE.Mesh(new THREE.PlaneGeometry(70,70),new THREE.MeshStandardMaterial({color:0x111722,roughness:.85,metalness:.1}));floor.rotation.x=-Math.PI/2;scene.add(floor);
const grid=new THREE.GridHelper(70,35,0x00a7bd,0x263041);grid.material.transparent=true;grid.material.opacity=.16;grid.position.y=.01;scene.add(grid);

function mat(c,r=.5,m=.2){return new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m})}
function box(x,y,z,sx,sy,sz,c){const m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),mat(c));m.position.set(x,y,z);scene.add(m);return m}
box(-10,3,-16,.35,6,48,0x171d29);box(11,3,-16,.35,6,48,0x171d29);
for(let z=0;z>-45;z-=6){const a=box(9.6,4,z,.08,.1,3.5,0x00eaff);a.material.emissive.set(0x00eaff);a.material.emissiveIntensity=3;const b=box(-9.6,4,z,.08,.1,3.5,0xff2bd6);b.material.emissive.set(0xff2bd6);b.material.emissiveIntensity=3}

function cabinet(x,z,accent){
 const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
 const body=new THREE.Mesh(new THREE.BoxGeometry(2.65,4.5,1.2),mat(0x252d3e,.42,.3));body.position.y=2.25;g.add(body);
 const hood=new THREE.Mesh(new THREE.BoxGeometry(2.9,1,1.42),mat(0x30394e,.38,.35));hood.position.set(0,4.35,.02);hood.rotation.x=-.12;g.add(hood);
 const glow=new THREE.MeshBasicMaterial({color:accent});const marquee=new THREE.Mesh(new THREE.BoxGeometry(2.3,.4,.05),glow);marquee.position.set(0,4.32,.74);g.add(marquee);
 const screen=new THREE.Mesh(new THREE.PlaneGeometry(2.12,1.58),new THREE.MeshBasicMaterial({color:0x080d16}));screen.position.set(0,3.42,.67);screen.rotation.x=-.08;g.add(screen);
 const frame=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(2.18,1.64)),new THREE.LineBasicMaterial({color:accent,transparent:true,opacity:.55}));frame.position.copy(screen.position);frame.position.z+=.01;frame.rotation.copy(screen.rotation);g.add(frame);
 const panel=new THREE.Mesh(new THREE.BoxGeometry(2.38,.34,1),mat(0x141a27,.3,.4));panel.position.set(0,2.2,.53);panel.rotation.x=.12;g.add(panel);
 const light=new THREE.PointLight(accent,7,7);light.position.set(0,3.4,1);g.add(light);
 return g;
}
const cabinets=[cabinet(5.8,-7,0x00eaff),cabinet(6.3,-13,0xff2bd6),cabinet(5.7,-22,0xffe600),cabinet(6.2,-29,0x00eaff),cabinet(5.8,-37,0xff2bd6)];

const dots=[];const dotMat=new THREE.MeshBasicMaterial({color:0x00eaff,transparent:true,opacity:.45});
for(let i=0;i<80;i++){const p=new THREE.Mesh(new THREE.SphereGeometry(.018,5,5),dotMat);p.position.set((Math.random()-.5)*20,Math.random()*6,Math.random()*-48);scene.add(p);dots.push(p)}

let scroll=0,scrollSmooth=0,mouseX=0,mouseY=0;
addEventListener('scroll',()=>{const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);scroll=scrollY/max},{passive:true});
addEventListener('pointermove',e=>{mouseX=e.clientX/innerWidth-.5;mouseY=e.clientY/innerHeight-.5},{passive:true});

const cards=[...document.querySelectorAll('.game-card')];
let activeGlow=0;
cards.forEach((card,i)=>card.addEventListener('mouseenter',()=>{activeGlow=i+1}));
cards.forEach(card=>card.addEventListener('mouseleave',()=>activeGlow=0));

function animate(t){requestAnimationFrame(animate);scrollSmooth+=(scroll-scrollSmooth)*.055;
 const z=12-scrollSmooth*48;
 camera.position.x=3.3+mouseX*.8;camera.position.y=3.1-mouseY*.35;camera.position.z=z;
 camera.rotation.y=-.035+mouseX*.035;camera.rotation.x=-mouseY*.012;
 const pulse=1+Math.sin(t*.0012)*.06;
 cyan.intensity=activeGlow===1?55:38*pulse;pink.intensity=activeGlow===2?52:30*pulse;yellow.intensity=activeGlow===3?42:24*pulse;
 cyan.position.z=z-3;pink.position.z=z-10;yellow.position.z=z-18;
 dots.forEach((p,i)=>{p.position.y+=Math.sin(t*.0007+i)*.0005;if(p.position.y>6)p.position.y=0});
 renderer.render(scene,camera)}requestAnimationFrame(animate);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});

document.querySelector('#menu').addEventListener('click',()=>document.querySelector('nav').classList.toggle('open'));
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>document.querySelector('nav').classList.remove('open')));
