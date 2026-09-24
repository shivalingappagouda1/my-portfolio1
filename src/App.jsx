import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import profilePhoto from "./assets/image.png";

const particles = Array.from({ length: 28 });

const sectionVariants = {
  hidden: { opacity: 0, y: 70 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 35, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function Particle({ index, smoothX, smoothY }) {
  const depth = 5 + (index % 6) * 4;

  const particleX = useTransform(
    smoothX,
    [-1, 1],
    [-depth, depth]
  );

  const particleY = useTransform(
    smoothY,
    [-1, 1],
    [-depth, depth]
  );

  return (
    <motion.span
      className="particle"
      animate={{
        opacity: [0, 0.85, 0],
        y: [-20, -140, -260],
      }}
      transition={{
        duration: 5 + (index % 5),
        repeat: Infinity,
        delay: index * 0.15,
        ease: "easeInOut",
      }}
      style={{
        left: `${(index * 37) % 100}%`,
        top: `${55 + ((index * 17) % 40)}%`,
        x: particleX,
        y: particleY,
      }}
    />
  );
}

function MagneticButton({ href, children, className }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, {
    stiffness: 300,
    damping: 20,
  });

  const springY = useSpring(y, {
    stiffness: 300,
    damping: 20,
  });

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set((event.clientX - centerX) * 0.22);
    y.set((event.clientY - centerY) * 0.22);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={href}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.a>
  );
}

function RevealSection({ children, className = "section", id }) {
  return (
    <motion.section
      id={id}
      className={className}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
    >
      {children}
    </motion.section>
  );
}

function App() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 80,
    damping: 20,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 80,
    damping: 20,
  });

  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;

      mouseX.set(x);
      mouseY.set(y);
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      setScrollProgress(
        documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    const sections = ["home", "about", "skills", "education", "certifications", "contact"];

    const observers = sections
      .map((id) => {
        const element = document.getElementById(id);
        if (!element) return null;

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          },
          {
            rootMargin: "-35% 0px -55% 0px",
          }
        );

        observer.observe(element);
        return observer;
      })
      .filter(Boolean);

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  return (
    <div className="portfolio">
      <motion.div
        className="scroll-progress"
        style={{ scaleX: scrollProgress / 100 }}
      />

      {/* NAVBAR */}
      <nav className="navbar">
        <a className="nav-logo" href="#home">
          Shivalingappagouda<span>.</span>
        </a>

        <div className="nav-links">
          {[
            ["home", "Home"],
            ["about", "About"],
            ["skills", "Skills"],
            ["education", "Education"],
            ["certifications", "Certifications"],
            ["contact", "Contact"],
          ].map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className={activeSection === id ? "active" : ""}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <motion.section
        className="hero"
        id="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
      >
        <div className="hero-grid" />

        <div className="hero-particles">
          {particles.map((_, index) => (
            <Particle
              key={index}
              index={index}
              smoothX={smoothX}
              smoothY={smoothY}
            />
          ))}
        </div>

        <motion.div
          className="hero-content"
          style={{
            x: useTransform(smoothX, [-1, 1], [-12, 12]),
            y: useTransform(smoothY, [-1, 1], [-8, 8]),
          }}
        >
          <motion.p
            className="hero-eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            AI & ML ENTHUSIAST
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            Shivalingappagouda
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Building ideas with code, intelligence and curiosity.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85 }}
          >
            <MagneticButton
              href="#contact"
              className="btn btn-primary"
            >
              Contact Me
            </MagneticButton>

            <motion.a
              href="#about"
              className="btn btn-secondary"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
            >
              Explore Portfolio
            </motion.a>
          </motion.div>
        </motion.div>

        {/* HERO PHOTO */}
        <motion.div
          className="hero-visual"
          style={{
            x: useTransform(smoothX, [-1, 1], [18, -18]),
            y: useTransform(smoothY, [-1, 1], [12, -12]),
            rotateY: useTransform(smoothX, [-1, 1], [-8, 8]),
            rotateX: useTransform(smoothY, [-1, 1], [8, -8]),
          }}
          initial={{
            opacity: 0,
            scale: 0.7,
            rotate: -8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: 0,
          }}
          transition={{
            duration: 1.2,
            delay: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.div
            className="hero-photo-card"
            animate={{
              y: [0, -10, 0],
              rotate: [2, 3, 2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="hero-photo-glow" />

            <img
              src={profilePhoto}
              alt="Shivalingappagouda"
              className="profile-photo"
            />

            <div className="photo-overlay">
              <span>AI & ML</span>
              <strong>ENTHUSIAST</strong>
            </div>
          </motion.div>
        </motion.div>

        <motion.a
          href="#about"
          className="scroll-indicator"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          <span>SCROLL</span>
          <i />
        </motion.a>
      </motion.section>

      {/* ABOUT */}
      <RevealSection id="about" className="section about-section">
        <div className="section-heading">
          <p>GET TO KNOW ME</p>
          <h2>About Me</h2>
        </div>

        <div className="about-content">
          <div className="about-text">
            <p>
              I am a genuine learner and passionate technologist currently
              pursuing a degree in Artificial Intelligence & Machine Learning
              at REVA University.
            </p>

            <p>
              I am motivated by the goal of contributing to a better India
              through technology. I am continuously developing my technical,
              communication and leadership skills while looking for
              opportunities to learn and grow.
            </p>

            <p>
              I am currently seeking internship and entry-level opportunities
              where I can apply my knowledge, gain practical experience and
              contribute to meaningful projects.
            </p>
          </div>

          <motion.div
            className="about-highlight"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              ["AI", "Artificial Intelligence"],
              ["ML", "Machine Learning"],
              ["∞", "Always Learning"],
            ].map(([number, text]) => (
              <motion.div
                key={text}
                variants={cardVariants}
                whileHover={{ y: -8, rotate: -1 }}
              >
                <span className="highlight-number">{number}</span>
                <p>{text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </RevealSection>

      {/* SKILLS */}
      <RevealSection id="skills" className="section skills-section">
        <div className="section-heading">
          <p>WHAT I WORK WITH</p>
          <h2>Skills</h2>
        </div>

        <div className="skills-container">
          <motion.div
            className="skill-category"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h3>Technical Skills</h3>

            <div className="skill-list">
              {[
                ["Python", "python", "85%"],
                ["C Programming", "c", "75%"],
                ["Web Development", "web", "70%"],
                ["MySQL / Database Management", "mysql", "75%"],
              ].map(([name, className, width]) => (
                <motion.div
                  className="skill-item"
                  key={name}
                  variants={cardVariants}
                >
                  <div className="skill-label">
                    <span>{name}</span>
                    <span>{width}</span>
                  </div>

                  <div className="skill-bar">
                    <motion.div
                      className={`skill-progress ${className}`}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1.1,
                        delay: 0.15,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{ transformOrigin: "left" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="skill-category"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h3>Soft Skills</h3>

            <div className="soft-skills">
              {[
                ["01", "Leadership", "Taking responsibility and working effectively with others."],
                ["02", "Communication", "Expressing ideas clearly and working collaboratively."],
                ["03", "Public Speaking", "Presenting ideas confidently to an audience."],
              ].map(([number, title, description]) => (
                <motion.div
                  className="soft-skill"
                  key={title}
                  variants={cardVariants}
                  whileHover={{ y: -7, x: 4 }}
                >
                  <span>{number}</span>
                  <h4>{title}</h4>
                  <p>{description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </RevealSection>

      {/* EDUCATION */}
      <RevealSection id="education" className="section education-section">
        <div className="section-heading">
          <p>MY ACADEMIC JOURNEY</p>
          <h2>Education</h2>
        </div>

        <motion.div
          className="timeline"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div className="timeline-item" variants={cardVariants}>
            <motion.div
              className="timeline-dot"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(139,124,255,0)",
                  "0 0 0 10px rgba(139,124,255,0.08)",
                  "0 0 0 0 rgba(139,124,255,0)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <motion.div
              className="timeline-card"
              whileHover={{ y: -5, borderColor: "rgba(139,124,255,0.6)" }}
            >
              <span className="timeline-label">CURRENT</span>

              <h3>B.Tech — Artificial Intelligence & Machine Learning</h3>
              <h4>REVA University</h4>

              <p>
                Currently pursuing a degree in Artificial Intelligence &
                Machine Learning.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </RevealSection>

      {/* EXPERIENCE */}
      <RevealSection className="section experience-section">
        <div className="section-heading">
          <p>PROFESSIONAL JOURNEY</p>
          <h2>Experience</h2>
        </div>

        <motion.div
          className="experience-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -6 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="experience-icon"
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            ✦
          </motion.div>

          <div>
            <h3>Seeking Opportunities</h3>

            <p>
              No formal work experience yet. Currently seeking internships
              and entry-level opportunities in AI/ML to apply and develop
              technical and leadership skills.
            </p>

            <span className="availability">
              OPEN TO OPPORTUNITIES
            </span>
          </div>
        </motion.div>
      </RevealSection>

      {/* PROJECTS */}
      <RevealSection className="section projects-section">
        <div className="section-heading">
          <p>MY WORK</p>
          <h2>Projects</h2>
        </div>

        <motion.div
          className="project-placeholder"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ y: -5 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="project-number"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            01
          </motion.div>

          <div>
            <h3>Projects Coming Soon</h3>
            <p>
              Currently looking for the right opportunities to showcase
              project work and practical applications of my technical skills.
            </p>
          </div>
        </motion.div>
      </RevealSection>

      {/* CERTIFICATIONS */}
      <RevealSection id="certifications" className="section certifications-section">
        <div className="section-heading">
          <p>CONTINUOUS LEARNING</p>
          <h2>Certifications</h2>
        </div>

        <motion.div
          className="certifications-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {[
            ["01", "Data Visualization Using Python", "IBM Certificate"],
            ["02", "Data Analysis Using Python", "IBM Certificate"],
            ["03", "Python for Data Science", "IBM Certificate"],
            ["04", "NCC 'A' and 'B' Certificate", "NCC"],
          ].map(([number, title, issuer]) => (
            <motion.div
              className="certificate-card"
              key={title}
              variants={cardVariants}
              whileHover={{ y: -8, rotateX: 2, rotateY: -2 }}
            >
              <span className="certificate-number">{number}</span>
              <h3>{title}</h3>
              <p>{issuer}</p>
              <span className="card-arrow">↗</span>
            </motion.div>
          ))}
        </motion.div>
      </RevealSection>

      {/* CONTACT */}
      <motion.section
        id="contact"
        className="contact-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.9 }}
      >
        <motion.div
          className="contact-orb"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.25, 0.4, 0.25],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        <div className="contact-content">
          <motion.p
            className="contact-small"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            LET'S CONNECT
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Let's build something
            <span> meaningful.</span>
          </motion.h2>

          <motion.p
            className="contact-description"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            I am actively looking for internship and entry-level
            opportunities in AI/ML. If you have an opportunity or would
            simply like to connect, feel free to reach out.
          </motion.p>

          <motion.div
            className="contact-links"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.a
              href="mailto:shivalingappagoudam@gmail.com"
              variants={cardVariants}
              whileHover={{ y: -7 }}
            >
              <span>Email</span>
              <strong>shivalingappagoudam@gmail.com</strong>
              <i>↗</i>
            </motion.a>

            <motion.a
              href="https://linkedin.com/in/shivalingappagouda-2b4807384"
              target="_blank"
              rel="noreferrer"
              variants={cardVariants}
              whileHover={{ y: -7 }}
            >
              <span>LinkedIn</span>
              <strong>View LinkedIn Profile →</strong>
              <i>↗</i>
            </motion.a>

            <motion.a
              href="https://github.com/shivalingappagouda1"
              target="_blank"
              rel="noreferrer"
              variants={cardVariants}
              whileHover={{ y: -7 }}
            >
              <span>GitHub</span>
              <strong>View GitHub Profile →</strong>
              <i>↗</i>
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          © {new Date().getFullYear()} Shivalingappagouda. Built with React.
        </motion.p>
      </footer>
    </div>
  );
}

export default App;
