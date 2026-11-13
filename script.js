// Mobilmeny
const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('nav');
toggle.addEventListener('click',()=>{const o=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',o)});
// "Om oss"-meny
document.querySelectorAll('.dropdown > button').forEach(b=>b.addEventListener('click',e=>{
  e.stopPropagation();const o=b.parentElement.classList.toggle('open');b.setAttribute('aria-expanded',o)}));
document.addEventListener('click',()=>document.querySelectorAll('.dropdown.open').forEach(d=>d.classList.remove('open')));
// Mjuk inglidning vid scroll
const els=document.querySelectorAll('.section .wrap > *, .tile, .feature, .img-card');
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.1});
els.forEach(el=>{el.classList.add('reveal');io.observe(el)});
