import { useState } from "react";
import "../Assets/CSS/About.css";

const About = () => {
  // Track hero image load state — eager images reveal instantly (no delay)
  const [heroLoaded, setHeroLoaded] = useState(false);
  return (
    <article className="about-container">
      {/* Title pinned to the very top and centered */}
      <h1 className="about-title">Hoang Truc</h1>

      <div className="about-main-content">
        {/* LEFT COLUMN - Only Hero Image */}
        <div className="about-left-column">
        {/* Hero Image – eager loaded for LCP, reveals via onLoad */}
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
              onLoad={() => setHeroLoaded(true)}
              style={{
                opacity: heroLoaded ? 1 : 0,
                transition: "opacity 0.5s ease-out",
              }}
            />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="about-right-column">
          {/* Intro Section */}
          <section className="about-intro-section" aria-label="Introduction">
            <h2 className="about-subtitle">Graphic designer</h2>
            <p className="about-desc">
              I'm a graphic designer, with 3 years of experience in fields such
              as Cosmetics, Food, Fashion... and some personal projects about
              illustration and animation. I aim to become a designer with a
              multi-dimensional perspective, believing in the story behind each
              project to convey the message effectively.
            </p>
          </section>

          {/* Experience Section */}
          <section className="experience-section" aria-label="Work Experience">
            <h3 className="experience-title">Experience</h3>

            <div className="experience-item">
              <div className="experience-header">
                <h4 className="experience-role">
                  Graphic Designer at Yves Rocher
                </h4>
                <span className="experience-date">Aug 2022 - Present</span>
              </div>
              <ul className="experience-list">
                <li>
                  Follow brand guidelines, create visual assets for campaigns,
                  product launches, and promotions across digital and print
                  media, including banners, social media posts...
                </li>
                <li>
                  Design marketing materials such as brochures, catalogues, and
                  event collateral.
                </li>
                <li>
                  Ensure consistency in the visual identity across all
                  touchpoints.
                </li>
                <li>
                  Adapt designs to align with the brand's eco-conscious and
                  botanical-focused image.
                </li>
                <li>
                  Work closely with marketing, and digital teams to ensure
                  cohesive storytelling.
                </li>
                <li>
                  Liaise with external printers to ensure quality execution.
                </li>
              </ul>
            </div>

            <div className="experience-item">
              <div className="experience-header">
                <h4 className="experience-role">Brand Designer at Amy Cake</h4>
                <span className="experience-date">
                  2023 - 2024 (Freelancer)
                </span>
              </div>
              <ul className="experience-list">
                <li>
                  Develop and refine the brand's visual identity, including
                  logos, color palettes, typography, and graphic elements.
                </li>
                <li>
                  Create visual assets for marketing campaigns, product
                  packaging and other promotional materials.
                </li>
              </ul>
            </div>

            <div className="experience-item">
              <div className="experience-header">
                <h4 className="experience-role">
                  Video and Photography at Roz Accessories
                </h4>
                <span className="experience-date">
                  Jun 2023 - Jul 2024 (Freelancer)
                </span>
              </div>
              <ul className="experience-list">
                <li>
                  Shoot and produce engaging videos for promotional on Tiktok
                  platform.
                </li>
                <li>
                  Follow plan video projects, including storyboarding,
                  scripting, and identifying key shot.
                </li>
                <li>
                  Produce teaser videos and product photography for the
                  "Bloomette" collection.
                </li>
              </ul>
            </div>

            <div className="experience-item">
              <div className="experience-header">
                <h4 className="experience-role">
                  Graphic Designer at Aldo Shoes
                </h4>
                <span className="experience-date">
                  Jan - Jul 2024 (Freelancer)
                </span>
              </div>
              <ul className="experience-list">
                <li>
                  Create visual assets for promotions across digital and print
                  media.
                </li>
              </ul>
            </div>
          </section>

          {/* Education Section */}
          <section className="education-section" aria-label="Education">
            <h3 className="education-title">Education</h3>

            <div className="education-item">
              <h4 className="education-degree">Bachelor of Graphic Designer</h4>
              <span className="education-date">(2018 - 2022)</span>
              <p className="education-school">Van lang university</p>
            </div>

            <div className="education-item">
              <h4 className="education-degree">
                2D Animation & Motion Graphics
              </h4>
              <span className="education-date">
                Basic to Intermediate (03.2023)
              </span>
              <p className="education-school">Keyframe multimedia school</p>
            </div>
          </section>
        </div>
      </div>

      {/* Content/Portfolio Section - Full width at bottom */}
      <div className="content-section-full">
        <h3 className="content-title">Content</h3>
        <div className="content-scroller">
          <div className="content-track">
            {/* first set of items */}
            <div className="content-item">
              <div className="content-number">1</div>
              <div className="content-label">Branding</div>
              <p className="content-desc">Amy Cake</p>
            </div>
            <div className="content-item">
              <div className="content-number">2</div>
              <div className="content-label">Marketing Designer</div>
              <p className="content-desc">Yves rocher</p>
            </div>
            <div className="content-item">
              <div className="content-number">3</div>
              <div className="content-label">Illustration</div>
              <p className="content-desc">Rood game packaging Red envelope</p>
            </div>
            <div className="content-item">
              <div className="content-number">4</div>
              <div className="content-label">Animation</div>
              <p className="content-desc">Mua noi thu Christmas postcard</p>
            </div>
            <div className="content-item">
              <div className="content-number">5</div>
              <div className="content-label">Photography</div>
              <p className="content-desc">
                Hen aro Phuong Dong ROZ accessories
              </p>
            </div>

            {/* duplicate set for seamless loop */}
            <div className="content-item">
              <div className="content-number">1</div>
              <div className="content-label">Branding</div>
              <p className="content-desc">Amy Cake</p>
            </div>
            <div className="content-item">
              <div className="content-number">2</div>
              <div className="content-label">Marketing Designer</div>
              <p className="content-desc">Yves rocher</p>
            </div>
            <div className="content-item">
              <div className="content-number">3</div>
              <div className="content-label">Illustration</div>
              <p className="content-desc">Rood game packaging Red envelope</p>
            </div>
            <div className="content-item">
              <div className="content-number">4</div>
              <div className="content-label">Animation</div>
              <p className="content-desc">Mua noi thu Christmas postcard</p>
            </div>
            <div className="content-item">
              <div className="content-number">5</div>
              <div className="content-label">Photography</div>
              <p className="content-desc">
                Hen aro Phuong Dong ROZ accessories
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Client Scroller at Bottom */}
      <div className="client-box">
        <h2 className="about-sub">client</h2>
        <div className="client-scroller">
          <div className="client-track">
            {/* first set of circles */}
            <div className="client-circle" aria-hidden="true" />
            <div className="client-circle" aria-hidden="true" />
            <div className="client-circle" aria-hidden="true" />
            <div className="client-circle" aria-hidden="true" />
            <div className="client-circle" aria-hidden="true" />
            <div className="client-circle" aria-hidden="true" />

            {/*duplicate set for seamless loop*/}
            <div className="client-circle" aria-hidden="true" />
            <div className="client-circle" aria-hidden="true" />
            <div className="client-circle" aria-hidden="true" />
            <div className="client-circle" aria-hidden="true" />
            <div className="client-circle" aria-hidden="true" />
            <div className="client-circle" aria-hidden="true" />
          </div>
        </div>
      </div>
    </article>
  );
};

export default About;
