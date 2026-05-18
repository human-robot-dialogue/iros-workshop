/* =========================================================================
   Human–Robot Dialogue · IROS 2026 Workshop
   ========================================================================= */
const { useState, useEffect, useMemo } = React;

// --- defaults the host can rewrite ---
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "#ff5b35",
  "fontPair": "editorial",
  "heroLayout": "schematic",
  "density": "comfortable"
}/*EDITMODE-END*/;

/* ================================================================ DATA */

const NAV = [
  { id: "overview",   label: "Overview" },
  { id: "topics",     label: "Topics" },
  { id: "dates",      label: "Dates" },
  { id: "cfp",        label: "Call for Papers" },
  { id: "program",    label: "Program" },
  { id: "speakers",   label: "Speakers" },
  { id: "organizers", label: "Committee" },
  { id: "sponsors",   label: "Sponsors" },
];

const TOPICS = [
  {
    n: "01",
    title: "Motivation",
    items: [
      "How can dialogue improve robot learning and human–robot interaction?",
      "How can dialogue reduce the ambiguity and uncertainty of the task and the environment?",
    ],
  },
  {
    n: "02",
    title: "Robotic Language Grounding",
    items: [
      "What language grounding representations can induce robot-to-human communication?",
      "How can robots learn to generate language from their model of language and the environment?",
    ],
  },
  {
    n: "03",
    title: "Robot Learning & Evaluation",
    items: [
      "How do we collect a dataset to train a robot for human–robot dialogue? Can we leverage existing robot datasets such as RT-X, Droid, and Bridge?",
      "What models and architectures should a dialogue robot have — transformers, state-space models?",
      "What are the proper objective functions for training a dialogue policy?",
      "Are there post-pretraining methods to adapt foundation models for embodied communication?",
      "What are good practices to evaluate dialogue systems, including evaluation metrics and benchmark datasets?",
    ],
  },
  {
    n: "04",
    title: "Human-X Dialogue Informs Human-Robot Dialogue",
    items: [
      "What can we learn from chatbot, human-agent, and agent-agent communication — e.g. Grice's Maxims?",
      "How do humans communicate? How does human–human dialogue inform human–robot dialogue, and where do they diverge?",
      "Is language a sufficient modality for human-robot communication? What other modalities can help, and how?",
    ],
  },
  {
    n: "05",
    title: "Applications",
    items: [
      "What are the challenges and opportunities in deploying human–robot dialogue systems across personal assistants, education, healthcare, and beyond?",
    ],
  },
];

const SPEAKERS = [
  { name: "Joyce Y. Chai",   aff: "University of Michigan, USA",            photo: "photos/joyce-chai.jpg" },
  { name: "Jacob Andreas",   aff: "MIT, USA",                               photo: "photos/jacob-andreas.jpg" },
  { name: "Jesse Thomason",  aff: "USC, USA",                               photo: "photos/jesse-thomason.jpg" },
  { name: "Bahar Irfan",     aff: "Familiar Machines & Magic, USA",        photo: "photos/bahar-irfan.jpg" },
  { name: "Dhruv Shah",      aff: "Princeton University · Google DeepMind, USA", photo: "photos/dhruv-shah.jpg",     role: "Panelist" },
  { name: "Gabriel Skantze", aff: "KTH · Furhat Robotics, Sweden",           photo: "photos/gabriel-skantze.jpg", role: "Panelist" },
  { name: "Matthew Marge",   aff: "DARPA, USA",                             photo: "photos/matthew-marge.jpg",   role: "Panelist" },
];

const ORGANIZERS = [
  { name: "Jason Liu",      aff: "Brown University, USA",                  photo: "photos/jason-liu.jpg" },
  { name: "Vardhan Dongre", aff: "UIUC, USA",                              photo: "photos/vardhan-dongre.jpg" },
  { name: "Rachel Ma",      aff: "MIT, USA",                               photo: "photos/rachel-ma.jpeg" },
  { name: "Xiaolin Fang",   aff: "Google DeepMind",                        photo: "photos/xiaolin-fang.png" },
  { name: "Abrar Anwar",    aff: "University of Southern California, USA", photo: "photos/abrar-anwar.jpeg" },
  { name: "Ishika Singh",   aff: "University of Southern California, USA", photo: "photos/ishika-singh.jpg" },
];

const ADVISORY = [
  { name: "Dilek Hakkani-Tür",     aff: "UIUC, USA",                              photo: "photos/dilek-hakkani-tur.jpeg" },
  { name: "Dylan Hadfield-Menell", aff: "MIT, USA",                               photo: "photos/dylan-hadfield-menell.jpg" },
  { name: "Jesse Thomason",        aff: "University of Southern California, USA", photo: "photos/jesse-thomason.jpg" },
  { name: "Stefanie Tellex",       aff: "Brown University, USA",                  photo: "photos/stefanie-tellex.jpg" },
  { name: "Andreea Bobu",          aff: "MIT, USA",                               photo: "photos/andreea-bobu.jpg" },
  { name: "Julie Shah",            aff: "MIT, USA",                               photo: "photos/julie-shah.jpg" },
];

const PROGRAM = [
  { t: "08:50 – 09:00", title: "Opening remarks", who: "Organizers", kind: "open" },
  { t: "09:00 – 09:40", title: "Grounding language in shared physical context", who: "Speaker · TBD", kind: "keynote" },
  { t: "09:40 – 10:20", title: "Dialogue policies for embodied agents",         who: "Speaker · TBD", kind: "keynote" },
  { t: "10:20 – 10:50", title: "Coffee & posters",                              who: "",              kind: "break" },
  { t: "10:50 – 11:30", title: "Learning to ask: clarification under uncertainty", who: "Speaker · TBD", kind: "keynote" },
  { t: "11:30 – 12:15", title: "Contributed talks (3 × 15 min)",                who: "Accepted papers", kind: "talks" },
  { t: "12:15 – 13:30", title: "Lunch",                                         who: "",              kind: "break" },
  { t: "13:30 – 14:10", title: "Multimodality beyond language",                 who: "Speaker · TBD", kind: "keynote" },
  { t: "14:10 – 14:50", title: "Evaluating dialogue: benchmarks & beyond",      who: "Speaker · TBD", kind: "keynote" },
  { t: "14:50 – 15:20", title: "Coffee & posters",                              who: "",              kind: "break" },
  { t: "15:20 – 16:30", title: "Panel · Where human-robot dialogue goes next",  who: "All speakers",  kind: "panel" },
  { t: "16:30 – 17:00", title: "Closing & community discussion",                who: "Organizers",    kind: "open" },
];

const DATES = [
  { label: "Paper submission", value: "TBA",            state: "tba" },
  { label: "Notification",     value: "TBA",            state: "tba" },
  { label: "Camera-ready",     value: "TBA",            state: "tba" },
  { label: "Workshop",         value: "Sept 27, 2026",  state: "now" },
];

/* ================================================================ utils */

function initials(name) {
  // first letter of each significant part, max 2
  const parts = name.replace(/[.\-]/g, " ").split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/* ================================================================ atoms */

function Monogram({ name }) {
  return <span className="monogram">{initials(name)}</span>;
}

function HRDLogo({ size = 28, withWordmark = false }) {
  return (
    <span className={withWordmark ? "hrd-logo with-wordmark" : "hrd-logo"}>
      <svg className="hrd-mark" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <marker id="hrd-arrow-h" viewBox="0 0 6 6" refX="5.5" refY="3"
                  markerWidth="4" markerHeight="4" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 Z" className="hrd-tick-h" />
          </marker>
          <marker id="hrd-arrow-r" viewBox="0 0 6 6" refX="5.5" refY="3"
                  markerWidth="4" markerHeight="4" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 Z" className="hrd-tick-r" />
          </marker>
        </defs>
        <path d="M 8 16 C 8 6.4, 18.24 4.48, 22.34 10.24"
              className="hrd-arc-h" markerEnd="url(#hrd-arrow-h)" />
        <path d="M 24 16 C 24 25.6, 13.76 27.52, 9.66 21.76"
              className="hrd-arc-r" markerEnd="url(#hrd-arrow-r)" />
        <circle cx="8"  cy="16" r="6" className="hrd-h" />
        <circle cx="24" cy="16" r="6" className="hrd-r" />
      </svg>
      {withWordmark && (
        <span className="hrd-wordmark">
          <span className="hrd-wm-1">Human</span>
          <span className="hrd-wm-dash">–</span>
          <span className="hrd-wm-2">Robot Dialogue</span>
        </span>
      )}
    </span>
  );
}

function Person({ p, role }) {
  return (
    <div className="person">
      <div className={p.photo ? "photo has-img" : "photo"}>
        {role && <span className="role-tag">{role}</span>}
        {p.photo
          ? <img src={p.photo} alt={p.name} loading="lazy" />
          : <Monogram name={p.name} />}
        <span className="corner" />
      </div>
      <div className="name">{p.name}</div>
      <div className="aff">{p.aff}</div>
    </div>
  );
}

function SectionHead({ label, children }) {
  return (
    <div className="section-head">
      <div className="kicker" aria-hidden="true" />
      <div className="section-head-body">
        <h2>{label}</h2>
        {children && <p className="section-sub">{children}</p>}
      </div>
    </div>
  );
}

/* ================================================================ schematic motif */

function Schematic() {
  // Abstract dialogue graph: two principal nodes (H + R) connected by
  // a sequence of dashed message arcs, plus a few satellite nodes
  // representing context / grounding tokens.
  return (
    <div className="schematic" aria-hidden="true">
      <svg viewBox="0 0 520 520" preserveAspectRatio="xMidYMid meet">
        {/* outer ring (subtle) */}
        <circle cx="260" cy="260" r="256" className="satellite" />
        {/* dashed orbit */}
        <circle cx="260" cy="260" r="218" className="edge-dash" />

        {/* satellite nodes around orbit */}
        {[
          { x: 260, y: 42,  t: "task" },
          { x: 478, y: 260, t: "scene" },
          { x: 260, y: 478, t: "goal" },
          { x: 42,  y: 260, t: "ref" },
        ].map((s, i) => (
          <g key={i}>
            <circle cx={s.x} cy={s.y} r="22" className="satellite" />
            <text x={s.x} y={s.y + 4} textAnchor="middle" className="node-label">{s.t}</text>
          </g>
        ))}

        {/* dialogue edges: curved between H and R */}
        <path d="M 165 260 C 200 180, 320 180, 355 260" className="edge-dash" />
        <path d="M 165 260 C 200 340, 320 340, 355 260" className="edge-dash" />
        <path d="M 165 260 C 220 230, 300 230, 355 260" className="edge" />

        {/* small message bubbles along the upper arc */}
        <g transform="translate(225 188)">
          <rect x="0" y="0" width="34" height="14" className="bubble-rect" rx="2" />
          <text x="17" y="10" textAnchor="middle" className="bubble-text">u₁</text>
        </g>
        <g transform="translate(265 332)">
          <rect x="0" y="0" width="34" height="14" className="bubble-rect" rx="2" />
          <text x="17" y="10" textAnchor="middle" className="bubble-text">a₂</text>
        </g>

        {/* Human node — outlined */}
        <g>
          <circle cx="155" cy="260" r="58" className="node-h" />
          <text x="155" y="277" textAnchor="middle" className="node-letter">H</text>
          <text x="155" y="340" textAnchor="middle" className="node-label">HUMAN</text>
        </g>

        {/* Robot node — accent filled */}
        <g>
          <circle cx="365" cy="260" r="58" className="node-h node-accent" />
          <text x="365" y="277" textAnchor="middle" className="node-letter on-accent">R</text>
          <text x="365" y="340" textAnchor="middle" className="node-label">ROBOT</text>
        </g>

        {/* tick marks at H/R indicating turns */}
        {[-1, 0, 1].map((i) => (
          <line key={i}
                x1={155} y1={205 + i * 8}
                x2={147} y2={205 + i * 8}
                className="edge" />
        ))}
        {[-1, 0, 1].map((i) => (
          <line key={i + 'r'}
                x1={365} y1={205 + i * 8}
                x2={373} y2={205 + i * 8}
                className="edge" />
        ))}
      </svg>
    </div>
  );
}

/* ================================================================ sections */

function Nav({ theme, onToggleTheme }) {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <a href="#top" className="brand">
          <HRDLogo size={26} />
          <span>HRD&nbsp;·&nbsp;IROS&nbsp;2026</span>
          <img src="iros-logo.png"      alt="IROS 2026" className="brand-logo brand-logo--dark" />
          <img src="iros-logo-dark.png" alt="IROS 2026" className="brand-logo brand-logo--light" />
        </a>
        <div className="nav-right">
          <nav className="nav-links">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`}>{n.label}</a>
            ))}
          </nav>
          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero({ layout }) {
  return (
    <section className="hero" data-layout={layout} id="top">
      <div className="container">
        <div className="hero-kicker">
          <span className="accent-dot" />
          <span>IROS 2026 Workshop</span>
          <span className="sep">/</span>
          <span>Pittsburgh, USA</span>
          <span className="sep">/</span>
          <span>Sept 27, 2026</span>
        </div>

        <div className="hero-grid">
          <div>
            <h1 className="hero-title">
              Human<span className="nodash">–</span>Robot Dialogue
            </h1>
            <p className="hero-sub">
              Leveraging dialogue to improve robot learning and human-robot interaction.
              A half-day workshop bringing together researchers across robotics, NLP, HRI,
              and dialogue systems to chart what embodied communication looks like next.
            </p>

            {layout === "editorial" && (
              <dl className="hero-meta">
                <div><dt>Date</dt><dd>Sept 27, 2026</dd></div>
                <div><dt>Venue</dt><dd>Pittsburgh, USA</dd></div>
                <div><dt>Format</dt><dd>Half-day, in-person</dd></div>
                <div><dt>Submissions</dt><dd>TBA</dd></div>
              </dl>
            )}
          </div>

          {layout === "schematic" && <Schematic />}

          {layout === "split" && (
            <div className="info-card-list">
              <div className="info-card">
                <span className="label">Date</span>
                <span className="value">Sept 27, 2026</span>
              </div>
              <div className="info-card">
                <span className="label">Venue</span>
                <span className="value">Pittsburgh, USA</span>
              </div>
              <div className="info-card">
                <span className="label">Format</span>
                <span className="value">Half-day, in-person</span>
              </div>
              <div className="info-card">
                <span className="label">Submissions</span>
                <span className="value">TBA</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Overview() {
  return (
    <section id="overview">
      <div className="container">
        <div className="overview-grid">
          <div className="label mono" style={{ paddingTop: 10 }}>
            <span style={{
              display: "inline-block", width: 22, height: 1,
              background: "var(--accent)", verticalAlign: "middle",
              marginRight: 12, transform: "translateY(-2px)"
            }} />
            About
          </div>
          <div className="overview-body">
            <p>
              We have seen tremendous progress in robot learning to solve complex
              tasks in various environments. With the rapid advances of large
              language models (LLMs) and vision-language models (VLMs), robots are
              becoming more capable of understanding tasks specified by natural
              language from humans. While most robot learning works focus on
              unidirectional communication from humans to robots,
              {" "}<em className="accent">having robots that not only understand what human users say but also initiate and engage in conversations</em>{" "}
              can help them learn and deploy more effectively in human environments.
            </p>
            <p>
              A robot that can only listen and act may not understand ambiguous
              instructions, which may cause inefficient learning, uninterpretable
              behaviors, and failures that confuse human users. When a robot can
              talk, it can learn more effectively by asking clarification questions
              to reduce uncertainty about the task and the environment. Thus,
              dialogues help robots generalize better to novel scenarios. Robots
              can also explain their behaviors, provide status updates, ask humans
              for help with things they cannot do, and answer questions. As a
              result, human-robot dialogues enable robots to better align with
              humans&rsquo; intents and preferences and to be more effective, safer,
              and trustworthy.
            </p>
            <p>
              In this workshop, we are interested in developing a shared
              community-level understanding of human-robot dialogue. We will bring
              together researchers from the fields of robot learning, human-robot
              interaction, natural language processing, computer vision, foundation
              models, and cognitive science to assimilate recent advances from
              diverse perspectives and lead in-depth discussions toward developing
              a shared vision of the key open problems in human-robot dialogue
              research.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Topics() {
  return (
    <section id="topics">
      <div className="container">
        <SectionHead label="Discussion topics">
          The questions we&rsquo;re putting on the table.
        </SectionHead>
        <div className="topic-list">
          {TOPICS.map((t) => (
            <div className="topic" key={t.n}>
              <div className="num">{t.n}</div>
              <h3>{t.title}</h3>
              <ul>
                {t.items.map((i, idx) => <li key={idx}>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Dates() {
  return (
    <section id="dates">
      <div className="container">
        <SectionHead label="Important dates">
          Mark your calendar.
        </SectionHead>
        <div className="dates">
          {DATES.map((d, i) => (
            <div key={i} className={`date-item is-${d.state}`}>
              <div className="date-label">{d.label}</div>
              <div className="date-value">{d.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CFP() {
  return (
    <section id="cfp">
      <div className="container">
        <SectionHead label="Call for papers">
          Contributions that push the field.
        </SectionHead>
        <div className="cfp-card">
          <div>
            <h3>The Call for Papers will be announced soon.</h3>
            <p>
              We welcome short and long papers on human-robot dialogue, language
              grounding, embodied communication, dialogue policy learning,
              evaluation, datasets, and adjacent topics. Submission portal,
              page limits, and review schedule will be posted here.
            </p>
          </div>
          <div className="cfp-badge">To be announced</div>
        </div>
      </div>
    </section>
  );
}

function Program() {
  return (
    <section id="program">
      <div className="container">
        <SectionHead label="Program" />
        <div className="program-tba">To be announced soon&hellip;</div>
        {/* Program schedule hidden until finalized.
        <div className="schedule">
          {PROGRAM.map((r, i) => (
            <div key={i} className={`sched-row kind-${r.kind}`}>
              <div className="t">{r.t}</div>
              <div className="title">{r.title}</div>
              <div className="who">{r.who}</div>
            </div>
          ))}
        </div>
        <div className="sched-note">
          All times Eastern · Final program announced closer to the workshop date.
        </div>
        */}
      </div>
    </section>
  );
}

function Speakers() {
  return (
    <section id="speakers">
      <div className="container">
        <SectionHead label="Speakers & Panelists" />
        <div className="people-grid">
          {SPEAKERS.map((p) => (
            <Person key={p.name} p={p} role={p.role || "Speaker"} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Committee({ id, label, title, people, role }) {
  return (
    <section id={id}>
      <div className="container">
        <SectionHead label={label}>{title}</SectionHead>
        <div className="people-grid">
          {people.map((p) => (
            <Person key={p.name} p={p} role={role} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Sponsors() {
  return (
    <section id="sponsors">
      <div className="container">
        <SectionHead label="Sponsors">
          Support that makes this possible.
        </SectionHead>
        <div className="sponsor-grid">
          {[1, 2, 3, 4].map((i) => (
            <div className="sponsor-slot" key={i}>Sponsor slot · {String(i).padStart(2, "0")}</div>
          ))}
        </div>
        <div className="sched-note" style={{ marginTop: 24 }}>
          Interested in sponsoring? Contact the organizers.
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="foot-grid">
          <div>
            <h4>Workshop</h4>
            <HRDLogo size={44} withWordmark />
            <p style={{ marginTop: 12, color: "var(--muted)", fontSize: 13 }}>
              A half-day workshop on leveraging dialogue to improve robot learning
              and human-robot interaction.
            </p>
          </div>
          <div>
            <h4>Where & when</h4>
            <p>Sept 27, 2026<br />Pittsburgh, USA</p>
            <p style={{ marginTop: 12 }}>Co-located with IROS 2026.</p>
          </div>
          <div>
            <h4>Contact</h4>
            <p>For questions about the workshop, papers, or sponsorship,<br />reach out to the organizing committee.</p>
            <p style={{ marginTop: 12 }}><a href="mailto:human-robot-dialogue@googlegroups.com">human-robot-dialogue@googlegroups.com</a></p>
          </div>
        </div>
        <div className="foot-logo-wrap">
          <img src="iros-logo.png"      alt="IROS 2026" className="foot-logo foot-logo--dark" />
          <img src="iros-logo-dark.png" alt="IROS 2026" className="foot-logo foot-logo--light" />
        </div>
        <div className="foot-legal">
          <span>© 2026 · Human–Robot Dialogue Workshop</span>
          <span>IROS 2026 · Pittsburgh</span>
        </div>
      </div>
    </footer>
  );
}

/* ================================================================ tweak panel */

function SiteTweaks({ t, setTweak }) {
  return (
    <TweaksPanel>
      <TweakSection label="Theme">
        <TweakRadio
          label="Mode"
          value={t.theme}
          onChange={(v) => setTweak("theme", v)}
          options={[
            { value: "dark",  label: "Dark" },
            { value: "light", label: "Light" },
          ]}
        />
        <TweakColor
          label="Accent"
          value={t.accent}
          onChange={(v) => setTweak("accent", v)}
          options={["#ff5b35", "#1f4ed8", "#10b981", "#b91c1c", "#a78bfa"]}
        />
      </TweakSection>

      <TweakSection label="Type">
        <TweakSelect
          label="Pairing"
          value={t.fontPair}
          onChange={(v) => setTweak("fontPair", v)}
          options={[
            { value: "editorial", label: "Editorial (Instrument Serif · Manrope · JetBrains Mono)" },
            { value: "technical", label: "Technical (Space Grotesk · Space Mono)" },
            { value: "classic",   label: "Classic (Source Serif 4 · IBM Plex)" },
          ]}
        />
      </TweakSection>

      <TweakSection label="Hero">
        <TweakRadio
          label="Layout"
          value={t.heroLayout}
          onChange={(v) => setTweak("heroLayout", v)}
          options={[
            { value: "editorial", label: "Editorial" },
            { value: "schematic", label: "Schematic" },
            { value: "split",     label: "Split" },
          ]}
        />
      </TweakSection>

      <TweakSection label="Spacing">
        <TweakRadio
          label="Density"
          value={t.density}
          onChange={(v) => setTweak("density", v)}
          options={[
            { value: "compact",     label: "Compact" },
            { value: "comfortable", label: "Comfort" },
            { value: "spacious",    label: "Spacious" },
          ]}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

/* ================================================================ root */

function App() {
  const initialDefaults = useMemo(() => {
    try {
      const saved = localStorage.getItem("hrd-theme");
      if (saved === "light" || saved === "dark") return { ...TWEAK_DEFAULTS, theme: saved };
    } catch (e) {}
    return TWEAK_DEFAULTS;
  }, []);
  const [t, setTweak] = useTweaks(initialDefaults);

  // sync root attributes for theme / density / fontPair / accent
  useEffect(() => {
    const r = document.documentElement;
    r.dataset.theme = t.theme;
    r.dataset.fontpair = t.fontPair;
    r.dataset.density = t.density;
    r.style.setProperty("--accent", t.accent);
    // pick legible text-on-accent — light accent => dark ink, dark accent => light ink
    const accentLight = isLight(t.accent);
    r.style.setProperty("--accent-ink", accentLight ? "#0b0b0c" : "#ffffff");
    try { localStorage.setItem("hrd-theme", t.theme); } catch (e) {}
  }, [t]);

  const toggleTheme = () => setTweak("theme", t.theme === "dark" ? "light" : "dark");

  return (
    <>
      <Nav theme={t.theme} onToggleTheme={toggleTheme} />
      <Hero layout={t.heroLayout} />
      <Overview />
      <Topics />
      <Dates />
      <CFP />
      <Program />
      <Speakers />
      <Committee id="organizers" label="Organizing committee" people={ORGANIZERS} role="Organizer" />
      <Committee id="advisory"   label="Advisory committee"   people={ADVISORY}   role="Advisory" />
      <Sponsors />
      <Footer />
      <SiteTweaks t={t} setTweak={setTweak} />
    </>
  );
}

// crude luminance check for accent text contrast
function isLight(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
