import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowUpRight, Menu, X, Play } from 'lucide-react';
import './style.css';

// Temporary showreel excerpts. Replace with real project films, posters and descriptions.
const projects = [
  { id: '01', start: 7, title: 'Showreel selection 01', description: 'A moment from the Yellow Couch showreel. Individual project details are coming soon.', color: 'warm', aspect: '16 / 9' },
  { id: '02', start: 55, title: 'Showreel selection 02', description: 'A moment from the Yellow Couch showreel. Individual project details are coming soon.', color: 'purple', aspect: '4 / 5' },
  { id: '03', start: 68, title: 'Showreel selection 03', description: 'A moment from the Yellow Couch showreel. Individual project details are coming soon.', color: 'gold', aspect: '3 / 4' },
  { id: '04', start: 18, title: 'Showreel selection 04', description: 'A moment from the Yellow Couch showreel. Individual project details are coming soon.', color: 'green', aspect: '2.25 / 1' }
];
const capabilities = [
  ['Creative direction', 'Ideas, storytelling and a distinctive visual language.'],
  ['2D & 3D animation', 'Handcrafted motion, characters and entire worlds.'],
  ['Live action', 'Filmmaking, photography and real-world production.'],
  ['Mixed media & AI', 'Combining techniques, with AI as a powerful creative production tool.']
];

function ReelStill({ start }) {
  const ref = useRef(null);
  const onMetadata = () => {
    const v = ref.current;
    if (v && Number.isFinite(v.duration)) v.currentTime = Math.min(start, Math.max(0, v.duration - 0.1));
  };
  return <video ref={ref} className="thumbnail-video" src="/showreel-with-audio.mp4" muted playsInline preload="metadata" onLoadedMetadata={onMetadata} onSeeked={e => e.currentTarget.pause()} tabIndex={-1} aria-hidden="true" disablePictureInPicture />;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactNoticeOpen, setContactNoticeOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const modalVideo = useRef(null);
  const closeButton = useRef(null);
  const previousFocus = useRef(null);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!selected) return;
    previousFocus.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    const onKey = e => {
      if (e.key === 'Escape') setSelected(null);
      if (e.key === 'Tab') {
        const controls = document.querySelector('.project-modal')?.querySelectorAll('button, video[controls]');
        if (!controls?.length) return;
        const first = controls[0], last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      previousFocus.current?.focus?.();
    };
  }, [selected]);

  useEffect(() => {
    const v = modalVideo.current;
    if (!selected || !v) return;
    const seek = () => { try { v.currentTime = selected.start; } catch (_) {} };
    if (v.readyState >= 1) seek();
    else v.addEventListener('loadedmetadata', seek, { once: true });
    return () => v.removeEventListener('loadedmetadata', seek);
  }, [selected]);

  return <>
    <header className="site-header">
      <a className="wordmark" href="#top" onClick={closeMenu} aria-label="Yellow Couch Studio — back to top"><img src="/yellow-couch-logo.svg" alt="Yellow Couch Studio" /></a>
      <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'} id="site-navigation" aria-label="Main navigation">
        <a href="#work" onClick={closeMenu}>WORK</a>
        <a href="#about" onClick={closeMenu}>STUDIO</a>
        <a href="#showreel" onClick={closeMenu}>SHOWREEL</a>
        <a href="#contact" onClick={closeMenu}>CONTACT <ArrowUpRight size={15} aria-hidden="true" /></a>
      </nav>
      <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="site-navigation" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(v => !v)}>{menuOpen ? <X size={23}/> : <Menu size={23}/>}</button>
    </header>
    <main id="top">
      <section className="opening-video" aria-label="Yellow Couch opening film">
        <h1 className="sr-only">Yellow Couch Studio — Film, animation and creative production</h1>
        <div className="opening-shell">
          <div className="opening-frame">
            <video className="opening-video-media" autoPlay muted loop playsInline preload="metadata" aria-label="Silent Yellow Couch studio opening film">
              <source src="/opening-muted.mp4" type="video/mp4" />
            </video>
          </div>
          <a className="scroll-cue" href="#about" aria-label="Scroll down to meet the studio"><span>SCROLL TO EXPLORE</span><ArrowDown size={20} aria-hidden="true"/></a>
        </div>
      </section>
      <section className="studio-section" id="about">
        <div className="section-container studio-layout">
          <div className="studio-head reveal">
            <h2>NO TWO<br/>IDEAS <span className="studio-accent">LOOK</span><br/><span className="studio-accent">THE SAME</span><span className="brand-punct">.</span></h2>
          </div>
          <div className="studio-details reveal">
            <div className="experience"><strong>20<span>+</span></strong><span>YEARS OF CREATIVE EXPERIENCE</span></div>
            <p>We come from film, animation and the arts. Decades of craft, storytelling and visual thinking shape everything we make.</p>
            <p>Today we combine that foundation with new technology and AI — choosing the right tools for every idea.</p>
          </div>
        </div>
      </section>
      <section className="work-section" id="work">
        <div className="section-container">
          <div className="work-head reveal"><h2 className="work-title">SELECTED WORK<span className="brand-punct">.</span></h2><p>A collection of worlds we've brought to life.</p></div>
          <div className="work-columns">
            {[0,1].map(column => <div className="work-column" key={column}>
              {projects.filter((_, index) => index % 2 === column).map(project => <button key={project.id} type="button" className={'work-card reveal '+project.color} style={{aspectRatio: project.aspect}} onClick={() => setSelected(project)} aria-label={'Open '+project.title+' video and details'}>
                <ReelStill start={project.start}/>
                <span className="work-card-play" aria-hidden="true"><Play size={25} fill="currentColor"/></span>
              </button>)}
            </div>)}
          </div>
          <p className="portfolio-note">Gallery preview: these are still excerpts from the showreel. Each real project will use its own original aspect ratio and film.</p>
        </div>
      </section>
      <section className="showreel-section" id="showreel">
        <div className="showreel-inner reveal">
          <div className="showreel-heading"><h2>SHOWREEL<span className="brand-punct">.</span></h2><p>Different worlds. One creative spirit.</p></div>
          <video className="showreel-player" controls playsInline preload="metadata" aria-label="Yellow Couch showreel with audio">
            <source src="/showreel-with-audio.mp4" type="video/mp4"/>
            Your browser does not support video playback.
          </video>
        </div>
      </section>
      <section className="playground-section" id="playground">
        <div className="section-container">
          <div className="playground-intro reveal">
            <h2>OUR <span>PLAYGROUND</span><span className="brand-punct">.</span></h2>
            <p>Yellow Couch is a creative agency and animation studio. We mix live action, 2D, 3D and AI-powered workflows to make work that feels original.</p>
          </div>
          <div className="capabilities-grid">{capabilities.map(([title, detail]) => <div className="capability reveal" key={title}><h3>{title}</h3><p>{detail}</p></div>)}</div>
        </div>
      </section>
      <section className="contact-section" id="contact">
        <div className="section-container contact-content reveal">
          <h2>HAVE A<br/><em>WILD IDEA?</em></h2>
          <p>We'd love to hear about it.</p>
          <button className="contact-button" type="button" aria-expanded={contactNoticeOpen} aria-controls="contact-status" onClick={() => setContactNoticeOpen(open => !open)}>GET IN TOUCH <ArrowUpRight size={21} aria-hidden="true" /></button>
          <p className="contact-status" id="contact-status" role="status">{contactNoticeOpen ? 'We’re preparing our contact details. Please check back soon.' : 'Contact details coming soon.'}</p>
        </div>
      </section>
    </main>
    <footer className="site-footer"><a className="wordmark" href="#top" aria-label="Yellow Couch Studio — back to top"><img src="/yellow-couch-logo.svg" alt="Yellow Couch Studio" /></a><span>© {new Date().getFullYear()} YELLOW COUCH STUDIO</span><a href="#top">BACK TO TOP ↑</a></footer>
    {selected && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setSelected(null); }}>
      <div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-dialog-title" aria-describedby="project-dialog-description">
        <div className="modal-header"><span>YELLOW COUCH / SELECTED WORK</span><button ref={closeButton} className="modal-close" type="button" onClick={() => setSelected(null)} aria-label="Close project"><X size={24}/></button></div>
        <video key={selected.id} ref={modalVideo} className="modal-video" controls playsInline preload="metadata" aria-label={selected.title+' video'}>
          <source src="/showreel-with-audio.mp4" type="video/mp4"/>
        </video>
        <div className="modal-description"><h3 id="project-dialog-title">{selected.title}</h3><p id="project-dialog-description">{selected.description}</p></div>
      </div>
    </div>}
  </>;
}
createRoot(document.getElementById('root')).render(<App />);
