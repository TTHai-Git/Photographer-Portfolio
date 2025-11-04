import Avatar from '../Assets/Images/Avatar.png';
import '../Assets/CSS/About.css';

export const About = () => {
  return (
    <div className="about-container">
      <h1 className="about-name">Hoàng Trúc</h1>

      <div className="about-content">
        <img src={Avatar} alt="Hoang Truc" className="about-avatar" />

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
