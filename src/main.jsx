import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowUpRight, Menu, X, Play, Volume2, VolumeX } from 'lucide-react';
import './style.css';

// Selected Work: five films, with a balanced two-column editorial layout.
const projects = [
  { id: 'taskora', title: 'TASKORA — TAKE BACK YOUR DAY', description: 'AI Personal Assistant · Commercial', video: '/projects/taskora-take-back-your-day.mp4', poster: '/projects/taskora-take-back-your-day.jpg', color: 'warm', aspect: '16 / 9' },
  { id: 'girls-fashion', title: "GIRLS' FASHION", description: 'Baby & Kids Boutique · Social Media Campaign', video: '/projects/girls-fashion.mp4', poster: '/projects/girls-fashion.jpg', color: 'gold', aspect: '1072 / 1928' },
  { id: '3004', title: '3004 — GROW SMARTER', description: 'Small Garden Planning App · Investor Presentation', video: '/projects/3004-grow-smarter.mp4', poster: '/projects/3004-grow-smarter.jpg', color: 'green', aspect: '16 / 9' },
  { id: 'boys-fashion', title: "BOYS' FASHION", description: 'Baby & Kids Boutique · Social Media Campaign', video: '/projects/boys-fashion.mp4', poster: '/projects/boys-fashion.jpg', color: 'gold', aspect: '1072 / 1928' },
  { id: 'collection', title: 'COLLECTION IN MOTION', description: 'Cotnot Or · Fashion Campaign · Social Media', video: '/projects/collection-in-motion.mp4', poster: '/projects/collection-in-motion.jpg', color: 'gold', aspect: '9 / 16' }
];
const projectById = Object.fromEntries(projects.map(project => [project.id, project]));

const capabilities = [
  ['Creative direction', 'Ideas, storytelling and a distinctive visual language.'],
  ['2D & 3D animation', 'Handcrafted motion, characters and entire worlds.'],
  ['Live action', 'Filmmaking, photography and real-world production.'],
  ['Mixed media & AI', 'Combining techniques, with AI as a powerful creative production tool.']
];

function ProjectPoster({ project }) {
  const [failed, setFailed] = useState(false);
  return <>
    {!failed && <img className="work-card-poster" src={project.poster} alt="" loading="lazy" onError={() => setFailed(true)}/>}
    {failed && <span className="work-card-fallback" aria-hidden="true"><span>{project.title}</span></span>}
  </>;
}

function WorkCard({ project, onOpen }) {
  return <button type="button" className={'work-card work-card--' + project.id + ' reveal ' + project.color} onClick={() => onOpen(project)} aria-label={'View ' + project.title}>
    <ProjectPoster project={project}/>
    <span className="work-card-play" aria-hidden="true"><Play size={25} fill="currentColor"/></span>
    <span className="work-card-info"><strong>{project.title}</strong><small>{project.description}</small></span>
  </button>;
}

/* Each heading types exactly once, in sequence, without CSS animation conflicts. */
const TYPE_STEP_MS = 75;
const TYPE_BASE_MS = 160;
function TypeLine({ parts, start = 0, children, tight = false }) {
  const lineRef = useRef(null);
  const fullText = parts.map(part => part.text).join('');
  const letters = Array.from(fullText);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const parent = lineRef.current?.closest('.reveal');
    if (!parent) { setShown(letters.length); return; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(letters.length);
      return;
    }
    let initialTimer, tickTimer, started = false;
    const begin = () => {
      if (started) return;
      started = true;
      initialTimer = window.setTimeout(() => {
        let count = 0;
        const tick = () => {
          count += 1;
          setShown(Math.min(count, letters.length));
          if (count >= letters.length) window.clearInterval(tickTimer);
        };
        tick();
        if (letters.length > 1) tickTimer = window.setInterval(tick, TYPE_STEP_MS);
      }, TYPE_BASE_MS + start * TYPE_STEP_MS);
    };
    const watch = new MutationObserver(() => {
      if (parent.classList.contains('visible')) begin();
    });
    watch.observe(parent, { attributes: true, attributeFilter: ['class'] });
    if (parent.classList.contains('visible')) begin();
    return () => {
      watch.disconnect();
      window.clearTimeout(initialTimer);
      window.clearInterval(tickTimer);
    };
  }, [fullText, start]);

  let index = 0;
  return <span className={tight ? "type-line type-line-tight" : "type-line"} ref={lineRef} role="text" aria-label={fullText}>
    {parts.map((part, partIndex) =>
      <span className={'type-part' + (part.accent ? ' studio-accent' : '') + (part.italic ? ' type-italic' : '')} aria-hidden="true" key={partIndex}>
        {tight
          ? part.text.slice(0, Math.max(0, Math.min(part.text.length, shown - parts.slice(0, partIndex).reduce((total, item) => total + item.text.length, 0))))
          : Array.from(part.text).map((char, charIndex) => {
              const charPosition = index++;
              return <span className="type-char" key={charIndex} style={{visibility: charPosition < shown ? 'visible' : 'hidden'}}>{char}</span>;
            })}
      </span>
    )}
    {children && <span className="type-suffix" style={{visibility: shown >= letters.length ? 'visible' : 'hidden'}}>{children}</span>}
  </span>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [compactLogo, setCompactLogo] = useState(false);
  const [selected, setSelected] = useState(null);
  const [videoError, setVideoError] = useState(false);
  const [openingMuted, setOpeningMuted] = useState(true);
  const openingVideo = useRef(null);
  const modalVideo = useRef(null);
  const closeButton = useRef(null);
  const previousFocus = useRef(null);
  const closeMenu = () => setMenuOpen(false);
  const toggleOpeningSound = () => {
    const video = openingVideo.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setOpeningMuted(nextMuted);
    if (video.paused) video.play().catch(() => {});
  };

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
    const updateLogo = () => setCompactLogo(window.scrollY > 130);
    updateLogo();
    window.addEventListener('scroll', updateLogo, { passive: true });
    return () => window.removeEventListener('scroll', updateLogo);
  }, []);

  useEffect(() => { setVideoError(false); }, [selected]);

  return <>
    <header className={"site-header" + (compactLogo ? " logo-compact" : "")}>
      <a className="wordmark header-wordmark" href="#top" onClick={closeMenu} aria-label="Yellow Couch Studio — back to top"><img className="logo-full" src="/yellow-couch-logo.svg" alt="" /><img className="logo-couch" src="/yellow-couch-couch.svg" alt="" /></a>
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
            <video ref={openingVideo} className="opening-video-media" autoPlay muted={openingMuted} loop playsInline preload="metadata" onVolumeChange={e => setOpeningMuted(e.currentTarget.muted)} aria-label="Yellow Couch studio opening film">
              <source src="/opening-muted.mp4" type="video/mp4" />
            </video>
            <button type="button" className={'opening-sound-toggle' + (openingMuted ? '' : ' is-unmuted')} onClick={toggleOpeningSound} aria-label={openingMuted ? 'Turn opening video sound on' : 'Mute opening video'} aria-pressed={!openingMuted} title={openingMuted ? 'Turn sound on' : 'Mute sound'}>
              {openingMuted ? <VolumeX size={21} strokeWidth={1.8} aria-hidden="true"/> : <Volume2 size={21} strokeWidth={1.8} aria-hidden="true"/>}
            </button>
          </div>
          <a className="scroll-cue" href="#about" aria-label="Scroll down to meet the studio"><span className="yc-triangle yc-triangle-down" aria-hidden="true"></span></a>
        </div>
      </section>
      <section className="studio-section" id="about">
        <div className="section-container studio-layout">
          <div className="studio-head reveal">
            <h2><TypeLine parts={[{text:'MAKE IT'}]} start={0}/><TypeLine parts={[{text:'ART',accent:true}]} start={9}><span className="brand-punct" aria-hidden="true"></span></TypeLine></h2>
          </div>
          <div className="studio-details reveal">
            <div className="experience"><strong>20<span className="experience-plus">+</span></strong><span>YEARS OF CREATIVE EXPERIENCE</span></div>
            <p>We believe even the smallest story deserves a big idea. We blend art, storytelling and technology to create work that feels anything but ordinary.</p>
          </div>
        </div>
      </section>
      <section className="work-section" id="work">
        <div className="section-container">
          <div className="work-head reveal"><h2 className="work-title"><TypeLine tight parts={[{text:'SELECTED'}]}/><TypeLine tight parts={[{text:'WORK'}]} start={10}><span className="brand-punct" aria-hidden="true"></span></TypeLine></h2><p>A collection of worlds we've brought to life.</p></div>
          <div className="work-mosaic" aria-label="Selected work projects">
            <div className="work-mosaic-top">
              <WorkCard project={projectById.taskora} onOpen={setSelected}/>
              <WorkCard project={projectById.collection} onOpen={setSelected}/>
            </div>
            <div className="work-mosaic-lower">
              <div className="work-mosaic-fashion">
                <WorkCard project={projectById['boys-fashion']} onOpen={setSelected}/>
                <WorkCard project={projectById['girls-fashion']} onOpen={setSelected}/>
              </div>
              <WorkCard project={projectById['3004']} onOpen={setSelected}/>
            </div>
          </div>
          
        </div>
      </section>
      <section className="showreel-section" id="showreel">
        <div className="showreel-inner reveal">
          <div className="showreel-heading"><h2><TypeLine tight parts={[{text:'SHOWREEL'}]}><span className="brand-punct" aria-hidden="true"></span></TypeLine></h2><p>Different worlds. One creative spirit.</p></div>
          <video className="showreel-player" controls playsInline preload="metadata" aria-label="Yellow Couch showreel with audio">
            <source src="/showreel-with-audio.mp4" type="video/mp4"/>
            Your browser does not support video playback.
          </video>
        </div>
      </section>
      <section className="playground-section" id="playground">
        <div className="section-container">
          <div className="playground-intro reveal">
            <div className="playground-title-wrap">
              <h2><TypeLine tight parts={[{text:'OUR'}]}/><TypeLine tight parts={[{text:'PLAYGROUND'}]} start={5}><span className="brand-punct" aria-hidden="true"></span></TypeLine></h2>
            </div>
            <p>Yellow Couch is a creative agency and animation studio. We mix live action, 2D, 3D and AI-powered workflows to make work that feels original.</p>
          </div>
          <div className="capabilities-grid">{capabilities.map(([title, detail]) => <div className="capability reveal" key={title}><h3>{title}</h3><p>{detail}</p></div>)}</div>
        </div>
      </section>
      <section className="contact-section" id="contact">
        <div className="section-container contact-content reveal">
          <h2><TypeLine parts={[{text:'HAVE A'}]} start={0}/><TypeLine parts={[{text:'WILD IDEA',italic:true}]} start={9}><span className="question-mark" aria-hidden="true">?</span></TypeLine></h2>
          <p>We'd love to hear about it.</p>
          <a className="contact-button" href="mailto:yellowcouchstudio@gmail.com?subject=Let%27s%20talk%20about%20a%20project" aria-label="Let's talk — email Yellow Couch Studio">LET'S TALK <span className="yc-triangle yc-triangle-right" aria-hidden="true"></span></a>
          
        </div>
      </section>
    </main>
    <footer className="site-footer"><a className="wordmark" href="#top" aria-label="Yellow Couch Studio — back to top"><img src="/yellow-couch-logo.svg" alt="Yellow Couch Studio" /></a><span>© {new Date().getFullYear()} YELLOW COUCH STUDIO</span><a className="footer-email" href="mailto:yellowcouchstudio@gmail.com">yellowcouchstudio@gmail.com</a><a href="#top">BACK TO TOP ↑</a></footer>
    {selected && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setSelected(null); }}>
      <div className={'project-modal' + (selected.aspect !== '16 / 9' ? ' is-portrait' : '')} role="dialog" aria-modal="true" aria-labelledby="project-dialog-title" aria-describedby="project-dialog-description">
        <div className="modal-header"><span>YELLOW COUCH / SELECTED WORK</span><button ref={closeButton} className="modal-close" type="button" onClick={() => setSelected(null)} aria-label="Close project"><X size={24}/></button></div>
        {videoError ? <div className="modal-video-unavailable">The full project video is being prepared for the website.</div> :
          <video key={selected.id} ref={modalVideo} className="modal-video" controls playsInline preload="metadata" poster={selected.poster} onError={() => setVideoError(true)} aria-label={selected.title+' video'}>
            <source src={selected.video} type="video/mp4" onError={() => setVideoError(true)}/>
          </video>}
        <div className="modal-description"><h3 id="project-dialog-title">{selected.title}</h3><p id="project-dialog-description">{selected.description}</p></div>
      </div>
    </div>}
  </>;
}
createRoot(document.getElementById('root')).render(<App />);
