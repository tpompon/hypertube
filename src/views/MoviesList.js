import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import config from "config";
import Button from "components/Button";
import Poster from "components/Poster";
import Loading from "components/Loading";
import { UserConsumer } from "store";
import { Link } from "react-router-dom";
import API from "controllers";

function compare(a, b) {
  const nameA = a.name.toUpperCase();
  const nameB = b.name.toUpperCase();

  let comparison = 0;
  if (nameA > nameB) {
    comparison = 1;
  } else if (nameA < nameB) {
    comparison = -1;
  }
  return comparison;
}

const dropDownOptions = [
  { value: "", genre: "Genre:" },
  { value: "0", genre: "Comedy" },
  { value: "1", genre: "Sci-Fi" },
  { value: "2", genre: "Horror" },
  { value: "3", genre: "Romance" },
  { value: "4", genre: "Action" },
  { value: "5", genre: "Thriller" },
  { value: "6", genre: "Drama" },
  { value: "7", genre: "Mystery" },
  { value: "8", genre: "Crime" },
  { value: "9", genre: "Animation" },
  { value: "10", genre: "Adventure" },
  { value: "11", genre: "Fantasy" },
  { value: "12", genre: "Superhero" },
  { value: "13", genre: "Documentary" },
  { value: "14", genre: "Music" },
  { value: "15", genre: "Family" }
];

const MoviesList = () => {
  const context = useContext(UserConsumer);
  const [movies, updateMovies] = useState([]);
  const [filter, updateFilter] = useState({
    genre: "",
    minYear: "",
    maxYear: "",
    minRating: "",
    maxRating: ""
  });
  const [_isLoaded, updateIsLoaded] = useState(false);
  const { search, language } = context;

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    updateIsLoaded(true);
  });

  const fetchMovies = async () => {
    const response = await API.movies.get();
    if (response.data.success) {
      updateMovies(response.data.movies);
    }
  };

  const searchRequest = async () => {
    const response = await axios.get(
      `http://${config.hostname}:${config.port}/movies?genre=${filter.genre}&minyear=${filter.minYear}&maxyear=${filter.maxYear}&minrating=${filter.minRating}&maxRating=${filter.maxRating}`
    );
    if (response.data.success) {
      if (response.data.success) {
        updateMovies(response.data.movies);
      }
    }
  };

  return (
    <div>
      {_isLoaded ? (
        <div className="col">
          <div
            className="row wrap"
            style={{ justifyContent: "center", marginBottom: 20 }}
          >
            <input
              min={1900}
              max={2019}
              onChange={event =>
                updateFilter({ ...filter, ["minYear"]: event.target.value })
              }
              className="dark-input"
              type="number"
              placeholder="Min. Year"
            />
            <input
              min={1900}
              max={new Date().getFullYear()}
              onChange={event =>
                updateFilter({ ...filter, ["maxYear"]: event.target.value })
              }
              className="dark-input"
              type="number"
              placeholder="Max. Year"
              style={{ marginLeft: 10, marginRight: 30 }}
            />
            <select
              onChange={event =>
                updateFilter({ ...filter, ["genre"]: event.target.value })
              }
              className="dark-input"
            >
              {dropDownOptions.map(option => (
                <option key={`option-${option.value}`} value={option.value}>
                  {option.genre}
                </option>
              ))}
            </select>
            <input
              onChange={event =>
                updateFilter({ ...filter, ["minRating"]: event.target.value })
              }
              className="dark-input"
              type="number"
              placeholder="Min. Rating"
              style={{ marginLeft: 30 }}
            />
            <input
              onChange={event =>
                updateFilter({ ...filter, ["maxRating"]: event.target.value })
              }
              className="dark-input"
              type="number"
              placeholder="Max. Rating"
              style={{ marginLeft: 10 }}
            />
            <Button
              style={{ marginLeft: 20 }}
              action={() => searchRequest()}
              content="Search"
            />
          </div>
          <div className="posters-list row wrap">
            {movies.sort(compare).map((movie, index) => {
              if (
                movie.name
                  .toLowerCase()
                  .trim()
                  .includes(search.toLowerCase().trim())
              ) {
                return (
                  <Link to={`/watch/${movie._id}`} key={`movie-${index}`}>
                    <Poster movie={movie} language={language} />
                  </Link>
                );
              }
              return null;
            })}
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default MoviesList;
