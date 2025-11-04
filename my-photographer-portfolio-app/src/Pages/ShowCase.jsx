import '../Assets/CSS/ShowCase.css';
import { importAllImagesByDir } from '../utils';


export const ShowCase = () => {
  const images = importAllImagesByDir(
      require.context(
        "../Assets/Images/showcase",
        false,
        /\.(png|jpe?g|svg)$/
      )
    );

  return (
    <div className="showcase-container">
      <h1 className="showcase-title">Showcase</h1>
      <nav>
        <ul className="showcase-nav">
          <li><a href="/show-case/cocktail">Cocktail</a></li>
          <li><a href="/show-case/nguyen-sac">Nguyen Sac</a></li>
          <li><a href="/show-case/bo-bai">Bo Bai</a></li>
          <li><a href="/show-case/fruit-macro">Fruit Macro</a></li>
          <li><a href="/show-case/kinh-boi">Kinh Boi</a></li>
        </ul>
      </nav>
      <br />
      {Object.keys(images).map((key) => (
        <div key={key} className="showcase-item">
          <p className="showcase-caption">{key}</p>
          <img src={images[key]} alt={key} className="showcase-image" />
        </div>
      ))}
    </div>
  );
};

export default ShowCase;
