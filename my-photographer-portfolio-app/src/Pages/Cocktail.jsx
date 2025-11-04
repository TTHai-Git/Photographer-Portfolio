import "../Assets/CSS/Cocktail.css";
import { importAllImagesByDir } from "../utils/index";

const Cocktail = () => {
  const images = importAllImagesByDir(
    require.context(
      "../Assets/Images/showcase/verdant-cocktail-bar/",
      false,
      /\.(png|jpe?g|svg)$/
    )
  );

  return (
    <div className="Cocktail-container">
      <h1 className="Cocktail-title">VERDANT COCKTAIL BAR</h1>

      {/* --- Top 8 Images (2 rows × 4 columns) --- */}
      <div className="Cocktail-showcase-top">
        {Object.keys(images)
          .slice(0, 8)
          .map((key) => (
            <div className="Cocktail-item-top" key={key}>
              <img
                src={images[key]}
                alt={key}
                className="Cocktail-image-top"
              />
            </div>
          ))}
      </div>

      {/* --- Content Section --- */}
      <h2 className="Cocktail-content">
        content
      </h2>

      {/* --- Bottom 2 Images (each centered) --- */}
      <div className="Cocktail-showcase-bottom">
        {Object.keys(images)
          .slice(8)
          .map((key) => (
            <div className="Cocktail-item-bottom" key={key}>
              <img
                src={images[key]}
                alt={key}
                className="Cocktail-image-bottom"
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Cocktail;
