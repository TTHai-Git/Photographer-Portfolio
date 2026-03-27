import "../Assets/CSS/About.css";

const EXPERIENCE_DATA = [
  {
    role: "Graphic Designer at Yves Rocher",
    date: "Aug 2022 - Present",
    details: [
      "Follow brand guidelines, create visual assets for campaigns, product launches, and promotions across digital and print media, including banners, social media posts...",
      "Design marketing materials such as brochures, catalogues, and event collateral.",
      "Ensure consistency in the visual identity across all touchpoints.",
      "Adapt designs to align with the brand's eco-conscious and botanical-focused image.",
      "Work closely with marketing, and digital teams to ensure cohesive storytelling.",
      "Liaise with external printers to ensure quality execution.",
    ],
  },
  {
    role: "Brand Designer at Amy Cake",
    date: "2023 - 2024 (Freelancer)",
    details: [
      "Develop and refine the brand's visual identity, including logos, color palettes, typography, and graphic elements.",
      "Create visual assets for marketing campaigns, product packaging and other promotional materials.",
    ],
  },
  {
    role: "Video and Photography at Roz Accessories",
    date: "Jun 2023 - Jul 2024 (Freelancer)",
    details: [
      "Shoot and produce engaging videos for promotional on Tiktok platform.",
      "Follow plan video projects, including storyboarding, scripting, and identifying key shot.",
      "Produce teaser videos and product photography for the 'Bloomette' collection.",
    ],
  },
  {
    role: "Graphic Designer at Aldo Shoes",
    date: "Jan - Jul 2024 (Freelancer)",
    details: [
      "Create visual assets for promotions across digital and print media.",
    ],
  },
];

const EDUCATION_DATA = [
  {
    degree: "Bachelor of Graphic Designer",
    date: "(2018 - 2022)",
    school: "Van lang university",
  },
  {
    degree: "2D Animation & Motion Graphics",
    date: "Basic to Intermediate (03.2023)",
    school: "Keyframe multimedia school",
  },
];

const CONTENT_DATA = [
  { id: 1, label: "Branding", desc: "Amy Cake" },
  { id: 2, label: "Marketing Designer", desc: "Yves rocher" },
  { id: 3, label: "Illustration", desc: "Rood game packaging Red envelope" },
  { id: 4, label: "Animation", desc: "Mua noi thu Christmas postcard" },
  { id: 5, label: "Photography", desc: "Hen aro Phuong Dong ROZ accessories" },
];

const About = () => {
  return (
    <article className="about-container">
      {/* Title pinned to the very top and centered */}
      <h1 className="about-title">Hoang Truc</h1>

      <div className="about-main-content">
        {/* LEFT COLUMN - Only Hero Image */}
        <div className="about-left-column">
          <div className="about-hero-wrapper">
            <img
              src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUD_NAME}${process.env.REACT_APP_DIR_CLOUD}v1774530792/Hoang-Truc-Photographer-Portfolio/about/78f02857fa1474ad5bdf5be18b0f353cae6d517e_rysbbk.webp`}
              alt="Hoang Truc – Graphic Designer & Photographer"
              className="about-hero"
              fetchPriority="high"
              loading="eager"
              decoding="async"
              width="600"
              height="800"
              style={{ opacity: 1 }} // Optimized: Revealed immediately for LCP
            />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="about-right-column">
          {/* Intro Section */}
          <section className="about-intro-section" aria-label="Introduction">
            <h2 className="about-subtitle">Graphic designer</h2>
            <p className="about-desc">
              I'm a graphic designer with 3 years of experience in cosmetics, food, 
              and fashion. I aim to create multi-dimensional stories behind each 
              project to convey messages effectively.
            </p>
          </section>

          {/* Experience Section */}
          <section className="experience-section" aria-label="Work Experience">
            <h3 className="experience-title">Experience</h3>
            {EXPERIENCE_DATA.map((exp, index) => (
              <div key={index} className="experience-item">
                <div className="experience-header">
                  <h4 className="experience-role">{exp.role}</h4>
                  <span className="experience-date">{exp.date}</span>
                </div>
                <ul className="experience-list">
                  {exp.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Education Section */}
          <section className="education-section" aria-label="Education">
            <h3 className="education-title">Education</h3>
            {EDUCATION_DATA.map((edu, index) => (
              <div key={index} className="education-item">
                <h4 className="education-degree">{edu.degree}</h4>
                <span className="education-date">{edu.date}</span>
                <p className="education-school">{edu.school}</p>
              </div>
            ))}
          </section>
        </div>
      </div>

      {/* Content Section - Seamless Looping Scroller */}
      <div className="content-section-full">
        <h3 className="content-title">Featured Content</h3>
        <div className="content-scroller">
          <div className="content-track">
            {/* Direct and duplicate set for seamless loop using map */}
            {[...CONTENT_DATA, ...CONTENT_DATA].map((item, index) => (
              <div key={index} className="content-item">
                <div className="content-number">{item.id}</div>
                <div className="content-label">{item.label}</div>
                <p className="content-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Client Scroller Section */}
      <div className="client-box">
        <h2 className="about-sub">Client</h2>
        <div className="client-scroller">
          <div className="client-track">
            {/* Duplicated set for seamless loop */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="client-circle" aria-hidden="true" />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

export default About;
