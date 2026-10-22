import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, Menu, X, MoveUpRight } from 'lucide-react';
import './style.css';

const projects = [
  {number:'01',name:'SOFT SIGNAL',type:'3D / CHARACTER / DIRECTION',year:'2026',theme:'peach',shape:'soft',label:'A little out of this world.'},
  {number:'02',name:'IN BLOOM',type:'2D / MIXED MEDIA',year:'2026',theme:'violet',shape:'flower',label:'Ideas in full color.'},
  {number:'03',name:'GOOD VIBRATIONS',type:'MOTION / BRAND FILM',year:'2025',theme:'lime',shape:'rings',label:'Everything moves.'}
];
function Art({shape}) {return <div className={'art art-'+shape} aria-hidden="true"><div className="art-shadow"/><div className="art-core"/><div className="art-accent"/></div>}
function App(){
 const [menu,setMenu]=useState(false);
 useEffect(()=>{const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));return()=>observer.disconnect()},[]);
 return <>
  <main id="top"><section className="opening-video" aria-label="Opening animation video">
    <video className="opening-video-media" autoPlay muted loop playsInline preload="metadata" aria-label="Animation studio opening film">
      <source src="/opening-muted.mp4" type="video/mp4" />
    </video>
  </section>
  <header className="nav"><a className="logo" href="#top" aria-label="Frame home">FRAME<span className="logo-dot">●</span></a><nav className={menu?'nav-links open':'nav-links'} aria-label="Main navigation"><a href="#showreel" onClick={()=>setMenu(false)}>SHOWREEL</a><a href="#work" onClick={()=>setMenu(false)}>WORK</a><a href="#about" onClick={()=>setMenu(false)}>STUDIO</a><a href="#contact" onClick={()=>setMenu(false)}>CONTACT <ArrowUpRight size={15}/></a></nav><button className="menu-toggle" aria-label={menu?'Close menu':'Open menu'} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></header>
  <section className="showreel-section" id="showreel">
    <div className="showreel-content">
      <span className="eyebrow">01 / SHOWREEL</span>
      <h1>OUR <em>SHOWREEL</em></h1>
      <p>A glimpse into the worlds we bring to life.</p>
      <video className="showreel-player" controls playsInline preload="metadata" aria-label="Animation studio showreel with sound">
        <source src="/showreel-with-audio.mp4" type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>
    </div>
  </section>
  <section className="work section" id="work"><div className="section-head reveal"><span className="eyebrow">02 / THE GOOD STUFF</span><h2>SELECTED <em>WORK</em><span className="asterisk">✳</span></h2><p>A few worlds we've imagined. Each one different, each one made with intention.</p></div><div className="projects">{projects.map(p=><article className="project reveal" key={p.number}><div className={'project-visual '+p.theme}><div className="project-top"><span>{p.number} / FEATURED PROJECT</span><span>{p.year}</span></div><Art shape={p.shape}/><span className="project-caption">{p.label}</span><span className="project-arrow"><ArrowUpRight size={22}/></span></div><div className="project-info"><h3>{p.name}</h3><span>{p.type}</span></div></article>)}</div><p className="demo-note">Concept portfolio: these are original CSS visuals and placeholder project names, not real client work.</p></section>
  <section className="manifesto" id="about"><div className="manifesto-inner reveal"><span className="eyebrow">03 / WHO WE ARE</span><h2>NO TWO<br/>IDEAS <span>LOOK</span><br/>THE SAME.</h2><div className="manifesto-bottom"><p>So why should they move the same? We're a multidisciplinary animation studio mixing techniques, breaking formats, and making work that's impossible to ignore.</p><span className="orbit-mark">✳</span></div></div></section>
  <section className="services section"><div className="section-head reveal"><span className="eyebrow">04 / WHAT WE DO</span><h2>OUR <em>PLAYGROUND</em></h2></div><div className="service-list">{[['01','2D ANIMATION','Frame by frame, full of character.'],['02','3D & CGI','A new dimension of possibility.'],['03','MOTION DESIGN','Visual identities with a pulse.'],['04','MIXED MEDIA','The best of every world.']].map(s=><div className="service reveal" key={s[0]}><span>{s[0]}</span><h3>{s[1]}</h3><p>{s[2]}</p><MoveUpRight size={20}/></div>)}</div></section>
  <section className="contact" id="contact"><div className="contact-inner reveal"><span className="eyebrow">05 / LET'S MAKE SOMETHING</span><h2>HAVE A<br/><span>WILD IDEA?</span></h2><p>We'd love to hear about it.</p><a className="contact-button" href="mailto:hello@example.com?subject=Let's%20make%20something">LET'S TALK <ArrowUpRight size={21}/></a><p className="placeholder-warning">Demo email address — replace before publishing publicly.</p></div></section></main>
  <footer><a className="logo" href="#top">FRAME<span className="logo-dot">●</span></a><span>© {new Date().getFullYear()} FRAME STUDIO — DEMO CONCEPT</span><a href="#top">BACK TO TOP ↑</a></footer>
 </>
}

createRoot(document.getElementById('root')).render(<App/>);
