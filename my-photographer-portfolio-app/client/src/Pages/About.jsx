import React, { useState } from "react";
import "../Assets/CSS/About.css";
import { useImages } from "../hooks/loadImages";

const About = () => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("latest");
  const { images, totalPages, loading } = useImages(
    page,
    100,
    "Hoang-Truc-Photographer-Portfolio/about/anh hau truong",
    sort
  );

  return (
    <article className="about-container">
      {/* Top Header Section */}
      <div className="about-header-section">
        <h1 className="about-title-main">ABOUT</h1>
        <div className="about-header-content">
          <div className="about-intro">
            Xin chào, mình là Trúc, photographer chuyên về chụp ảnh sản phẩm tại TP. Hồ Chí Minh, từ packshot đơn giản đến các bộ ảnh concept. Bên cạnh việc trực tiếp thực hiện, mình còn cộng tác với một số cộng sự trong từng dự án để cùng tạo ra những hình ảnh phù hợp với mục tiêu và yêu cầu của khách hàng, hướng đến một quy trình làm việc hiệu quả và chỉn chu.
          </div>
          <div className="about-contact">
            Thông tin liên hệ<br />
            Zalo: 0798207241<br />
            face book: Hoàng Trúc<br />
            Instagram: HtrucPhoto<br />
            mail: Hoangtruc74@gmail.com
          </div>
        </div>
      </div>

      {/* Image Scroller (Left to Right) */}
      <div className="about-image-scroller">
        <div className="about-image-track">
          {!loading && images && images.length > 0 && (
            <>
              {/* Duplicate images for seamless looping */}
              {[...images, ...images].map((img, idx) => (
                <img key={idx} src={img.secure_url || img.url} alt={`Hậu trường ${idx}`} className="about-scroll-img" />
              ))}
            </>
          )}
        </div>
      </div>

      {/* Core Values Section */}
      <div className="about-core-values">
        <div className="core-value-item">
          <h4>Tập trung<br/>mục tiêu</h4>
          <p>Luôn bắt đầu bằng việc lắng nghe mục tiêu của khách hàng để đề xuất phong cách và giải pháp hình ảnh phù hợp.</p>
        </div>
        <div className="core-value-item">
          <h4>Quy trình rõ ràng,<br/>linh hoạt</h4>
          <p>Mỗi dự án đều có quy trình làm việc rõ ràng, đồng thời luôn sẵn sàng điều chỉnh để phù hợp với nhu cầu thực tế.</p>
        </div>
        <div className="core-value-item">
          <h4>Chỉn chu trong từng<br/>sản phẩm</h4>
          <p>Sự chỉn chu trong từng chi tiết giúp bộ ảnh có chất lượng ổn định và sử dụng hiệu quả trên nhiều nền tảng.</p>
        </div>
      </div>

      {/* Services Section */}
      <div className="about-services-section">
        <h2 className="section-title">DỊCH VỤ</h2>
        <div className="services-placeholder">
          <p>Coming soon</p>
        </div>
      </div>

      {/* Clients Section */}
      <div className="about-clients-section">
        <h2 className="section-title">KHÁCH HÀNG</h2>
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
