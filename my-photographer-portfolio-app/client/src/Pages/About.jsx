
import '../Assets/CSS/About.css';
import { useCloudinaryImages } from '../hooks/loadImagesOnCloudinary';

export const About = () => {
  const { images, loading, count } = useCloudinaryImages("Hoang-Truc-Photographer-Portfolio/about");
  return (
    <div className="about-container">
      <h1 className="about-name">Hoàng Trúc</h1>

      <div className="about-content">
        <img src={images[0].url} alt="Hoang Truc" className="about-avatar" />

        <p className="about-description">
          Với nền tảng làm thiết kế đồ họa hơn 3 năm, tôi áp dụng những kỹ năng của mình để tạo nên những visual sản phẩm đẹp, 
          phù hợp với khách hàng thông qua nhiếp ảnh. Trò chuyện, phân tích và cảm nhận, tôi sẽ cùng bạn tạo ra một bức ảnh phù hợp, hiệu quả.
        </p>
      </div>

      <div className="about-client-section">
        <h2>client</h2>
        <div className="about-client-list">
          <div className="client-circle"></div>
          <div className="client-circle"></div>
          <div className="client-circle"></div>
          <div className="client-circle"></div>
          <div className="client-circle"></div>
          <div className="client-circle"></div>
        </div>
      </div>

      
    </div>
  );
};
export default About;
