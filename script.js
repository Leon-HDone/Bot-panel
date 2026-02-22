/* =============================================
   DISCORD BOT PROMO – Interactive JavaScript
   Particles · Scroll · Tilt · Animations
   ============================================= */

// ── Particle System ──
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.resize();
    this.init();
    this.bindEvents();
    this.repulseEvents = []; // Array of active repulsion forces
    this.animate();
  }

  repulse(x, y) {
    this.repulseEvents.push({ x, y, radius: 0, maxRadius: 100, strength: 1.0 });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    const count = Math.min(120, Math.floor((this.canvas.width * this.canvas.height) / 12000));
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: (Math.random() - 0.5) * 0.6,
        opacity: Math.random() * 0.5 + 0.1,
        hue: Math.random() > 0.5 ? 270 : 330, // purple or pink
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.init();
    });

    this.canvas.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((p, i) => {
      // Move
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap
      if (p.x > this.canvas.width) p.x = 0;
      if (p.x < 0) p.x = this.canvas.width;
      if (p.y > this.canvas.height) p.y = 0;
      if (p.y < 0) p.y = this.canvas.height;

      // Mouse interaction
      if (this.mouse.x !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          p.x += dx * force * 0.02;
          p.y += dy * force * 0.02;
        }
      }

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `hsla(${p.hue}, 70%, 65%, ${p.opacity})`;
      this.ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `hsla(270, 60%, 60%, ${0.08 * (1 - dist / 120)})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    });

    // Handle typing repulsion pulses
    for (let k = this.repulseEvents.length - 1; k >= 0; k--) {
      const rep = this.repulseEvents[k];
      rep.radius += 5; // Expansion speed
      rep.strength -= 0.05; // Fade out

      if (rep.strength <= 0) {
        this.repulseEvents.splice(k, 1);
        continue;
      }

      this.particles.forEach((p) => {
        const dx = p.x - rep.x;
        const dy = p.y - rep.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Push particles outwards if they are near the expanding ring
        if (dist > rep.radius - 20 && dist < rep.radius + 20) {
          const force = (1 - Math.abs(dist - rep.radius) / 20) * rep.strength;
          p.x += (dx / dist) * force * 15;
          p.y += (dy / dist) * force * 15;
        }
      });
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ── Scroll Reveal ──
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    observer.observe(el);
  });
}

// ── Navbar Scroll ──
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (toggle) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.classList.toggle('active');
    });
  }

  // Close mobile menu on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('active');
    });
  });
}

// ── Smooth Scroll ──
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
}

// ── 3D Tilt Effect ──
function initTilt() {
  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -4;
      const rotateY = (x - centerX) / centerX * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

// ── Typing Effect ──
function initTyping() {
  const el = document.querySelector('.typing-text');
  if (!el) return;

  const words = ['Custom Discord Bots', 'Node.js & Python', 'Dein Bot, Dein Design', '24/7 Online'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      el.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      el.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    // Create a particle explosion effect where the typing happens
    if (window.particleSystem) {
      const rect = el.getBoundingClientRect();
      // Approximate the x position of the new character
      const charX = rect.left + (rect.width * (charIndex / currentWord.length));
      const charY = rect.top + (rect.height / 2);
      window.particleSystem.repulse(charX, charY);
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 300;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

// ── Counter Animation ──
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        const suffix = entry.target.getAttribute('data-suffix') || '';
        animateCounter(entry.target, 0, target, 2000, suffix);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el, start, end, duration, suffix) {
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (end - start) * eased);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ── Parallax on Scroll ──
function initParallax() {
  const elements = document.querySelectorAll('.float-badge');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    elements.forEach((el, i) => {
      const speed = 0.02 + i * 0.01;
      el.style.transform = `translateY(${-scrollY * speed}px)`;
    });
  });
}

// ── Magnetic Buttons ──
function initMagneticButtons() {
  document.querySelectorAll('.btn--primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

// ── Active Nav Link Highlight ──
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// ── Terminal / Live Demo ──
function initTerminal() {
  const input = document.getElementById('terminal-input');
  const btn = document.getElementById('terminal-submit');
  const chat = document.getElementById('terminal-chat');

  if (!input || !btn || !chat) return;

  function addMessage(text, isBot = false) {
    const time = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    const avatar = isBot ? '🤖' : '👤';
    const avatarClass = isBot ? 'purple' : 'user';
    const author = isBot ? 'DevDesert Bot' : 'Du';
    const badge = isBot ? '<span class="msg-badge">BOT</span>' : '';

    const html = `
      <div class="discord-msg">
        <div class="msg-avatar ${avatarClass}">${avatar}</div>
        <div class="msg-wrapper">
          <div class="msg-header">
            <span class="msg-author">${author}</span>
            ${badge}
            <span class="msg-time">Heute um ${time}</span>
          </div>
          <div class="msg-text">${text}</div>
        </div>
      </div>
    `;

    chat.insertAdjacentHTML('beforeend', html);
    chat.scrollTop = chat.scrollHeight;
  }

  function handleCommand(cmd) {
    const val = cmd.trim().toLowerCase();

    setTimeout(() => {
      if (val === '/help') {
        addMessage(`Hier sind ein paar Befehle, die ich verstehe:<br>
          <code>/ping</code> - Zeigt die Latenz an<br>
          <code>/stats</code> - Serverstatistiken<br>
          <code>/quote</code> - Ein zufälliges Zitat
        `, true);
      } else if (val === '/ping') {
        addMessage(`🏓 Pong! Latenz: <b>${Math.floor(Math.random() * 50) + 10}ms</b>`, true);
      } else if (val === '/stats') {
        addMessage(`📊 <b>Server Stats:</b><br>Mitglieder: 1,337<br>Online: 420<br>Uptime: 99.9%`, true);
      } else if (val === '/quote') {
        const quotes = [
          "Code is poetry.",
          "It's not a bug, it's an undocumented feature.",
          "Hello, World!",
          "Der frühe Vogel fängt den Bug."
        ];
        addMessage(`💬 "${quotes[Math.floor(Math.random() * quotes.length)]}"`, true);
      } else {
        addMessage(`Befehl <code>${val}</code> nicht gefunden. Probier <code>/help</code>!`, true);
      }
    }, 600);
  }

  function submitCommand() {
    const val = input.value.trim();
    if (!val) return;

    addMessage(val, false);
    input.value = '';
    handleCommand(val);
  }

  btn.addEventListener('click', submitCommand);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') submitCommand();
  });
}

// ── Initialize Everything ──
document.addEventListener('DOMContentLoaded', () => {
  // Particles
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    window.particleSystem = new ParticleSystem(canvas);
  }

  // All modules
  initScrollReveal();
  initNavbar();
  initSmoothScroll();
  initTilt();
  initTyping();
  initCounters();
  initParallax();
  initMagneticButtons();
  initActiveNav();
  initTerminal();

  // Preloader fade out
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.pointerEvents = 'none';
      setTimeout(() => preloader.remove(), 600);
    }, 800);
  }
});
