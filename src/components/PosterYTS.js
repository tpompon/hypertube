import React from "react";
import translations from "../translations";

const Poster = ({ movie, language, from }) => (
  <div className="poster-container">
    <img
      className="movie-poster"
      src={
        from === "yst"
          ? `https://yst.am${movie.large_cover_image}`
          : movie.large_cover_image
      }
      alt={movie.title}
    />
    <div className="poster-overlay">
      <div className="poster-content">
        <h3>{movie.title}</h3>
        <p>{movie.summary}</p>
        <span>
          {translations[language].poster.rating} - {movie.rating}
        </span>
      </div>
    </div>
  </div>
);

export default Poster;
