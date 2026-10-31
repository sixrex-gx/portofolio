'use client';

import Image from 'next/image';
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';

type TabId = 'projects' | 'stack';

type Project = {
  id: string;
  meta: [string, string];
  title: string;
  repo: string;
  mediaHref: string;
  linkLabel: string;
  description: string;
  tags: string[];
  cta: { label: string; href: string };
  image?: { src: string; alt: string; width: number; height: number };
  cover?: { className: string; mark: string; label: string };
};

const navItems = [
  { id: 'top', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'contact', label: 'Contact' },
];

const phrases = [
  'Student & Builder',
  'Frontend Learner',
  'Linux Tinkerer',
  'Problem Solver',
];

const projects: Project[] = [
  {
    id: 'zenon',
    meta: ['01', 'Featured project'],
    title: 'zenon',
    repo: 'https://github.com/sixrex-gx/zenon',
    mediaHref: 'https://github.com/sixrex-gx/zenon',
    linkLabel: 'zenon on GitHub',
    description:
      'A lightweight Dynamic Island-style overlay for Linux. Media controls, a Pomodoro timer, a file shelf, and weather sit inside one compact pill.',
    tags: ['Python', 'GTK 3', 'Cairo'],
    cta: { label: 'Details', href: 'https://github.com/sixrex-gx/zenon' },
    image: {
      src: '/assets/zenon.webp',
      alt: 'Zenon overlay showing media, Pomodoro, shelf, and weather slides',
      width: 1072,
      height: 496,
    },
  },
  {
    id: 'semyopal',
    meta: ['02', 'Live site'],
    title: 'Semyopal II',
    repo: 'https://github.com/sixrex-gx/Semyopal-II_nextjs',
    mediaHref: 'https://semyopal-ii.vercel.app/',
    linkLabel: 'Semyopal II live site',
    description:
      'A Next.js site for SMAK Seminari St. Yohanes Paulus II in Labuan Bajo, built around a Tesla-inspired design system.',
    tags: ['TypeScript', 'Next.js'],
    cta: { label: 'Live demo', href: 'https://semyopal-ii.vercel.app/' },
    cover: {
      className: 'cover-semyopal',
      mark: 'S',
      label: 'Next.js / TypeScript',
    },
  },
  {
    id: 'setia',
    meta: ['03', 'Final project'],
    title: 'Setia Adhiguna',
    repo: 'https://github.com/sixrex-gx/project_setia_adhiguna',
    mediaHref: 'https://github.com/sixrex-gx/project_setia_adhiguna',
    linkLabel: 'Setia Adhiguna on GitHub',
    description:
      'Final project for the Information Systems program: a Laravel web application for Setia Adhiguna.',
    tags: ['Laravel', 'JavaScript'],
    cta: {
      label: 'Details',
      href: 'https://github.com/sixrex-gx/project_setia_adhiguna',
    },
    cover: {
      className: 'cover-setia',
      mark: 'SA',
      label: 'Laravel / JavaScript',
    },
  },
  {
    id: 'pesona',
    meta: ['04', 'In progress'],
    title: 'Pesona Manggarai',
    repo: 'https://github.com/sixrex-gx/Pesona-Manggarai',
    mediaHref: 'https://github.com/sixrex-gx/Pesona-Manggarai',
    linkLabel: 'Pesona Manggarai on GitHub',
    description:
      'A web introduction to the landscapes and culture of Manggarai, Flores. Still in progress.',
    tags: ['Web', 'In progress'],
    cta: {
      label: 'Details',
      href: 'https://github.com/sixrex-gx/Pesona-Manggarai',
    },
    cover: {
      className: 'cover-pesona',
      mark: 'PM',
      label: 'Web / In progress',
    },
  },
];

const stackGroups = [
  {
    title: 'Languages',
    index: '01',
    items: [
      ['Python', 'zenon'],
      ['TypeScript', 'Semyopal II'],
      ['JavaScript', 'Setia Adhiguna'],
      ['PHP', 'Laravel'],
    ],
  },
  {
    title: 'Frameworks',
    index: '02',
    items: [
      ['Next.js', 'Semyopal II / this site'],
      ['Laravel', 'Setia Adhiguna'],
    ],
  },
  {
    title: 'Tools',
    index: '03',
    items: [
      ['Linux', 'X11'],
      ['GTK 3', 'zenon'],
      ['Cairo', 'zenon'],
      ['Git', 'version control'],
      ['Vercel', 'deployment'],
    ],
  },
];

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('top');
  const [typed, setTyped] = useState(phrases[0]);
  const [portraitBroken, setPortraitBroken] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('projects');
  const [sending, setSending] = useState(false);
  const [formStatus, setFormStatus] = useState({
    message: '',
    error: false,
  });
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({
    projects: null,
    stack: null,
  });
  const year = new Date().getFullYear();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const items = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]'),
    );
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('main section[id]'),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reduceMotion) {
      setTyped(phrases[0]);
      return;
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer: number | undefined;

    const tick = () => {
      const phrase = phrases[phraseIndex];
      charIndex += deleting ? -1 : 1;
      setTyped(phrase.slice(0, charIndex));

      if (!deleting && charIndex === phrase.length) {
        deleting = true;
        timer = window.setTimeout(tick, 1800);
        return;
      }

      if (deleting && charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        timer = window.setTimeout(tick, 350);
        return;
      }

      timer = window.setTimeout(tick, deleting ? 35 : 70);
    };

    setTyped('');
    timer = window.setTimeout(tick, 350);
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    current: TabId,
  ) => {
    let next: TabId | null = null;
    if (event.key === 'ArrowRight') next = current === 'projects' ? 'stack' : 'projects';
    if (event.key === 'ArrowLeft') next = current === 'stack' ? 'projects' : 'stack';
    if (event.key === 'Home') next = 'projects';
    if (event.key === 'End') next = 'stack';
    if (!next) return;

    event.preventDefault();
    setActiveTab(next);
    tabRefs.current[next]?.focus();
  };

  const openMailto = (name: string, email: string, message: string) => {
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`,
    );
    window.setTimeout(() => {
      window.location.href = `mailto:yuta911f@gmail.com?subject=${subject}&body=${body}`;
    }, 60);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const website = String(data.get('website') ?? '').trim();

    setSending(true);
    setFormStatus({ message: 'Sending…', error: false });

    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 10000);
      let response: Response;

      try {
        response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message, website }),
          signal: controller.signal,
        });
      } finally {
        window.clearTimeout(timeout);
      }

      if (response.ok) {
        form.reset();
        setFormStatus({ message: 'Message sent. Thank you.', error: false });
        return;
      }

      if (response.status === 400) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        setFormStatus({
          message: payload?.message ?? 'Please check the form and try again.',
          error: true,
        });
        return;
      }

      if (response.status === 429) {
        setFormStatus({
          message: 'Too many messages. Try again later.',
          error: true,
        });
        return;
      }

      setFormStatus({
        message: 'Direct sending is unavailable. Opening your email app…',
        error: true,
      });
      openMailto(name, email, message);
    } catch {
      setFormStatus({
        message: 'Network issue. Opening your email app…',
        error: true,
      });
      openMailto(name, email, message);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="page-grid" aria-hidden="true" />

      <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
        <a
          className="brand"
          href="#top"
          aria-label="Stefanus Mario Bersyuby, back to top"
        >
          <Image
            className="brand-logo"
            src="/assets/logo.png"
            alt=""
            width={1186}
            height={533}
            priority
            sizes="120px"
          />
        </a>
        <nav className="site-nav" aria-label="Primary">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={activeSection === item.id ? 'true' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-inner">
            <div className="hero-copy">
              <p className="availability" data-reveal>
                <span className="availability-dot" aria-hidden="true" />
                Information Systems Student
              </p>
              <h1
                className="hero-title delay-80"
                id="hero-title"
                data-reveal
              >
                <span className="hero-line">Welcome to</span>
                <span className="hero-line hero-line-muted">my portfolio</span>
                <span className="hero-line">website</span>
              </h1>
              <p className="hero-type delay-140" data-reveal>
                <span className="sr-only">Student and builder</span>
                <span aria-hidden="true">{typed}</span>
                <span className="type-cursor" aria-hidden="true">
                  _
                </span>
              </p>
              <p className="hero-lede delay-200" data-reveal>
                I&apos;m Stefanus Mario Bersyuby (Denkichi), an Information
                Systems student building quiet tools for Linux and the web.
              </p>
              <ul className="hero-tags delay-260" data-reveal>
                <li>Python</li>
                <li>TypeScript</li>
                <li>PHP</li>
              </ul>
              <div className="hero-actions delay-320" data-reveal>
                <a className="hero-link" href="#portfolio">
                  ↓ explore my work below
                </a>
                <a
                  className="hero-link hero-link-muted"
                  href="mailto:yuta911f@gmail.com"
                >
                  ↗ say hello
                </a>
              </div>
            </div>

            <div className="hero-media delay-240" data-reveal>
              <div className="lanyard">
                <span className="lanyard-strap" aria-hidden="true" />
                <div className="lanyard-wrap">
                  <span className="lanyard-clip" aria-hidden="true" />
                  <figure className="lanyard-card">
                    <div
                      className={`portrait-frame${portraitBroken ? ' is-missing' : ''}`}
                    >
                      <Image
                        className={`portrait-img ${portraitBroken ? 'is-broken' : 'is-active'}`}
                        src="/assets/portrait-2.webp"
                        alt="Portrait of Stefanus Mario Bersyuby seated on a chair"
                        width={780}
                        height={1040}
                        priority
                        sizes="(max-width: 1024px) 72vw, 360px"
                        onError={() => setPortraitBroken(true)}
                      />
                      <div className="portrait-fallback" aria-hidden="true">
                        <span className="portrait-initials">SM</span>
                        <span className="portrait-note">Portrait</span>
                      </div>
                    </div>
                    <figcaption className="lanyard-caption">
                      <span>Denkichi</span>
                      <span>Portrait / 2026</span>
                    </figcaption>
                  </figure>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-foot delay-360" data-reveal>
            <span className="hero-foot-label">Scroll to explore</span>
            <a
              className="scroll-cue"
              href="#about"
              aria-label="Scroll to About"
            >
              <span className="scroll-line" aria-hidden="true" />
            </a>
            <span className="hero-foot-meta">Selected work · 04</span>
          </div>
        </section>

        <section className="section about" id="about" aria-labelledby="about-title">
          <p className="section-label" data-reveal>
            <span className="section-label-line" aria-hidden="true" />
            About me
          </p>
          <div className="about-grid">
            <div className="about-copy">
              <h2 className="about-title" id="about-title" data-reveal>
                <span>Stefanus</span>
                <span>Mario</span>
                <span className="about-title-muted">Bersyuby</span>
              </h2>
              <div className="about-body delay-100" data-reveal>
                <p>
                  I&apos;m Stefanus, an Information Systems student. Most of what
                  I know comes from building things I wanted to use: a Linux
                  overlay that behaves like a Dynamic Island, a Laravel app for a
                  final project, a Next.js site built around a design system.
                </p>
                <p>
                  I care about software that stays out of the way. That usually
                  means fewer elements, clear type, and code I can explain.
                  Right now I&apos;m improving my frontend work and learning more
                  about how systems fit together.
                </p>
              </div>
              <blockquote className="about-quote delay-160" data-reveal>
                “Fewer elements, clearer intent.”
              </blockquote>
              <div className="about-actions delay-220" data-reveal>
                <a className="btn btn-primary" href="#portfolio">
                  View projects <span aria-hidden="true">↗</span>
                </a>
                <a className="btn btn-ghost" href="mailto:yuta911f@gmail.com">
                  Get in touch <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
            <div className="about-media delay-120" data-reveal>
              <div className="about-portrait">
                <Image
                  src="/assets/portrait.webp"
                  alt="Portrait of Stefanus Mario Bersyuby"
                  width={900}
                  height={1200}
                  loading="lazy"
                  sizes="(max-width: 768px) 80vw, 300px"
                />
              </div>
              <p className="about-media-note">Denkichi · Information Systems</p>
            </div>
          </div>

          <div className="about-stats delay-180" data-reveal>
            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m8 9-4 3 4 3" />
                    <path d="m16 9 4 3-4 3" />
                    <path d="m14 4-4 16" />
                  </svg>
                </span>
                <span className="stat-number">04</span>
              </div>
              <span className="stat-label">Selected projects</span>
              <span className="stat-arrow" aria-hidden="true">
                ↗
              </span>
            </div>
            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m12 2 9 5-9 5-9-5 9-5Z" />
                    <path d="m3 12 9 5 9-5" />
                    <path d="m3 17 9 5 9-5" />
                  </svg>
                </span>
                <span className="stat-number">02</span>
              </div>
              <span className="stat-label">Frameworks</span>
              <span className="stat-arrow" aria-hidden="true">
                ↗
              </span>
            </div>
            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18" />
                    <ellipse cx="12" cy="12" rx="4" ry="9" />
                  </svg>
                </span>
                <span className="stat-number">05</span>
              </div>
              <span className="stat-label">Tools</span>
              <span className="stat-arrow" aria-hidden="true">
                ↗
              </span>
            </div>
          </div>
        </section>

        <section
          className="section portfolio"
          id="portfolio"
          aria-labelledby="portfolio-title"
        >
          <div className="portfolio-head" data-reveal>
            <p className="section-label section-label-center">
              <span className="section-label-line" aria-hidden="true" />
              Selected work
            </p>
            <h2 className="portfolio-title" id="portfolio-title">
              Portfolio Showcase
            </h2>
            <p className="portfolio-lede">
              A small selection from GitHub, chosen by hand. Built to be used,
              not just looked at.
            </p>
          </div>

          <div className="tabs delay-80" data-reveal>
            <div className="tab-list" role="tablist" aria-label="Portfolio sections">
              <button
                ref={(element) => {
                  tabRefs.current.projects = element;
                }}
                className="tab"
                id="tab-projects"
                type="button"
                role="tab"
                aria-selected={activeTab === 'projects'}
                aria-controls="panel-projects"
                tabIndex={activeTab === 'projects' ? 0 : -1}
                onClick={() => setActiveTab('projects')}
                onKeyDown={(event) => handleTabKeyDown(event, 'projects')}
              >
                Projects
              </button>
              <button
                ref={(element) => {
                  tabRefs.current.stack = element;
                }}
                className="tab"
                id="tab-stack"
                type="button"
                role="tab"
                aria-selected={activeTab === 'stack'}
                aria-controls="panel-stack"
                tabIndex={activeTab === 'stack' ? 0 : -1}
                onClick={() => setActiveTab('stack')}
                onKeyDown={(event) => handleTabKeyDown(event, 'stack')}
              >
                Tech Stack
              </button>
            </div>

            <div
              className="tab-panel"
              id="panel-projects"
              role="tabpanel"
              aria-labelledby="tab-projects"
              tabIndex={0}
              hidden={activeTab !== 'projects'}
            >
              <div className="project-grid" data-reveal>
                {projects.map((project) => (
                  <article className="project-card" key={project.id}>
                    <a
                      className={`project-media${project.cover ? ` project-cover ${project.cover.className}` : ''}`}
                      href={project.mediaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="sr-only">{project.linkLabel}: </span>
                      {project.image ? (
                        <Image
                          src={project.image.src}
                          alt={project.image.alt}
                          width={project.image.width}
                          height={project.image.height}
                          loading="lazy"
                          sizes="(max-width: 720px) 100vw, 50vw"
                        />
                      ) : (
                        <>
                          <span className="cover-mark" aria-hidden="true">
                            {project.cover?.mark}
                          </span>
                          <span className="cover-label">
                            {project.cover?.label}
                          </span>
                        </>
                      )}
                    </a>
                    <div className="project-body">
                      <div className="project-meta">
                        <span>{project.meta[0]}</span>
                        <span>{project.meta[1]}</span>
                      </div>
                      <h3 className="project-title">
                        <a
                          href={project.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {project.title}
                        </a>
                      </h3>
                      <p className="project-desc">{project.description}</p>
                      <ul className="project-tags">
                        {project.tags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                      <div className="project-footer">
                        <a
                          className="project-repo"
                          href={project.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Repository <span aria-hidden="true">↗</span>
                        </a>
                        <a
                          className="project-cta"
                          href={project.cta.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {project.cta.label}{' '}
                          <span aria-hidden="true">→</span>
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="portfolio-more" data-reveal>
                <a
                  className="btn btn-ghost"
                  href="https://github.com/sixrex-gx"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View GitHub <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

            <div
              className="tab-panel"
              id="panel-stack"
              role="tabpanel"
              aria-labelledby="tab-stack"
              tabIndex={0}
              hidden={activeTab !== 'stack'}
            >
              <div className="stack-grid">
                {stackGroups.map((group) => (
                  <div className="stack-card" key={group.title}>
                    <div className="stack-head">
                      <h3>{group.title}</h3>
                      <span className="stack-index">{group.index}</span>
                    </div>
                    <ul className="stack-list">
                      {group.items.map(([name, note]) => (
                        <li key={name}>
                          <span>{name}</span>
                          <span className="stack-note">{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="contact"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="contact-head" data-reveal>
            <p className="section-label section-label-center">
              <span className="section-label-line" aria-hidden="true" />
              Contact
            </p>
            <h2 className="contact-title" id="contact-title">
              Contact Me
            </h2>
            <p className="contact-lede">
              Have something in mind? Send a message and let&apos;s connect.
            </p>
          </div>

          <div className="contact-grid">
            <div className="contact-card" data-reveal>
              <h3>Send a message</h3>
              <p>Tell me a little about what you have in mind.</p>
              <form
                className="contact-form"
                action="mailto:yuta911f@gmail.com"
                method="post"
                encType="text/plain"
                onSubmit={handleSubmit}
                aria-busy={sending}
              >
                <div className="field">
                  <label htmlFor="contact-name">Your name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    maxLength={80}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    maxLength={254}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    placeholder="Tell me what you're thinking about..."
                    minLength={10}
                    maxLength={5000}
                    required
                  />
                </div>
                <div className="hp-field" aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
                <button
                  className="btn btn-primary contact-submit"
                  type="submit"
                  disabled={sending}
                >
                  Send message <span aria-hidden="true">↗</span>
                </button>
                <p className="form-note">No data is stored on this site.</p>
                <p
                  className={`form-status${formStatus.error ? ' is-error' : ''}`}
                  role="status"
                  aria-live="polite"
                >
                  {formStatus.message}
                </p>
              </form>
            </div>

            <div className="contact-card contact-social delay-100" data-reveal>
              <h3>Connect with me</h3>
              <p>Find me on GitHub, Instagram, or send a direct email.</p>
              <div className="social-list">
                <a
                  className="social-link"
                  href="https://github.com/sixrex-gx"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="social-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.35.78 1.05.78 2.12v3.14c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
                    </svg>
                  </span>
                  <span className="social-copy">
                    <span className="social-label">GitHub</span>
                    <span className="social-handle">@sixrex-gx</span>
                  </span>
                  <span className="social-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
                <a
                  className="social-link"
                  href="https://instagram.com/_stfnsmario"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="social-icon" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle
                        cx="17.5"
                        cy="6.5"
                        r="1"
                        fill="currentColor"
                        stroke="none"
                      />
                    </svg>
                  </span>
                  <span className="social-copy">
                    <span className="social-label">Instagram</span>
                    <span className="social-handle">@_stfnsmario</span>
                  </span>
                  <span className="social-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
                <a className="social-link" href="mailto:yuta911f@gmail.com">
                  <span className="social-icon" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </svg>
                  </span>
                  <span className="social-copy">
                    <span className="social-label">Email</span>
                    <span className="social-handle">yuta911f@gmail.com</span>
                  </span>
                  <span className="social-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </div>
              <div className="contact-availability">
                <span className="availability-dot" aria-hidden="true" />
                Denkichi · Information Systems
              </div>
            </div>
          </div>

          <footer className="site-footer">
            <p>
              © <span suppressHydrationWarning>{year}</span> Stefanus Mario
              Bersyuby. All rights reserved.
            </p>
            <p>Built with Next.js</p>
            <a href="#top">Back to top ↑</a>
          </footer>
        </section>
      </main>
    </>
  );
}
