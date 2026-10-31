(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector("[data-header]");
  const navLinks = Array.from(document.querySelectorAll("[data-nav]"));
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  if ("IntersectionObserver" in window && navLinks.length) {
    const linksById = new Map();
    navLinks.forEach((link) => {
      const id = link.getAttribute("href")?.replace("#", "");
      if (id) linksById.set(id, link);
    });

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => link.removeAttribute("aria-current"));
          const link = linksById.get(entry.target.id);
          if (link) link.setAttribute("aria-current", "true");
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((section) => spy.observe(section));
  }

  const typeTarget = document.querySelector("[data-typewriter]");
  if (typeTarget) {
    const phrases = ["Student & Builder", "Frontend Learner", "Linux Tinkerer", "Problem Solver"];

    if (reduceMotion) {
      typeTarget.textContent = phrases[0];
    } else {
      let phraseIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const tick = () => {
        const phrase = phrases[phraseIndex];
        charIndex += deleting ? -1 : 1;
        typeTarget.textContent = phrase.slice(0, charIndex);

        if (!deleting && charIndex === phrase.length) {
          deleting = true;
          window.setTimeout(tick, 1800);
          return;
        }

        if (deleting && charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          window.setTimeout(tick, 350);
          return;
        }

        window.setTimeout(tick, deleting ? 35 : 70);
      };

      typeTarget.textContent = "";
      window.setTimeout(tick, 350);
    }
  }

  const heroPortrait = document.querySelector("[data-portrait]");
  if (heroPortrait) {
    const frame = heroPortrait.closest(".portrait-frame");
    heroPortrait.addEventListener("error", () => {
      heroPortrait.classList.add("is-broken");
      heroPortrait.classList.remove("is-active");
      if (frame) frame.classList.add("is-missing");
    });
  }

  const tabsRoot = document.querySelector("[data-tabs]");
  if (tabsRoot) {
    const tabList = tabsRoot.querySelector('[role="tablist"]');
    const tabs = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')) : [];
    const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls") || ""));

    const activateTab = (tab, focus = false) => {
      tabs.forEach((item, index) => {
        const selected = item === tab;
        item.setAttribute("aria-selected", String(selected));
        item.tabIndex = selected ? 0 : -1;
        const panel = panels[index];
        if (panel) panel.hidden = !selected;
      });
      if (focus) tab.focus();
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activateTab(tab));

      tab.addEventListener("keydown", (event) => {
        let next = null;
        if (event.key === "ArrowRight") next = tabs[(index + 1) % tabs.length];
        if (event.key === "ArrowLeft") next = tabs[(index - 1 + tabs.length) % tabs.length];
        if (event.key === "Home") next = tabs[0];
        if (event.key === "End") next = tabs[tabs.length - 1];
        if (!next) return;
        event.preventDefault();
        activateTab(next, true);
      });
    });
  }

  const contactForm = document.querySelector("[data-contact-form]");
  const formStatus = document.querySelector("[data-form-status]");
  if (contactForm) {
    const submitButton = contactForm.querySelector("[data-contact-submit]");

    const setStatus = (message, isError = false) => {
      if (!formStatus) return;
      formStatus.textContent = message;
      formStatus.classList.toggle("is-error", isError);
    };

    const openMailto = (name, email, message) => {
      const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.setTimeout(() => {
        window.location.href = `mailto:yuta911f@gmail.com?subject=${subject}&body=${body}`;
      }, 60);
    };

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;

      const data = new FormData(contactForm);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const message = String(data.get("message") || "").trim();
      const website = String(data.get("website") || "").trim();

      if (submitButton) submitButton.disabled = true;
      contactForm.setAttribute("aria-busy", "true");
      setStatus("Sending…");

      try {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 10000);
        let response;

        try {
          response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message, website }),
            signal: controller.signal,
          });
        } finally {
          window.clearTimeout(timeout);
        }

        if (response.ok) {
          contactForm.reset();
          setStatus("Message sent. Thank you.");
          return;
        }

        if (response.status === 400) {
          const payload = await response.json().catch(() => null);
          setStatus(payload?.message || "Please check the form and try again.", true);
          return;
        }

        if (response.status === 429) {
          setStatus("Too many messages. Try again later.", true);
          return;
        }

        setStatus("Direct sending is unavailable. Opening your email app…", true);
        openMailto(name, email, message);
      } catch {
        setStatus("Network issue. Opening your email app…", true);
        openMailto(name, email, message);
      } finally {
        if (submitButton) submitButton.disabled = false;
        contactForm.removeAttribute("aria-busy");
      }
    });
  }

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
})();
