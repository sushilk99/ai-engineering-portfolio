import { capabilities, certification, education, experience, learningTopics, profile, projects, skillGroups } from "@/data/site";
import { ChatAssistant } from "@/components/ChatAssistant";
import { ProjectVisual } from "@/components/ProjectVisual";
import { SystemMap } from "@/components/SystemMap";

export function Portfolio() {
  return (
    <>
      <div className="site-noise" aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="#top" aria-label={`${profile.name} home`}>
          <span className="brand__mark" aria-hidden="true"><span /></span>
          <span>{profile.name}</span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#approach">Approach</a>
          <a href="#skills">Skills</a>
          <a href="#experience">Experience</a>
        </nav>
        <a className="button button--dark button--small header-contact" href="#contact">Let’s talk <span aria-hidden="true">↗</span></a>
        <a className="mobile-contact" href="#contact">Contact ↗</a>
      </header>

      <main id="top">
        <section className="hero page-wrap" aria-labelledby="hero-title">
          <div className="hero__copy">
            <p className="eyebrow">{profile.eyebrow}</p>
            <p className="availability"><span className="signal-dot" />{profile.status}</p>
            <h1 id="hero-title">{profile.headline.map((line, index) => <span key={line}>{line}{index === 2 && <i>.</i>}</span>)}</h1>
            <p className="hero__summary">{profile.summary}</p>
            <div className="hero__actions">
              <a className="button button--dark" href="#work">Explore selected work <span aria-hidden="true">↓</span></a>
              <a className="text-link" href="#experience">See my background <span aria-hidden="true">↗</span></a>
            </div>
            <p className="hero__motto">BUILD · TEST · LEARN · GROW · REPEAT</p>
          </div>
          <div className="hero__visual"><SystemMap /></div>
          <div className="hero__side-label" aria-hidden="true">BUILD · TEST · LEARN · GROW · REPEAT</div>
        </section>

        <section className="proof-strip page-wrap" aria-label="Areas of focus">
          <div className="proof-strip__intro"><span>THE THREAD</span><strong>Systems thinking<br />with a quality mindset.</strong></div>
          <div className="proof-item"><span>01 / AI APPLICATIONS</span><strong>LLMs · RAG · Agents</strong></div>
          <div className="proof-item"><span>02 / SOFTWARE</span><strong>Product · APIs · Full stack</strong></div>
          <div className="proof-item"><span>03 / QUALITY</span><strong>Automation · V&amp;V · Evaluation</strong></div>
        </section>

        <section id="work" className="work-section page-wrap section-space" aria-labelledby="work-title">
          <div className="section-heading">
          <div><p className="eyebrow">SELECTED WORK</p><h2 id="work-title">Built work. Next ideas.</h2></div>
            <p>Personal projects, full-stack builds, and the next AI system on the roadmap—clearly marked by status.</p>
          </div>
          <div className="project-grid">
            {projects.map((project, index) => (
              <article id={project.anchor} className={`project-card project-card--${project.variant}${project.status.startsWith("PLANNED") ? " project-card--planned" : ""}`} key={project.title}>
                <div className="project-card__visual"><ProjectVisual variant={project.variant} /><span className="project-index">0{index + 1}</span></div>
                <div className="project-card__body">
                  <div className="project-card__meta"><p className="project-category">{project.category}</p>{project.year && <span className="project-year">{project.year}</span>}</div>
                  <h3>{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <ul className="project-highlights">{project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
                  <div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <span className="project-status">{project.status}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="approach" className="approach-section page-wrap" aria-labelledby="approach-title">
          <div className="approach-heading">
            <p className="eyebrow">HOW I APPROACH A PROBLEM</p>
            <h2 id="approach-title">Build it.<br /><em>Verify it.</em><br />Improve it.</h2>
            <p>Automation and V&amp;V work bring a useful habit to AI engineering: define what good looks like, then gather evidence that the system gets there.</p>
          </div>
          <div className="approach-steps">
            {capabilities.map((step) => (
              <div className="approach-step" key={step.number}>
                <span className="step-number">{step.number}</span>
                <div><h3>{step.title}</h3><p>{step.detail}</p></div>
                <span className="step-arrow" aria-hidden="true">↗</span>
              </div>
            ))}
            <div className="approach-footnote"><span className="signal-dot" />Clarity before complexity.</div>
          </div>
        </section>

        <section id="skills" className="skills-section page-wrap section-space" aria-labelledby="skills-title">
          <div className="section-heading">
            <div><p className="eyebrow">TOOLS &amp; PRACTICE</p><h2 id="skills-title">A practical toolkit.</h2></div>
            <p>Skills are grouped by how they show up across software projects, AI applications, and quality work.</p>
          </div>
          <div className="skill-grid">
            {skillGroups.map((group) => (
              <article className="skill-card" key={group.title}>
                <p className="skill-card__title">{group.title}</p>
                <div className="learning-tags">{group.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" className="experience-section page-wrap section-space" aria-labelledby="experience-title">
          <div className="section-heading section-heading--compact">
            <div><p className="eyebrow">CAREER</p><h2 id="experience-title">The foundation.</h2></div>
            <p>Verification, validation, and backend development experience shape how I build software.</p>
          </div>
          <div className="career-list">
            {experience.map((item, index) => (
              <article id={index === 0 ? "experience-schneider-electric" : "experience-hcltech"} className="experience-row" key={item.company}>
                <div className="experience-date">{index === 0 && <span className="timeline-dot" />}{item.period}</div>
                <div className="experience-main"><h3>{item.role}</h3><p className="experience-company">{item.company}</p><p>{item.description}</p><div className="experience-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
                <div className="experience-meta"><span>{index === 0 ? "VERIFICATION & VALIDATION" : "BACKEND DEVELOPMENT"}</span></div>
              </article>
            ))}
          </div>
          <div id="learning" className="learning-row">
            <div><p className="eyebrow">EXPLORING NEXT</p><h3>Building the AI layer.</h3><p>These topics guide the planned RAG assistant project and ongoing learning.</p></div>
            <div className="learning-tags">{learningTopics.map((topic) => <span key={topic}>{topic}</span>)}</div>
          </div>
          <div id="education" className="education-block">
            <div className="education-heading"><p id="certification" className="eyebrow">EDUCATION &amp; CERTIFICATION</p><span>{certification}</span></div>
            <div className="education-grid">
              {education.map((item) => <article className="education-card" key={item.degree}><h3>{item.degree}</h3><p>{item.institution}</p><span>{item.result}</span></article>)}
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section page-wrap" aria-labelledby="contact-title">
          <div className="contact-orbit" aria-hidden="true"><span /><span /><span /><span /></div>
          <div className="contact-copy">
            <p className="eyebrow">CONTACT</p>
            <h2 id="contact-title">Let’s build<br />something useful.</h2>
            <p>Have a thoughtful AI application or software problem to solve? I’d be glad to connect.</p>
          </div>
          <div className="contact-actions">
            {profile.email && <a className="button button--mint" href={`mailto:${profile.email}`}>Email me <span aria-hidden="true">↗</span></a>}
            {profile.linkedin && <a className="contact-social" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>}
            {profile.github && <a className="contact-social" href={profile.github} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>}
          </div>
          <div className="contact-bottom"><span>AI ENGINEERING · SOFTWARE DEVELOPMENT · QUALITY</span><a href="#top">BACK TO TOP ↑</a></div>
        </section>
      </main>
      <ChatAssistant />
    </>
  );
}
