const links=[...document.querySelectorAll('.nav-links a')];
const sections=[...document.querySelectorAll('main section[id]')];
const progress=document.querySelector('.progress span');
const nav=document.querySelector('.nav');
const cursor=document.querySelector('.cursor-glow');

// Active navigation + fixed glass nav.
const io=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting) links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));
}),{rootMargin:'-35% 0px -55%'});
sections.forEach(s=>io.observe(s));

window.addEventListener('scroll',()=>{
  const max=document.documentElement.scrollHeight-window.innerHeight;
  progress.style.width=max>0?`${(window.scrollY/max)*100}%`:'0%';
  nav.classList.toggle('scrolled',window.scrollY>24);
},{passive:true});

// Scroll reveals.
const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target)}
}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

// Mouse-reactive glow.
window.addEventListener('pointermove',e=>{
  cursor.style.left=`${e.clientX}px`;cursor.style.top=`${e.clientY}px`;cursor.style.opacity='1';
},{passive:true});
window.addEventListener('pointerleave',()=>cursor.style.opacity='0');

// Subtle magnetic buttons.
document.querySelectorAll('.magnetic').forEach(el=>{
  el.addEventListener('pointermove',e=>{
    const r=el.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*.12;
    const y=(e.clientY-r.top-r.height/2)*.18;
    el.style.transform=`translate(${x}px,${y}px)`;
  });
  el.addEventListener('pointerleave',()=>el.style.transform='');
});

// Lightweight 3D card tilt on desktop.
document.querySelectorAll('.tilt-card').forEach(card=>{
  card.addEventListener('pointermove',e=>{
    if(window.innerWidth<900)return;
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(900px) rotateX(${y*-3}deg) rotateY(${x*4}deg) translateY(-4px)`;
  });
  card.addEventListener('pointerleave',()=>card.style.transform='');
});

// Tiny keyboard easter egg. Type GAMES to flash the interface.
let typed='';
window.addEventListener('keydown',e=>{
  if(e.key.length===1){typed=(typed+e.key.toUpperCase()).slice(-5);if(typed==='GAMES'){
    document.body.classList.add('juice');setTimeout(()=>document.body.classList.remove('juice'),900);typed='';
  }}
});
