import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "config";
import Rating from "react-rating";
import ProgressBar from "components/ProgressBar";
import { ReactComponent as StarFull } from "svg/star-full.svg";
import { ReactComponent as StarEmpty } from "svg/star-empty.svg";
import API from "controllers";

const Poster = props => {
  const { movie } = props;
  const [ratingAverage, updateRatingAverage] = useState(0);
  const [ratingCount, updateRatingCount] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchMovieData();
  }, []);

  const fetchMovieData = async () => {
    const response = await API.movies.ratingsById.get(movie._id);
    if (response.data.success) {
      updateRatingAverage(response.data.ratingAverage);
      updateRatingCount(response.data.ratingCount);
    }
    const resp = await axios.get(`${config.serverURL}/movies/${movie._id}/progress`)
    if (resp.data.success)
      setProgress(resp.data.watchPercent)
  };

  return (
    <div className="poster-container">
      <img className="movie-poster" src={movie.poster} alt={movie.name} />
      <ProgressBar progress={progress} />
      {/* To replace with the progression watch time of the user on the movie */}
      <div className="poster-overlay">
        <div className="poster-content">
          <h3>{movie.name}</h3>
          <p>{movie.description}</p>
          <div className="row center">
            <span style={{ marginTop: 2.75 }}>
              <Rating
                readonly={true}
                initialRating={ratingAverage}
                emptySymbol={
                  <StarEmpty width="15" height="15" fill="#FFD700" />
                }
                fullSymbol={<StarFull width="15" height="15" fill="#FFD700" />}
                fractions={2}
              />
            </span>
            <span style={{ marginLeft: 5 }}>({ratingCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Poster;
