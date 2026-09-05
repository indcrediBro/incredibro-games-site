// Small interaction layer: active nav state and gentle reveal effects.
const links=[...document.querySelectorAll('.nav-links a')];
const sections=[...document.querySelectorAll('main section[id]')];
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-35% 0px -55%'});
sections.forEach(s=>io.observe(s));
document.querySelectorAll('.game-card,.info-card').forEach((el,i)=>{el.style.transition='transform .35s ease, border-color .35s ease';el.addEventListener('mouseenter',()=>{el.style.transform='translateY(-3px)';el.style.borderColor='#ff1761'});el.addEventListener('mouseleave',()=>{el.style.transform='';el.style.borderColor=''})});
