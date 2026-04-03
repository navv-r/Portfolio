import { useEffect, useRef } from 'react';
import './App.css';

function CursorTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];
    let mouse = { x: -200, y: -200 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const COLORS = ['#6c63ff', '#00b894', '#a29bfe', '#00cec9', '#fd79a8'];

    const onMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      mouse = { x, y };

      // Spawn 2-3 particles per move
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.2;
        const size = Math.random() * 3 + 1;
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const type = Math.random() < 0.3 ? 'hex' : 'dot';
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          life: 1,
          decay: Math.random() * 0.025 + 0.018,
          size,
          color,
          type,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.12,
        });
      }
    };
    window.addEventListener('mousemove', onMove);

    const drawHex = (ctx, x, y, r) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i;
        i === 0 ? ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a))
                : ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
      }
      ctx.closePath();
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw cursor glow ring
      const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 18);
      grad.addColorStop(0, 'rgba(108,99,255,0.35)');
      grad.addColorStop(1, 'rgba(108,99,255,0)');
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 18, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Inner cursor dot
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#a29bfe';
      ctx.fill();

      particles = particles.filter(p => p.life > 0);

      for (const p of particles) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === 'hex') {
          drawHex(ctx, 0, 0, p.size * 2);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 0.8;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.fill();
        }

        ctx.restore();

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02; // gentle gravity
        p.life -= p.decay;
        p.rotation += p.rotSpeed;
        p.size *= 0.97;
      }

      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="cursor-canvas" />;
}

function App() {
  return (
    <div className="portfolio">
      <CursorTrail />
      <nav className="nav">
        <div className="nav-logo">NR</div>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-greeting">Hi, I'm</p>
          <h1 className="hero-name">Navendra Ramdhan</h1>
          <h2 className="hero-title">Full Stack Developer</h2>
          <p className="hero-sub">I build clean, performant web experiences.</p>
          <div className="hero-buttons">
            <a href="#projects" className="btn btn-primary">View My Work</a>
            <a href="#contact" className="btn btn-outline">Get In Touch</a>
          </div>
        </div>
        <div className="hero-blob" />
      </section>

      {/* About */}
      <section className="section" id="about">
        <h2 className="section-title">About Me</h2>
        <div className="about-grid">
          <div className="about-avatar">NR</div>
          <div className="about-text">
            <p>
              I'm a passionate full stack developer with 4+ years of experience building
              web applications. I love turning complex problems into simple, beautiful
              solutions.
            </p>
            <p>
              When I'm not coding, you'll find me hiking, reading sci-fi, or experimenting
              with new recipes in the kitchen.
            </p>
            <div className="about-stats">
              <div className="stat"><span className="stat-num">4+</span><span>Years Exp.</span></div>
              <div className="stat"><span className="stat-num">30+</span><span>Projects</span></div>
              <div className="stat"><span className="stat-num">15+</span><span>Happy Clients</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="section section-alt" id="skills">
        <h2 className="section-title">Skills</h2>
        <div className="skills-grid">
          {[
            { category: 'Frontend', items: ['React', 'TypeScript', 'HTML/CSS', 'Tailwind'] },
            { category: 'Backend', items: ['Node.js', 'Python', 'REST APIs', 'GraphQL'] },
            { category: 'Database', items: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma'] },
            { category: 'DevOps', items: ['Docker', 'AWS', 'CI/CD', 'Git'] },
          ].map(({ category, items }) => (
            <div className="skill-card" key={category}>
              <h3>{category}</h3>
              <ul>
                {items.map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="section" id="projects">
        <h2 className="section-title">Projects</h2>
        <div className="projects-grid">
          {[
            {
              title: 'ShopEasy',
              desc: 'A full-stack e-commerce platform with real-time inventory, Stripe payments, and an admin dashboard.',
              tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
              color: '#6c63ff',
            },
            {
              title: 'TaskFlow',
              desc: 'A collaborative project management tool with drag-and-drop boards, comments, and team analytics.',
              tags: ['React', 'GraphQL', 'MongoDB', 'Socket.io'],
              color: '#00b894',
            },
            {
              title: 'WeatherNow',
              desc: 'A weather dashboard with 7-day forecasts, interactive maps, and location-based alerts.',
              tags: ['TypeScript', 'OpenWeather API', 'Leaflet'],
              color: '#fd79a8',
            },
            {
              title: 'DevBlog',
              desc: 'A markdown-powered blogging platform with syntax highlighting, tags, and an RSS feed.',
              tags: ['Next.js', 'MDX', 'Tailwind', 'Vercel'],
              color: '#fdcb6e',
            },
            {
              title: 'ChatBot AI',
              desc: 'An AI-powered customer support chatbot with NLP, conversation history, and analytics.',
              tags: ['Python', 'FastAPI', 'OpenAI', 'React'],
              color: '#74b9ff',
            },
            {
              title: 'FitTrack',
              desc: 'A fitness tracking app with workout logging, progress charts, and social challenges.',
              tags: ['React Native', 'Firebase', 'Chart.js'],
              color: '#a29bfe',
            },
          ].map(({ title, desc, tags, color }) => (
            <div className="project-card" key={title}>
              <div className="project-top" style={{ background: color }} />
              <div className="project-body">
                <h3>{title}</h3>
                <p>{desc}</p>
                <div className="project-tags">
                  {tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="section section-alt" id="contact">
        <h2 className="section-title">Get In Touch</h2>
        <div className="contact-wrapper">
          <p className="contact-sub">
            I'm currently open to new opportunities. Whether you have a question or just
            want to say hi, my inbox is always open!
          </p>
          <form className="contact-form" onSubmit={e => e.preventDefault()}>
            <div className="form-row">
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
            </div>
            <input type="text" placeholder="Subject" />
            <textarea placeholder="Your Message" rows={5} required />
            <button type="submit" className="btn btn-primary">Send Message</button>
          </form>
        </div>
      </section>

      <footer className="footer">
        <p>Designed & Built by Navendra Ramdhan &mdash; {new Date().getFullYear()}</p>
        <div className="footer-links">
          <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
