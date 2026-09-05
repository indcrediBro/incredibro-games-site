import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js';

const root=document.querySelector('#webgl');
let renderer,scene,camera,world,heroCabinet;
try{
 scene=new THREE.Scene(); scene.background=new THREE.Color(0x05070d); scene.fog=new THREE.FogExp2(0x05070d,.035);
 camera=new THREE.PerspectiveCamera(50,innerWidth/innerHeight,.1,100);
 renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5)); renderer.setSize(innerWidth,innerHeight); renderer.outputColorSpace=THREE.SRGBColorSpace; root.appendChild(renderer.domElement);
 buildWorld();
 loadCabinet();
 animate();
}catch(e){console.warn('WebGL background unavailable',e);root.style.display='none'}

function buildWorld(){
 world=new THREE.Group();scene.add(world);
 scene.add(new THREE.HemisphereLight(0xa8dfff,0x080a12,1.2));
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(80,80),new THREE.MeshStandardMaterial({color:0x080d15,roughness:.9,metalness:.1}));floor.rotation.x=-Math.PI/2;floor.position.y=-.01;world.add(floor);
 const grid=new THREE.GridHelper(80,40,0x00a9bb,0x1c2735);grid.material.transparent=true;grid.material.opacity=.13;grid.position.y=.01;world.add(grid);
 for(let i=0;i<10;i++){
   const x=-11+i*2.45,z=-3-i*5.4;
   const g=new THREE.Group();g.position.set(x,0,z);world.add(g);
   const body=new THREE.Mesh(new THREE.BoxGeometry(1.65,2.9,.65),new THREE.MeshStandardMaterial({color:0x101622,roughness:.5,metalness:.35}));body.position.y=1.45;g.add(body);
   const glowColor=i%3===0?0x00eaff:i%3===1?0xff2bd6:0x7e4cff;
   const screen=new THREE.Mesh(new THREE.PlaneGeometry(1.25,.9),new THREE.MeshBasicMaterial({color:glowColor}));screen.position.set(0,2.2,.35);g.add(screen);
   const light=new THREE.PointLight(glowColor,2.8,5);light.position.set(0,2.1,.7);g.add(light);
 }
 for(let i=0;i<28;i++){
   const c=i%2?0x00eaff:0xff2bd6; const m=new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.38}); const p=new THREE.Mesh(new THREE.SphereGeometry(.025,5,5),m);
   p.position.set((Math.random()-.5)*24,Math.random()*7-0.2,-Math.random()*58);p.userData.speed=.00025+Math.random()*.00045;world.add(p);
 }
 const neonA=new THREE.PointLight(0x00eaff,24,16);neonA.position.set(-5,4,-8);world.add(neonA);
 const neonB=new THREE.PointLight(0xff2bd6,26,18);neonB.position.set(8,3,-18);world.add(neonB);
 const neonC=new THREE.PointLight(0x7e4cff,22,15);neonC.position.set(-2,4,-31);world.add(neonC);
}

function loadCabinet(){
 const loader=new GLTFLoader(); loader.load('cabinet.glb',gltf=>{
   heroCabinet=gltf.scene; heroCabinet.scale.setScalar(1.45); heroCabinet.position.set(4.6,-.02,-3.8); heroCabinet.rotation.y=-.18; world.add(heroCabinet);
   heroCabinet.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=false}});
 },undefined,()=>{});
}

let targetX=0,targetY=0,mouseX=0,mouseY=0,scroll=0,scrollSmooth=0;
addEventListener('pointermove',e=>{targetX=e.clientX/innerWidth-.5;targetY=e.clientY/innerHeight-.5},{passive:true});
addEventListener('scroll',()=>{const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);scroll=scrollY/max},{passive:true});
function animate(t=0){requestAnimationFrame(animate);mouseX+=(targetX-mouseX)*.035;mouseY+=(targetY-mouseY)*.035;scrollSmooth+=(scroll-scrollSmooth)*.045;
 const mobile=innerWidth<650; const depth=scrollSmooth*16;
 camera.position.x=(mobile?0.5:1.1)+mouseX*(mobile?.28:.7); camera.position.y=2.4-mouseY*.28; camera.position.z=8-depth*.55;
 camera.lookAt((mobile?0:2.3)+mouseX*.15,2.1,-8-depth*.2);
 world.rotation.y=mouseX*.018; world.rotation.x=mouseY*.006;
 if(heroCabinet){heroCabinet.position.x=(mobile?2.8:4.6)+mouseX*.55;heroCabinet.position.y=-.02-mouseY*.12;heroCabinet.position.z=-3.8-depth*.18;heroCabinet.rotation.y=-.18+mouseX*.06;}
 world.children.forEach(o=>{if(o.isMesh&&o.userData.speed){o.position.y+=Math.sin(t*.001)*o.userData.speed;if(o.position.y>7)o.position.y=0}});
 renderer.render(scene,camera);
}
addEventListener('resize',()=>{if(!renderer)return;camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});

const menu=document.querySelector('#menu');menu.addEventListener('click',()=>{const n=document.querySelector('nav');const open=n.classList.toggle('open');menu.setAttribute('aria-expanded',open)});
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{document.querySelector('nav').classList.remove('open');menu.setAttribute('aria-expanded','false')}));
