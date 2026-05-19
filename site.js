/* =========================================================================
   Human–Robot Dialogue · IROS 2026 Workshop
   ========================================================================= */
const {
  useState,
  useEffect,
  useMemo
} = React;

// --- defaults the host can rewrite ---
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "#ff5b35",
  "fontPair": "editorial",
  "heroLayout": "schematic",
  "density": "comfortable"
} /*EDITMODE-END*/;

/* ================================================================ DATA */

const NAV = [{
  id: "overview",
  label: "Overview"
}, {
  id: "topics",
  label: "Topics"
}, {
  id: "dates",
  label: "Dates"
}, {
  id: "cfp",
  label: "Call for Papers"
}, {
  id: "program",
  label: "Program"
}, {
  id: "speakers",
  label: "Speakers"
}, {
  id: "organizers",
  label: "Committee"
}
// { id: "sponsors",   label: "Sponsors" },
];
const TOPICS = [{
  n: "01",
  title: "Motivation",
  items: ["How can dialogue improve robot learning and human–robot interaction?", "How can dialogue reduce the ambiguity and uncertainty of the task and the environment?"]
}, {
  n: "02",
  title: "Robotic Language Grounding",
  items: ["What language grounding representations can induce robot-to-human communication?", "How can robots learn to generate language from their model of language and the environment?"]
}, {
  n: "03",
  title: "Robot Learning & Evaluation",
  items: ["How do we collect a dataset to train a robot for human–robot dialogue? Can we leverage existing robot datasets such as RT-X, Droid, and Bridge?", "What models and architectures should a dialogue robot have — transformers, state-space models?", "What are the proper objective functions for training a dialogue policy?", "Are there post-pretraining methods to adapt foundation models for embodied communication?", "What are good practices to evaluate dialogue systems, including evaluation metrics and benchmark datasets?"]
}, {
  n: "04",
  title: "Human-X Dialogue Informs Human-Robot Dialogue",
  items: ["What can we learn from chatbot, human-agent, and agent-agent communication — e.g. Grice's Maxims?", "How do humans communicate? How does human–human dialogue inform human–robot dialogue, and where do they diverge?", "Is language a sufficient modality for human-robot communication? What other modalities can help, and how?"]
}, {
  n: "05",
  title: "Applications",
  items: ["What are the challenges and opportunities in deploying human–robot dialogue systems across personal assistants, education, healthcare, and beyond?"]
}];
const SPEAKERS = [{
  name: "Joyce Y. Chai",
  aff: "University of Michigan, USA",
  photo: "photos/joyce-chai.jpg"
}, {
  name: "Jacob Andreas",
  aff: "MIT, USA",
  photo: "photos/jacob-andreas.jpg"
}, {
  name: "Jesse Thomason",
  aff: "USC, USA",
  photo: "photos/jesse-thomason.jpg"
}, {
  name: "Bahar Irfan",
  aff: "Familiar Machines & Magic, USA",
  photo: "photos/bahar-irfan.jpg"
}, {
  name: "Dhruv Shah",
  aff: "Princeton University · Google DeepMind, USA",
  photo: "photos/dhruv-shah.jpg",
  role: "Panelist"
}, {
  name: "Gabriel Skantze",
  aff: "KTH · Furhat Robotics, Sweden",
  photo: "photos/gabriel-skantze.jpg",
  role: "Panelist"
}, {
  name: "Matthew Marge",
  aff: "DARPA, USA",
  photo: "photos/matthew-marge.jpg",
  role: "Panelist"
}];
const ORGANIZERS = [{
  name: "Jason Liu",
  aff: "Brown University, USA",
  photo: "photos/jason-liu.jpg"
}, {
  name: "Vardhan Dongre",
  aff: "UIUC, USA",
  photo: "photos/vardhan-dongre.jpg"
}, {
  name: "Rachel Ma",
  aff: "MIT, USA",
  photo: "photos/rachel-ma.jpeg"
}, {
  name: "Xiaolin Fang",
  aff: "Google DeepMind",
  photo: "photos/xiaolin-fang.png"
}, {
  name: "Abrar Anwar",
  aff: "University of Southern California, USA",
  photo: "photos/abrar-anwar.jpeg"
}, {
  name: "Ishika Singh",
  aff: "University of Southern California, USA",
  photo: "photos/ishika-singh.jpg"
}];
const ADVISORY = [{
  name: "Dilek Hakkani-Tür",
  aff: "UIUC, USA",
  photo: "photos/dilek-hakkani-tur.jpeg"
}, {
  name: "Dylan Hadfield-Menell",
  aff: "MIT, USA",
  photo: "photos/dylan-hadfield-menell.jpg"
}, {
  name: "Jesse Thomason",
  aff: "University of Southern California, USA",
  photo: "photos/jesse-thomason.jpg"
}, {
  name: "Stefanie Tellex",
  aff: "Brown University, USA",
  photo: "photos/stefanie-tellex.jpg"
}, {
  name: "Andreea Bobu",
  aff: "MIT, USA",
  photo: "photos/andreea-bobu.jpg"
}, {
  name: "Julie Shah",
  aff: "MIT, USA",
  photo: "photos/julie-shah.jpg"
}];
const PROGRAM = [{
  t: "08:50 – 09:00",
  title: "Opening remarks",
  who: "Organizers",
  kind: "open"
}, {
  t: "09:00 – 09:40",
  title: "Grounding language in shared physical context",
  who: "Speaker · TBD",
  kind: "keynote"
}, {
  t: "09:40 – 10:20",
  title: "Dialogue policies for embodied agents",
  who: "Speaker · TBD",
  kind: "keynote"
}, {
  t: "10:20 – 10:50",
  title: "Coffee & posters",
  who: "",
  kind: "break"
}, {
  t: "10:50 – 11:30",
  title: "Learning to ask: clarification under uncertainty",
  who: "Speaker · TBD",
  kind: "keynote"
}, {
  t: "11:30 – 12:15",
  title: "Contributed talks (3 × 15 min)",
  who: "Accepted papers",
  kind: "talks"
}, {
  t: "12:15 – 13:30",
  title: "Lunch",
  who: "",
  kind: "break"
}, {
  t: "13:30 – 14:10",
  title: "Multimodality beyond language",
  who: "Speaker · TBD",
  kind: "keynote"
}, {
  t: "14:10 – 14:50",
  title: "Evaluating dialogue: benchmarks & beyond",
  who: "Speaker · TBD",
  kind: "keynote"
}, {
  t: "14:50 – 15:20",
  title: "Coffee & posters",
  who: "",
  kind: "break"
}, {
  t: "15:20 – 16:30",
  title: "Panel · Where human-robot dialogue goes next",
  who: "All speakers",
  kind: "panel"
}, {
  t: "16:30 – 17:00",
  title: "Closing & community discussion",
  who: "Organizers",
  kind: "open"
}];
const DATES = [{
  label: "Paper submission",
  value: "TBA",
  state: "tba"
}, {
  label: "Notification",
  value: "TBA",
  state: "tba"
}, {
  label: "Camera-ready",
  value: "TBA",
  state: "tba"
}, {
  label: "Workshop",
  value: "Sept 27, 2026",
  state: "now"
}];

/* ================================================================ utils */

function initials(name) {
  // first letter of each significant part, max 2
  const parts = name.replace(/[.\-]/g, " ").split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/* ================================================================ atoms */

function Monogram({
  name
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "monogram"
  }, initials(name));
}
function HRDLogo({
  size = 28,
  withWordmark = false
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: withWordmark ? "hrd-logo with-wordmark" : "hrd-logo"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "hrd-mark",
    width: size,
    height: size,
    viewBox: "0 0 32 32",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("marker", {
    id: "hrd-arrow-h",
    viewBox: "0 0 6 6",
    refX: "5.5",
    refY: "3",
    markerWidth: "4",
    markerHeight: "4",
    orient: "auto"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0 0 L 6 3 L 0 6 Z",
    className: "hrd-tick-h"
  })), /*#__PURE__*/React.createElement("marker", {
    id: "hrd-arrow-r",
    viewBox: "0 0 6 6",
    refX: "5.5",
    refY: "3",
    markerWidth: "4",
    markerHeight: "4",
    orient: "auto"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0 0 L 6 3 L 0 6 Z",
    className: "hrd-tick-r"
  }))), /*#__PURE__*/React.createElement("path", {
    d: "M 8 16 C 8 6.4, 18.24 4.48, 22.34 10.24",
    className: "hrd-arc-h",
    markerEnd: "url(#hrd-arrow-h)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 24 16 C 24 25.6, 13.76 27.52, 9.66 21.76",
    className: "hrd-arc-r",
    markerEnd: "url(#hrd-arrow-r)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8",
    cy: "16",
    r: "6",
    className: "hrd-h"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "16",
    r: "6",
    className: "hrd-r"
  })), withWordmark && /*#__PURE__*/React.createElement("span", {
    className: "hrd-wordmark"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hrd-wm-1"
  }, "Human"), /*#__PURE__*/React.createElement("span", {
    className: "hrd-wm-dash"
  }, "\u2013"), /*#__PURE__*/React.createElement("span", {
    className: "hrd-wm-2"
  }, "Robot Dialogue")));
}
function Person({
  p,
  role
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "person"
  }, /*#__PURE__*/React.createElement("div", {
    className: p.photo ? "photo has-img" : "photo"
  }, role && /*#__PURE__*/React.createElement("span", {
    className: "role-tag"
  }, role), p.photo ? /*#__PURE__*/React.createElement("img", {
    src: p.photo,
    alt: p.name,
    loading: "lazy"
  }) : /*#__PURE__*/React.createElement(Monogram, {
    name: p.name
  }), /*#__PURE__*/React.createElement("span", {
    className: "corner"
  })), /*#__PURE__*/React.createElement("div", {
    className: "name"
  }, p.name), /*#__PURE__*/React.createElement("div", {
    className: "aff"
  }, p.aff));
}
function SectionHead({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "section-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kicker",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "section-head-body"
  }, /*#__PURE__*/React.createElement("h2", null, label), children && /*#__PURE__*/React.createElement("p", {
    className: "section-sub"
  }, children)));
}

/* ================================================================ schematic motif */

function Schematic() {
  // Abstract dialogue graph: two principal nodes (H + R) connected by
  // a sequence of dashed message arcs, plus a few satellite nodes
  // representing context / grounding tokens.
  return /*#__PURE__*/React.createElement("div", {
    className: "schematic",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 520 520",
    preserveAspectRatio: "xMidYMid meet"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "260",
    cy: "260",
    r: "256",
    className: "satellite"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "260",
    cy: "260",
    r: "218",
    className: "edge-dash"
  }), [{
    x: 260,
    y: 42,
    t: "task"
  }, {
    x: 478,
    y: 260,
    t: "scene"
  }, {
    x: 260,
    y: 478,
    t: "goal"
  }, {
    x: 42,
    y: 260,
    t: "ref"
  }].map((s, i) => /*#__PURE__*/React.createElement("g", {
    key: i
  }, /*#__PURE__*/React.createElement("circle", {
    cx: s.x,
    cy: s.y,
    r: "22",
    className: "satellite"
  }), /*#__PURE__*/React.createElement("text", {
    x: s.x,
    y: s.y + 4,
    textAnchor: "middle",
    className: "node-label"
  }, s.t))), /*#__PURE__*/React.createElement("path", {
    d: "M 165 260 C 200 180, 320 180, 355 260",
    className: "edge-dash"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 165 260 C 200 340, 320 340, 355 260",
    className: "edge-dash"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 165 260 C 220 230, 300 230, 355 260",
    className: "edge"
  }), /*#__PURE__*/React.createElement("g", {
    transform: "translate(225 188)"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "0",
    width: "34",
    height: "14",
    className: "bubble-rect",
    rx: "2"
  }), /*#__PURE__*/React.createElement("text", {
    x: "17",
    y: "10",
    textAnchor: "middle",
    className: "bubble-text"
  }, "u\u2081")), /*#__PURE__*/React.createElement("g", {
    transform: "translate(265 332)"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "0",
    width: "34",
    height: "14",
    className: "bubble-rect",
    rx: "2"
  }), /*#__PURE__*/React.createElement("text", {
    x: "17",
    y: "10",
    textAnchor: "middle",
    className: "bubble-text"
  }, "a\u2082")), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
    cx: "155",
    cy: "260",
    r: "58",
    className: "node-h"
  }), /*#__PURE__*/React.createElement("text", {
    x: "155",
    y: "277",
    textAnchor: "middle",
    className: "node-letter"
  }, "H"), /*#__PURE__*/React.createElement("text", {
    x: "155",
    y: "340",
    textAnchor: "middle",
    className: "node-label"
  }, "HUMAN")), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
    cx: "365",
    cy: "260",
    r: "58",
    className: "node-h node-accent"
  }), /*#__PURE__*/React.createElement("text", {
    x: "365",
    y: "277",
    textAnchor: "middle",
    className: "node-letter on-accent"
  }, "R"), /*#__PURE__*/React.createElement("text", {
    x: "365",
    y: "340",
    textAnchor: "middle",
    className: "node-label"
  }, "ROBOT")), [-1, 0, 1].map(i => /*#__PURE__*/React.createElement("line", {
    key: i,
    x1: 155,
    y1: 205 + i * 8,
    x2: 147,
    y2: 205 + i * 8,
    className: "edge"
  })), [-1, 0, 1].map(i => /*#__PURE__*/React.createElement("line", {
    key: i + 'r',
    x1: 365,
    y1: 205 + i * 8,
    x2: 373,
    y2: 205 + i * 8,
    className: "edge"
  }))));
}

/* ================================================================ sections */

function Nav({
  theme,
  onToggleTheme
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "nav"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container nav-inner"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#top",
    className: "brand"
  }, /*#__PURE__*/React.createElement(HRDLogo, {
    size: 26
  }), /*#__PURE__*/React.createElement("span", null, "HRD\xA0\xB7\xA0IROS\xA02026"), /*#__PURE__*/React.createElement("img", {
    src: "iros-logo.png",
    alt: "IROS 2026",
    className: "brand-logo brand-logo--dark"
  }), /*#__PURE__*/React.createElement("img", {
    src: "iros-logo-dark.png",
    alt: "IROS 2026",
    className: "brand-logo brand-logo--light"
  })), /*#__PURE__*/React.createElement("div", {
    className: "nav-right"
  }, /*#__PURE__*/React.createElement("nav", {
    className: "nav-links"
  }, NAV.map(n => /*#__PURE__*/React.createElement("a", {
    key: n.id,
    href: `#${n.id}`
  }, n.label))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "theme-toggle",
    onClick: onToggleTheme,
    "aria-label": theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
    title: theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  }, theme === "dark" ? /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
  })) : /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
  }))))));
}
function Hero({
  layout
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "hero",
    "data-layout": layout,
    id: "top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-kicker"
  }, /*#__PURE__*/React.createElement("span", {
    className: "accent-dot"
  }), /*#__PURE__*/React.createElement("span", null, "IROS 2026 Workshop"), /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "/"), /*#__PURE__*/React.createElement("span", null, "Pittsburgh, USA"), /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "/"), /*#__PURE__*/React.createElement("span", null, "Sept 27, 2026")), /*#__PURE__*/React.createElement("div", {
    className: "hero-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "hero-title"
  }, "Human", /*#__PURE__*/React.createElement("span", {
    className: "nodash"
  }, "\u2013"), "Robot Dialogue"), /*#__PURE__*/React.createElement("p", {
    className: "hero-sub"
  }, "Leveraging dialogue to improve robot learning and human-robot interaction. A half-day workshop bringing together researchers across robotics, NLP, HRI, and dialogue systems to chart what embodied communication looks like next."), layout === "editorial" && /*#__PURE__*/React.createElement("dl", {
    className: "hero-meta"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Date"), /*#__PURE__*/React.createElement("dd", null, "Sept 27, 2026")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Venue"), /*#__PURE__*/React.createElement("dd", null, "Pittsburgh, USA")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Format"), /*#__PURE__*/React.createElement("dd", null, "Half-day, in-person")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Submissions"), /*#__PURE__*/React.createElement("dd", null, "TBA")))), layout === "schematic" && /*#__PURE__*/React.createElement(Schematic, null), layout === "split" && /*#__PURE__*/React.createElement("div", {
    className: "info-card-list"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, "Date"), /*#__PURE__*/React.createElement("span", {
    className: "value"
  }, "Sept 27, 2026")), /*#__PURE__*/React.createElement("div", {
    className: "info-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, "Venue"), /*#__PURE__*/React.createElement("span", {
    className: "value"
  }, "Pittsburgh, USA")), /*#__PURE__*/React.createElement("div", {
    className: "info-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, "Format"), /*#__PURE__*/React.createElement("span", {
    className: "value"
  }, "Half-day, in-person")), /*#__PURE__*/React.createElement("div", {
    className: "info-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, "Submissions"), /*#__PURE__*/React.createElement("span", {
    className: "value"
  }, "TBA"))))));
}
function Overview() {
  return /*#__PURE__*/React.createElement("section", {
    id: "overview"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "overview-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label mono",
    style: {
      paddingTop: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      width: 22,
      height: 1,
      background: "var(--accent)",
      verticalAlign: "middle",
      marginRight: 12,
      transform: "translateY(-2px)"
    }
  }), "About"), /*#__PURE__*/React.createElement("div", {
    className: "overview-body"
  }, /*#__PURE__*/React.createElement("p", null, "We have seen tremendous progress in robot learning to solve complex tasks in various environments. With the rapid advances of large language models (LLMs) and vision-language models (VLMs), robots are becoming more capable of understanding tasks specified by natural language from humans. While most robot learning works focus on unidirectional communication from humans to robots,", " ", /*#__PURE__*/React.createElement("em", {
    className: "accent"
  }, "having robots that not only understand what human users say but also initiate and engage in conversations"), " ", "can help them learn and deploy more effectively in human environments."), /*#__PURE__*/React.createElement("p", null, "A robot that can only listen and act may not understand ambiguous instructions, which may cause inefficient learning, uninterpretable behaviors, and failures that confuse human users. When a robot can talk, it can learn more effectively by asking clarification questions to reduce uncertainty about the task and the environment. Thus, dialogues help robots generalize better to novel scenarios. Robots can also explain their behaviors, provide status updates, ask humans for help with things they cannot do, and answer questions. As a result, human-robot dialogues enable robots to better align with humans\u2019 intents and preferences and to be more effective, safer, and trustworthy."), /*#__PURE__*/React.createElement("p", null, "In this workshop, we are interested in developing a shared community-level understanding of human-robot dialogue. We will bring together researchers from the fields of robot learning, human-robot interaction, natural language processing, computer vision, foundation models, and cognitive science to assimilate recent advances from diverse perspectives and lead in-depth discussions toward developing a shared vision of the key open problems in human-robot dialogue research.")))));
}
function Topics() {
  return /*#__PURE__*/React.createElement("section", {
    id: "topics"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    label: "Discussion topics"
  }, "The questions we\u2019re putting on the table."), /*#__PURE__*/React.createElement("div", {
    className: "topic-list"
  }, TOPICS.map(t => /*#__PURE__*/React.createElement("div", {
    className: "topic",
    key: t.n
  }, /*#__PURE__*/React.createElement("div", {
    className: "num"
  }, t.n), /*#__PURE__*/React.createElement("h3", null, t.title), /*#__PURE__*/React.createElement("ul", null, t.items.map((i, idx) => /*#__PURE__*/React.createElement("li", {
    key: idx
  }, i))))))));
}
function Dates() {
  return /*#__PURE__*/React.createElement("section", {
    id: "dates"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    label: "Important dates"
  }, "Mark your calendar."), /*#__PURE__*/React.createElement("div", {
    className: "dates"
  }, DATES.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `date-item is-${d.state}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "date-label"
  }, d.label), /*#__PURE__*/React.createElement("div", {
    className: "date-value"
  }, d.value))))));
}
function CFP() {
  return /*#__PURE__*/React.createElement("section", {
    id: "cfp"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    label: "Call for papers"
  }, "Contributions that push the field."), /*#__PURE__*/React.createElement("div", {
    className: "cfp-card"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "The Call for Papers will be announced soon."), /*#__PURE__*/React.createElement("p", null, "We welcome short and long papers on human-robot dialogue, language grounding, embodied communication, dialogue policy learning, evaluation, datasets, and adjacent topics. Submission portal, page limits, and review schedule will be posted here.")), /*#__PURE__*/React.createElement("div", {
    className: "cfp-badge"
  }, "To be announced"))));
}
function Program() {
  return /*#__PURE__*/React.createElement("section", {
    id: "program"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    label: "Program"
  }), /*#__PURE__*/React.createElement("div", {
    className: "program-tba"
  }, "To be announced soon\u2026")));
}
function Speakers() {
  return /*#__PURE__*/React.createElement("section", {
    id: "speakers"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    label: "Speakers & Panelists"
  }), /*#__PURE__*/React.createElement("div", {
    className: "people-grid"
  }, SPEAKERS.map(p => /*#__PURE__*/React.createElement(Person, {
    key: p.name,
    p: p,
    role: p.role || "Speaker"
  })))));
}
function Committee({
  id,
  label,
  title,
  people,
  role
}) {
  return /*#__PURE__*/React.createElement("section", {
    id: id
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    label: label
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "people-grid"
  }, people.map(p => /*#__PURE__*/React.createElement(Person, {
    key: p.name,
    p: p,
    role: role
  })))));
}
function Sponsors() {
  return /*#__PURE__*/React.createElement("section", {
    id: "sponsors"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    label: "Sponsors"
  }, "Support that makes this possible."), /*#__PURE__*/React.createElement("div", {
    className: "sponsor-grid"
  }, [1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement("div", {
    className: "sponsor-slot",
    key: i
  }, "Sponsor slot \xB7 ", String(i).padStart(2, "0")))), /*#__PURE__*/React.createElement("div", {
    className: "sched-note",
    style: {
      marginTop: 24
    }
  }, "Interested in sponsoring? Contact the organizers.")));
}
function Footer() {
  return /*#__PURE__*/React.createElement("footer", null, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "foot-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Workshop"), /*#__PURE__*/React.createElement(HRDLogo, {
    size: 44,
    withWordmark: true
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 12,
      color: "var(--muted)",
      fontSize: 13
    }
  }, "A half-day workshop on leveraging dialogue to improve robot learning and human-robot interaction.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Where & when"), /*#__PURE__*/React.createElement("p", null, "Sept 27, 2026", /*#__PURE__*/React.createElement("br", null), "Pittsburgh, USA"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 12
    }
  }, "Co-located with IROS 2026.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Contact"), /*#__PURE__*/React.createElement("p", null, "For questions about the workshop, papers, or sponsorship,", /*#__PURE__*/React.createElement("br", null), "reach out to the organizing committee."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "mailto:human-robot-dialogue@googlegroups.com"
  }, "human-robot-dialogue@googlegroups.com")))), /*#__PURE__*/React.createElement("div", {
    className: "foot-logo-wrap"
  }, /*#__PURE__*/React.createElement("img", {
    src: "iros-logo.png",
    alt: "IROS 2026",
    className: "foot-logo foot-logo--dark"
  }), /*#__PURE__*/React.createElement("img", {
    src: "iros-logo-dark.png",
    alt: "IROS 2026",
    className: "foot-logo foot-logo--light"
  })), /*#__PURE__*/React.createElement("div", {
    className: "foot-legal"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 \xB7 Human\u2013Robot Dialogue Workshop"), /*#__PURE__*/React.createElement("span", null, "IROS 2026 \xB7 Pittsburgh"))));
}

/* ================================================================ tweak panel */

function SiteTweaks({
  t,
  setTweak
}) {
  return /*#__PURE__*/React.createElement(TweaksPanel, null, /*#__PURE__*/React.createElement(TweakSection, {
    label: "Theme"
  }, /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Mode",
    value: t.theme,
    onChange: v => setTweak("theme", v),
    options: [{
      value: "dark",
      label: "Dark"
    }, {
      value: "light",
      label: "Light"
    }]
  }), /*#__PURE__*/React.createElement(TweakColor, {
    label: "Accent",
    value: t.accent,
    onChange: v => setTweak("accent", v),
    options: ["#ff5b35", "#1f4ed8", "#10b981", "#b91c1c", "#a78bfa"]
  })), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Type"
  }, /*#__PURE__*/React.createElement(TweakSelect, {
    label: "Pairing",
    value: t.fontPair,
    onChange: v => setTweak("fontPair", v),
    options: [{
      value: "editorial",
      label: "Editorial (Instrument Serif · Manrope · JetBrains Mono)"
    }, {
      value: "technical",
      label: "Technical (Space Grotesk · Space Mono)"
    }, {
      value: "classic",
      label: "Classic (Source Serif 4 · IBM Plex)"
    }]
  })), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Hero"
  }, /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Layout",
    value: t.heroLayout,
    onChange: v => setTweak("heroLayout", v),
    options: [{
      value: "editorial",
      label: "Editorial"
    }, {
      value: "schematic",
      label: "Schematic"
    }, {
      value: "split",
      label: "Split"
    }]
  })), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Spacing"
  }, /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Density",
    value: t.density,
    onChange: v => setTweak("density", v),
    options: [{
      value: "compact",
      label: "Compact"
    }, {
      value: "comfortable",
      label: "Comfort"
    }, {
      value: "spacious",
      label: "Spacious"
    }]
  })));
}

/* ================================================================ root */

function App() {
  const initialDefaults = useMemo(() => {
    try {
      const saved = localStorage.getItem("hrd-theme");
      if (saved === "light" || saved === "dark") return {
        ...TWEAK_DEFAULTS,
        theme: saved
      };
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
    try {
      localStorage.setItem("hrd-theme", t.theme);
    } catch (e) {}
  }, [t]);
  const toggleTheme = () => setTweak("theme", t.theme === "dark" ? "light" : "dark");
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Nav, {
    theme: t.theme,
    onToggleTheme: toggleTheme
  }), /*#__PURE__*/React.createElement(Hero, {
    layout: t.heroLayout
  }), /*#__PURE__*/React.createElement(Overview, null), /*#__PURE__*/React.createElement(Topics, null), /*#__PURE__*/React.createElement(Dates, null), /*#__PURE__*/React.createElement(CFP, null), /*#__PURE__*/React.createElement(Program, null), /*#__PURE__*/React.createElement(Speakers, null), /*#__PURE__*/React.createElement(Committee, {
    id: "organizers",
    label: "Organizing committee",
    people: ORGANIZERS,
    role: "Organizer"
  }), /*#__PURE__*/React.createElement(Committee, {
    id: "advisory",
    label: "Advisory committee",
    people: ADVISORY,
    role: "Advisory"
  }), /*#__PURE__*/React.createElement(Footer, null), /*#__PURE__*/React.createElement(SiteTweaks, {
    t: t,
    setTweak: setTweak
  }));
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
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
