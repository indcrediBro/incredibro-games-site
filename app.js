import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js';

const root=document.querySelector('#webgl');
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x070a11);
scene.fog=new THREE.FogExp2(0x070a11,.034);
const camera=new THREE.PerspectiveCamera(54,innerWidth/innerHeight,.1,100);
camera.position.set(3.1,3.05,11);

const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.15;
root.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0x9bdfff,0x080a12,1.45));
const cyan=new THREE.PointLight(0x00eaff,42,20);cyan.position.set(6,4,1);scene.add(cyan);
const pink=new THREE.PointLight(0xff2b78,34,19);pink.position.set(7,3,-10);scene.add(pink);
const yellow=new THREE.PointLight(0xffe24a,24,18);yellow.position.set(-4,4,-20);scene.add(yellow);

const floorMat=new THREE.MeshStandardMaterial({color:0x101520,roughness:.82,metalness:.16});
const floor=new THREE.Mesh(new THREE.PlaneGeometry(80,80),floorMat);floor.rotation.x=-Math.PI/2;floor.position.y=-.02;scene.add(floor);
const grid=new THREE.GridHelper(80,40,0x00b4c7,0x252d3d);grid.material.transparent=true;grid.material.opacity=.14;grid.position.y=.01;scene.add(grid);

function addBox(pos,size,color,emissive=0,ei=0){
  const material=new THREE.MeshStandardMaterial({color,roughness:.5,metalness:.3,emissive,emissiveIntensity:ei});
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(...size),material);mesh.position.set(...pos);scene.add(mesh);return mesh;
}

addBox([-11,3,-17],[.35,6,52],0x151b27);
addBox([11,3,-17],[.35,6,52],0x151b27);
for(let z=2;z>-48;z-=5){
  addBox([9.7,4.2,z],[.08,.09,2.9],0x00eaff,0x00eaff,5);
  addBox([-9.7,4.2,z],[.08,.09,2.9],0xff2b78,0xff2b78,4);
}

// A few large, soft panels give the background depth without turning the page into a game level.
for(let i=0;i<7;i++){
  const m=new THREE.Mesh(new THREE.PlaneGeometry(3.8,2.2),new THREE.MeshBasicMaterial({color:i%2?0x10172a:0x0c1c25,transparent:true,opacity:.34,side:THREE.DoubleSide}));
  m.position.set((i%2?1:-1)*(7.5+Math.random()*1.5),2.5,-5-i*6);m.rotation.y=(i%2?-.35:.35);scene.add(m);
}

const cabinetRoot=new THREE.Group();scene.add(cabinetRoot);
const loader=new GLTFLoader();
loader.load('cabinet.glb',gltf=>{
  const base=gltf.scene;
  base.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=false;}});
  const placements=[
    {x:5.1,z:-5,s:1.16,r:.12},
    {x:6.6,z:-14,s:.94,r:-.08},
    {x:5.2,z:-24,s:1.06,r:.1},
    {x:6.7,z:-34,s:.92,r:-.07},
    {x:5.3,z:-43,s:1.03,r:.1}
  ];
  placements.forEach((p,i)=>{
    const g=base.clone(true);g.position.set(p.x,0,p.z);g.scale.setScalar(p.s);g.rotation.y=p.r;g.userData.baseY=p.r;g.userData.phase=i*.8;cabinetRoot.add(g);
  });
},undefined,err=>console.warn('Cabinet model could not be loaded.',err));

// Floating particles are deliberately sparse.
const particles=new THREE.Group();scene.add(particles);
const pMat=new THREE.MeshBasicMaterial({color:0x8defff,transparent:true,opacity:.32});
for(let i=0;i<95;i++){
  const p=new THREE.Mesh(new THREE.SphereGeometry(.018+Math.random()*.018,5,5),pMat);
  p.position.set((Math.random()-.5)*20,Math.random()*6.5,-Math.random()*52);p.userData.phase=Math.random()*Math.PI*2;particles.add(p);
}

let targetScroll=0,scrollSmooth=0,mouseX=0,mouseY=0;
function updateScroll(){const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);targetScroll=Math.min(1,Math.max(0,scrollY/max));document.querySelector('#progress-bar').style.height=`${targetScroll*100}%`;}
addEventListener('scroll',updateScroll,{passive:true});
addEventListener('pointermove',e=>{mouseX=e.clientX/innerWidth-.5;mouseY=e.clientY/innerHeight-.5},{passive:true});
updateScroll();

const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible')}),{threshold:.14});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

const cards=[...document.querySelectorAll('.game-card')];
const originalLights=[38,30,22];
cards.forEach((card,index)=>{
  card.addEventListener('mouseenter',()=>{if(index===0)cyan.intensity=58;if(index===1)pink.intensity=50;if(index===2)yellow.intensity=42;});
  card.addEventListener('mouseleave',()=>{cyan.intensity=originalLights[0];pink.intensity=originalLights[1];yellow.intensity=originalLights[2];});
});

const clock=new THREE.Clock();
function animate(t){
  requestAnimationFrame(animate);
  const dt=clock.getDelta();
  scrollSmooth+=(targetScroll-scrollSmooth)*Math.min(1,dt*4.2);
  const travel=scrollSmooth*48;
  const baseZ=11-travel;
  camera.position.x=3.2+mouseX*.75;
  camera.position.y=3.05-mouseY*.25+Math.sin(t*.00035)*.035;
  camera.position.z=baseZ;
  camera.rotation.y=-.035+mouseX*.035;
  camera.rotation.x=-mouseY*.012;

  const pulse=1+Math.sin(t*.0011)*.06;
  cyan.intensity=originalLights[0]*pulse;
  pink.intensity=originalLights[1]*pulse;
  yellow.intensity=originalLights[2]*pulse;
  cyan.position.set(5.5,4,baseZ-4);
  pink.position.set(7,3,baseZ-11);
  yellow.position.set(-3.5,4,baseZ-19);

  cabinetRoot.children.forEach((g,i)=>{g.position.y=Math.sin(t*.00065+g.userData.phase)*.018;});
  particles.children.forEach((p,i)=>{p.position.y+=Math.sin(t*.00045+p.userData.phase)*dt*.015;if(p.position.y>6.8)p.position.y=0;});
  renderer.render(scene,camera);
}
requestAnimationFrame(animate);

addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});

document.querySelector('#menu').addEventListener('click',()=>document.querySelector('nav').classList.toggle('open'));
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>document.querySelector('nav').classList.remove('open')));
