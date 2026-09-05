const menu=document.getElementById('menu'), nav=document.getElementById('nav');
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open)});
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const cards=document.querySelectorAll('.game-card');
window.addEventListener('pointermove',e=>{
  const x=(e.clientX/innerWidth-.5), y=(e.clientY/innerHeight-.5);
  document.querySelector('.hero-art')?.style.setProperty('transform',`translate3d(${x*8}px,${y*5}px,0)`);
  document.querySelector('.cabinet')?.style.setProperty('box-shadow',`${-30-x*15}px ${40-y*10}px 80px #000, 0 0 ${55+Math.abs(x)*25}px rgba(31,99,255,.3)`);
},{passive:true});

const sections=[...document.querySelectorAll('main section[id]')];
const links=[...document.querySelectorAll('.nav a')];
const activeObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')===`#${e.target.id}`))}})
},{rootMargin:'-45% 0px -45% 0px'});
sections.forEach(s=>activeObserver.observe(s));
