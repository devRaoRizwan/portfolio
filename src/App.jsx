import { identity, links, nav, bio, skillLines, projects, history } from './data/content';
import { useScrollSpy } from './hooks/useScrollSpy';

const SECTION_IDS = nav.map(([id]) => id);

export default function App() {
  const active = useScrollSpy(SECTION_IDS);

  return (
    <>
      <header className="topbar">
        <span className="mark">RR</span>
        <nav>
          {nav.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>{label}</a>
          ))}
        </nav>
        <a className="topbar-cta" href={`mailto:${links.email}`}>Say hello</a>
      </header>

      <main>
        <section className="hero">
          <div className="hero-main">
            <p className="hero-role"><span className="dot" />{identity.role}</p>
            <h1>{identity.name}</h1>
          </div>
          <div className="hero-side">
            <p>{identity.pitch}</p>
            <p className="hero-history">{history}</p>
          </div>
        </section>

        <section id="work">
          <h2>Work</h2>
          <div className="project-list">
            {projects.map((p, i) => (
              <article key={p.name}>
                <span className="project-index">{String(i + 1).padStart(2, '0')}</span>
                <div className="project-body">
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <div className="project-foot">
                    <span className="stack">{p.stack}</span>
                    {p.demo
                      ? <a className="project-link" href={p.demo} target="_blank" rel="noreferrer">View live ↗</a>
                      : <span className="note">{p.note}</span>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="about">
          <h2>About</h2>
          <div className="about-grid">
            <div className="about-copy">
              {bio.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </section>

        <section id="skills">
          <h2>Skills</h2>
          <div className="skill-grid">
            {skillLines.map(([label, list]) => (
              <div key={label}>
                <h3>{label}</h3>
                <p>{list}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="contact">
          <h2>Contact</h2>
          <a className="email-link" href={`mailto:${links.email}`}>{links.email}</a>
          <div className="contact-links">
            <a href={links.github} target="_blank" rel="noreferrer">GitHub</a>
            <a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a href={links.resume} target="_blank" rel="noreferrer">Resume</a>
            <a href={links.leetcode} target="_blank" rel="noreferrer">LeetCode</a>
            <a href={links.gfg} target="_blank" rel="noreferrer">GeeksforGeeks</a>
          </div>
        </section>
      </main>

      <footer>
        <span>{identity.name}</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </>
  );
}
