import React from 'react';
import translations from '../translations'

function Poster(props) {

  const { movie, language } = props;

  return (
    <div className="poster-container">
      <img className="movie-poster" src={movie.poster} alt={(language === 'FR') ? movie.name_fr : movie.name_en} />
      <div className="poster-content">
        <h3>{(language === 'FR') ? movie.name_fr : movie.name_en}</h3>
        <p>{(language === 'FR') ? movie.description_fr : movie.description_en}</p>
        <span>{translations[language].poster.rating} - {movie.rating}</span>
      </div>
    </div>
  );
}

export default Poster;
