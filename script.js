/* =============================================
   portfolio/js/script.js — Full Version
   ============================================= */

"use strict";

/* ── 1. CUSTOM CURSOR WITH GLOW ── */
const cursor = document.createElement("div");
const cursorDot = document.createElement("div");
cursor.className = "cursor-ring";
cursorDot.className = "cursor-dot";
document.body.appendChild(cursor);
document.body.appendChild(cursorDot);

let mouseX = 0,
  mouseY = 0,
  ringX = 0,
  ringY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
});

(function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursor.style.transform = `translate(${ringX}px, ${ringY}px)`;
  requestAnimationFrame(animateRing);
})();

document
  .querySelectorAll("a, button, .portfolio-card, .chip, .icon-box")
  .forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("cursor-hover");
      cursorDot.classList.add("cursor-hover");
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("cursor-hover");
      cursorDot.classList.remove("cursor-hover");
    });
  });

/* ── 2. PARTICLE CANVAS BACKGROUND ── */
const canvas = document.createElement("canvas");
canvas.id = "particleCanvas";
canvas.style.cssText =
  "position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;";
document.body.insertBefore(canvas, document.body.firstChild);
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.8 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.6 + 0.1;
    this.pulse = Math.random() * Math.PI * 2;
    const colors = ["#00f5c4", "#7b2fff", "#0a84ff", "#ffffff"];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.pulse += 0.02;
    if (
      this.x < 0 ||
      this.x > canvas.width ||
      this.y < 0 ||
      this.y > canvas.height
    )
      this.reset();
    return this.opacity * (0.7 + 0.3 * Math.sin(this.pulse));
  }
  draw(op) {
    ctx.save();
    ctx.globalAlpha = op;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

const particles = [];
for (let i = 0; i < 120; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, i) => {
    particles.slice(i + 1).forEach((p2) => {
      const dx = p.x - p2.x,
        dy = p.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 100) * 0.08;
        ctx.strokeStyle = "#00f5c4";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.restore();
      }
    });
    p.draw(p.update());
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

new MutationObserver(() => {
  canvas.style.opacity =
    document.documentElement.getAttribute("data-theme") === "light"
      ? "0.3"
      : "1";
}).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["data-theme"],
});

/* ── 3. TYPING EFFECT ── */
function initTyping() {
  const heroSub = document.querySelector(".hero-sub");
  if (!heroSub) return;
  const texts = [
    "Web Developer 💻",
    "UI Designer 🎨",
    "Problem Solver 🧠",
    "RPL Student 🚀",
  ];
  let textIndex = 0,
    charIndex = 0,
    isDeleting = false;

  const typingEl = document.createElement("p");
  typingEl.className = "hero-typing";
  typingEl.innerHTML =
    'Saya seorang <span class="typing-text"></span><span class="typing-cursor">|</span>';
  heroSub.insertAdjacentElement("beforebegin", typingEl);
  const typingText = typingEl.querySelector(".typing-text");

  function type() {
    const current = texts[textIndex];
    typingText.textContent = isDeleting
      ? current.substring(0, charIndex--)
      : current.substring(0, charIndex++);
    let speed = isDeleting ? 55 : 100;
    if (!isDeleting && charIndex > current.length) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex < 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      charIndex = 0;
      speed = 400;
    }
    setTimeout(type, speed);
  }
  setTimeout(type, 1500);
}
initTyping();

/* ── 4. COUNTER ANIMATION ── */
const statNums = document.querySelectorAll(".stat-num");
statNums.forEach((el) => {
  const raw = el.textContent;
  const num = parseInt(raw.replace(/\D/g, ""));
  const suffix = raw.replace(/[0-9]/g, "");
  el.dataset.target = num;
  el.dataset.suffix = suffix;
  el.textContent = "0" + suffix;
});

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || "";
  let start = 0;
  const increment = target / (1800 / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + suffix;
    }
  }, 16);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 },
);
statNums.forEach((el) => counterObserver.observe(el));

/* ── THEME TOGGLE ── */
const html = document.documentElement;
const themeBtn = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
html.setAttribute("data-theme", savedTheme);
themeBtn.addEventListener("click", () => {
  const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("portfolio-theme", next);
});

/* ── NAVBAR ── */
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

window.addEventListener(
  "scroll",
  () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
    updateActiveLink();
  },
  { passive: true },
);
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
  });
});

/* ── ACTIVE NAV LINK ── */
const sections = document.querySelectorAll("section[id]");
function updateActiveLink() {
  const scrollY = window.scrollY + 100;
  sections.forEach((section) => {
    const id = section.getAttribute("id");
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link)
      link.classList.toggle(
        "active",
        scrollY >= section.offsetTop &&
          scrollY < section.offsetTop + section.offsetHeight,
      );
  });
}

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

/* ── REVEAL ON SCROLL ── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.12 },
);
document
  .querySelectorAll(".reveal")
  .forEach((el) => revealObserver.observe(el));

/* ── SKILL BARS ── */
const skillBars = document.querySelectorAll(".skill-bar");
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const delay = Array.from(skillBars).indexOf(bar) * 100;
        setTimeout(() => {
          bar.style.width = bar.getAttribute("data-width") + "%";
        }, delay);
        skillObserver.unobserve(bar);
      }
    });
  },
  { threshold: 0.3 },
);
skillBars.forEach((bar) => skillObserver.observe(bar));

/* ── CONTACT FORM ── */
const form = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

function showError(fieldId, errorId, msg) {
  document.getElementById(fieldId).classList.add("error");
  document.getElementById(errorId).textContent = msg;
}
function clearError(fieldId, errorId) {
  document.getElementById(fieldId).classList.remove("error");
  document.getElementById(errorId).textContent = "";
}
["name", "email", "message"].forEach((id) => {
  const input = document.getElementById(id);
  if (input)
    input.addEventListener("input", () => clearError(id, id + "Error"));
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let isValid = true;
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name) {
    showError("name", "nameError", "Nama tidak boleh kosong.");
    isValid = false;
  } else if (name.length < 2) {
    showError("name", "nameError", "Nama minimal 2 karakter.");
    isValid = false;
  } else clearError("name", "nameError");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    showError("email", "emailError", "Email tidak boleh kosong.");
    isValid = false;
  } else if (!emailRegex.test(email)) {
    showError("email", "emailError", "Format email tidak valid.");
    isValid = false;
  } else clearError("email", "emailError");

  if (!message) {
    showError("message", "messageError", "Pesan tidak boleh kosong.");
    isValid = false;
  } else if (message.length < 10) {
    showError("message", "messageError", "Pesan minimal 10 karakter.");
    isValid = false;
  } else clearError("message", "messageError");

  if (isValid) {
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.innerHTML = '<span class="btn-text">Mengirim...</span>';
    submitBtn.disabled = true;

    emailjs
      .send("service_2e7ehkp", "template_7hrvjus", { name, email, message })
      .then(() => {
        form.reset();
        formSuccess.style.display = "block";
        submitBtn.innerHTML =
          '<span class="btn-text">Kirim Pesan</span><span class="btn-icon">→</span>';
        submitBtn.disabled = false;
        setTimeout(() => {
          formSuccess.style.display = "none";
        }, 5000);
      })
      .catch((err) => {
        console.error("EmailJS error:", err);
        submitBtn.innerHTML =
          '<span class="btn-text">Kirim Pesan</span><span class="btn-icon">→</span>';
        submitBtn.disabled = false;
        formSuccess.style.cssText =
          "display:block;background:rgba(255,77,109,0.1);border-color:rgba(255,77,109,0.3);color:#ff4d6d;";
        formSuccess.textContent = "✗ Gagal mengirim pesan. Coba lagi ya!";
        setTimeout(() => {
          formSuccess.style.cssText = "";
          formSuccess.style.display = "none";
          formSuccess.textContent =
            "✓ Pesan terkirim! Saya akan membalas segera.";
        }, 5000);
      });
  }
});

/* ── 5. SCROLL PROGRESS BAR ── */
const progressBar = document.createElement("div");
progressBar.id = "scrollProgress";
progressBar.style.cssText =
  "position:fixed;top:0;left:0;height:3px;width:0%;background:linear-gradient(90deg,#00f5c4,#0a84ff,#7b2fff);z-index:9999;transition:width 0.1s;box-shadow:0 0 10px #00f5c4;pointer-events:none;border-radius:0 2px 2px 0;";
document.body.appendChild(progressBar);

window.addEventListener(
  "scroll",
  () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + "%";
  },
  { passive: true },
);

/* ── 6. RIPPLE EFFECT ON BUTTONS ── */
function createRipple(e) {
  const btn = e.currentTarget;
  const circle = document.createElement("span");
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  circle.style.cssText = `
    position:absolute;width:${size}px;height:${size}px;
    left:${e.clientX - rect.left - size / 2}px;
    top:${e.clientY - rect.top - size / 2}px;
    background:rgba(255,255,255,0.25);border-radius:50%;
    transform:scale(0);animation:ripple 0.6s linear;pointer-events:none;
  `;
  btn.style.position = "relative";
  btn.style.overflow = "hidden";
  btn.appendChild(circle);
  circle.addEventListener("animationend", () => circle.remove());
}

document.querySelectorAll(".btn, .card-btn").forEach((btn) => {
  btn.addEventListener("click", createRipple);
});

/* ── 7. 3D TILT CARD ── */
document.querySelectorAll(".portfolio-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.02)`;
    card.style.transition = "transform 0.1s ease";
    card.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2}px 40px rgba(0,245,196,0.2)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
    card.style.transition = "transform 0.5s ease, box-shadow 0.5s ease";
    card.style.boxShadow = "";
  });
});

/* ── 8. CONFETTI ON FORM SUCCESS ── */
function launchConfetti() {
  const colors = [
    "#00f5c4",
    "#7b2fff",
    "#0a84ff",
    "#ff2f7b",
    "#ffdd00",
    "#ffffff",
  ];
  for (let i = 0; i < 120; i++) {
    const el = document.createElement("div");
    const size = Math.random() * 10 + 5;
    const isRect = Math.random() > 0.5;
    el.style.cssText = `
      position:fixed;
      left:${Math.random() * 100}vw;
      top:-20px;
      width:${isRect ? size : size / 2}px;
      height:${isRect ? size / 2 : size}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      border-radius:${isRect ? "2px" : "50%"};
      opacity:1;
      z-index:99999;
      pointer-events:none;
      transform:rotate(${Math.random() * 360}deg);
    `;
    document.body.appendChild(el);
    const duration = Math.random() * 2000 + 1500;
    const drift = (Math.random() - 0.5) * 200;
    el.animate(
      [
        { transform: `translateY(0) rotate(0deg) translateX(0)`, opacity: 1 },
        {
          transform: `translateY(100vh) rotate(${Math.random() * 720}deg) translateX(${drift}px)`,
          opacity: 0,
        },
      ],
      {
        duration,
        easing: "cubic-bezier(0.25,0.46,0.45,0.94)",
        fill: "forwards",
      },
    ).onfinish = () => el.remove();
  }
}

// Patch form success to trigger confetti
const _origSubmit = form.onsubmit;
const origSuccess = formSuccess;
const observer = new MutationObserver(() => {
  if (
    formSuccess.style.display === "block" &&
    formSuccess.textContent.includes("terkirim")
  ) {
    launchConfetti();
  }
});
observer.observe(formSuccess, { attributes: true, attributeFilter: ["style"] });

/* ── AVATAR WOBBLE ── */
const avatarImg = document.getElementById("avatarImg");
if (avatarImg) {
  avatarImg.addEventListener("mouseleave", () => {
    avatarImg.classList.add("no-wobble");
    setTimeout(() => avatarImg.classList.remove("no-wobble"), 400);
  });
}
