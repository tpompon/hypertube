import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios'
import config from 'config'
import PosterYTS from 'components/PosterYTS'
import Loading from 'components/Loading'
import { Link, withRouter } from "react-router-dom";
import { UserConsumer } from 'store';

const Search = (props) => {

  //const [search, updateSearch] = useState("")
  const [movies, updateMovies] = useState([])
  const [_isLoaded, updateIsLoaded] = useState(false)
  const [_status, updateStatus] = useState(undefined)
  const context = useContext(UserConsumer)
  const { language, search } = context

  useEffect(() => {
    fetchMovies()
  }, [search])

  const fetchMovies = async() => {
    if (search.trim() !== '') {
      const response = await axios.get(`http://${config.hostname}:${config.port}/torrents/yts/search/${search}`)
      if (response.data.count !== 0) {
        updateMovies(response.data.results.data.movies)
      }
      updateStatus("no results")
    } else {
      updateStatus("empty")
      //alert('empty search');
    }
    updateIsLoaded(true)
  }

  const checkDatabase = async(ytsID) => {
    const responseMovies = await axios.get(`http://${config.hostname}:${config.port}/movies/yts/${ytsID}`)
    if (!responseMovies.data.success) {
      const responseYts = await axios.get(`http://${config.hostname}:${config.port}/torrents/yts/${ytsID}`)
      if (responseYts) {
        const movie = responseYts.data.result.data.movie;
        movie.torrents.forEach((torrent) => {
          torrent.magnet = `magnet:?xt=urn:btih:${movie.torrents[0].hash}&dn=${encodeURI(movie.title)}&tr=http://track.one:1234/announce&tr=udp://track.two:80`;
          torrent.magnet2 = `magnet:?xt=urn:btih:${movie.torrents[0].hash}&dn=${encodeURI(movie.title)}&tr=http://track.one:1234/announce&tr=udp://tracker.openbittorrent.com:80`;
        })
        const newMovie = {
          ytsId: movie.id,
          name: movie.title,
          poster: movie.large_cover_image,
          ytsData: movie,
          description: movie.description_full,
          author: 'Someone'
        }
        const responseNewMovie = await axios.post(`${config.serverURL}/movies`, newMovie)
        if (responseNewMovie.data.success) {
          props.history.push(`/watch/${responseNewMovie.data.movie._id}`);
        }
        else {
          alert('Could not create entry in Database for this movie');
        }
      }
    } else {
      props.history.push(`/watch/${responseMovies.data.movie._id}`);
    }
  }

  return (
    <div>
      {
        _isLoaded ? (
          <div className="posters-list row wrap">
          {
            movies.map((movie, index) => {
                console.log(movie)
                if (!movie.large_cover_image)
                  movie.large_cover_image = 'http://story-one.com/wp-content/uploads/2016/02/Poster_Not_Available2.jpg';
                return (
                  // If doesn't exist in db create it and redirect on /watch/_id
                  // <Link to={`/watchyts/${movie.id}`} key={`movie-${movie.slug}`}>
                  //   <Poster movie={movie} language={language} />
                  // </Link>
                  <div key={ `movie-${index}` } onClick={() => checkDatabase(movie.id)}><PosterYTS from="yts" movie={movie} language={language} /></div>
                )
            })
          }
          </div>
        ) : <Loading />
      }
      </div>
    )
}

export default withRouter(Search);
