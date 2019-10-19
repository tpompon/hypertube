import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import config from "config";
import Button from "components/Button";
import Poster from "components/Poster";
import PosterYTS from "components/PosterYTS";
import Loading from "components/Loading";
import { Link, withRouter } from "react-router-dom";
import { UserConsumer } from "store";
import API from "controllers";

function compareYTS(a, b) {
  const nameA = a.title.toUpperCase();
  const nameB = b.title.toUpperCase();

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
  { value: "comedy", genre: "Comedy" },
  { value: "sci-fi", genre: "Sci-Fi" },
  { value: "horror", genre: "Horror" },
  { value: "romance", genre: "Romance" },
  { value: "action", genre: "Action" },
  { value: "thriller", genre: "Thriller" },
  { value: "drama", genre: "Drama" },
  { value: "mystery", genre: "Mystery" },
  { value: "crime", genre: "Crime" },
  { value: "animation", genre: "Animation" },
  { value: "adventure", genre: "Adventure" },
  { value: "fantasy", genre: "Fantasy" },
  { value: "superhero", genre: "Superhero" },
  { value: "documentary", genre: "Documentary" },
  { value: "music", genre: "Music" },
  { value: "family", genre: "Family" }
];

const Search = props => {
  //const [search, updateSearch] = useState("")
  const [page, setPage] = useState(1)
  const [moviesYTS, updateMoviesYTS] = useState([]);
  const [_isLoaded, updateIsLoaded] = useState(false);
  const [filter, updateFilter] = useState({
    genre: '',
    minYear: "1900",
    maxYear: "2019",
    minRating: "",
    maxRating: ""
  });
  let inProgress = false;
  const context = useContext(UserConsumer);
  const { language, search } = context;

  useEffect(() => {
    fetchMovies()
  }, [])


  const fetchMovies = async () => {
    if (search.trim() !== "") {
      updateIsLoaded(false);
      const response = await axios.get(
        `http://${config.hostname}:${config.port}/torrents/yts/search/${search}${(filter.genre !== '') ? '?genre=' + filter.genre : '' }`
      );
      updateMoviesYTS(response.data.results);
    } else if (search.trim() === "") {
      const resp = await axios.get(`http://${config.hostname}:${config.port}/torrents/yts`)
      updateMoviesYTS(resp.data.results.data.movies)
    }
    updateIsLoaded(true);
  };

  const loadMore = async () => {
    setPage(curr => curr + 1);
    const resp = await axios.get(`http://${config.hostname}:${config.port}/torrents/yts?page=${page + 1}`)
    updateMoviesYTS(prevArray => ([ ...prevArray, ...resp.data.results.data.movies ]))
  }

  const checkDatabase = async ytsID => {
    if (inProgress) return;
    const responseMovies = await axios.get(
      `http://${config.hostname}:${config.port}/movies/yts/${ytsID}`
    );
    if (!responseMovies.data.success) {
      inProgress = true;
      const responseYts = await axios.get(
        `http://${config.hostname}:${config.port}/torrents/yts/${ytsID}`
      );
      if (responseYts) {
        const movie = responseYts.data.result.data.movie;
        movie.torrents.forEach(torrent => {
          torrent.magnet = `magnet:?xt=urn:btih:${
            movie.torrents[0].hash
          }&dn=${encodeURI(
            movie.title
          )}&tr=http://track.one:1234/announce&tr=udp://track.two:80`;
          torrent.magnet2 = `magnet:?xt=urn:btih:${
            movie.torrents[0].hash
          }&dn=${encodeURI(
            movie.title
          )}&tr=http://track.one:1234/announce&tr=udp://tracker.openbittorrent.com:80`;
        });
        const newMovie = {
          ytsId: movie.id,
          name: movie.title,
          poster: movie.large_cover_image,
          ytsData: movie,
          description: movie.description_full,
          author: "Someone"
        };
        const responseNewMovie = await axios.post(
          `${config.serverURL}/movies`,
          newMovie
        );
        if (responseNewMovie.data.success) {
          props.history.push(`/watch/${responseNewMovie.data.movie._id}`);
        } else {
          alert("Could not create entry in Database for this movie");
        }
      } else {
        inProgress = false;
      }
    } else {
      props.history.push(`/watch/${responseMovies.data.movie._id}`);
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
              max={new Date().getFullYear()}
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
              action={() => fetchMovies()}
              content="Search"
            />
          </div>
          <div className="posters-list row wrap">
            {moviesYTS.sort(compareYTS).map((movie, index) => {
              if (!movie.large_cover_image)
                movie.large_cover_image = "http://story-one.com/wp-content/uploads/2016/02/Poster_Not_Available2.jpg";

              return (
                <div
                  key={`movie-${index}`}
                  onClick={() => checkDatabase(movie.id)}
                >
                  <PosterYTS from="yts" movie={movie} language={language} />
                </div>
              );
            })}
          </div>
          <Button content="More" action={() => loadMore()} style={{margin: '0 auto'}} />
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default withRouter(Search);
