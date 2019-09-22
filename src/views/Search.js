import React from 'react';
import axios from 'axios'
import config from '../config'
import Poster from '../components/Poster2'
import Loading from '../components/Loading'
import { Link } from "react-router-dom";

class Search extends React.Component {

  constructor(props) {
    super(props);
    this.search = React.createRef();
    this.state = {
      movies: [],
      _isLoaded: false,
      _status: undefined
    }
  }

  componentDidMount() {
    const search = this.props.search;
    if (search.trim() !== '') {
      axios.get(`http://${config.hostname}:${config.port}/torrents/yts/search/${search}`)
      .then((res) => {
        if (res.data.count !== 0) {
          this.setState({ movies: res.data.results.data.movies, _isLoaded: true, _status: 'no_result' });
        } else {
          //alert('No result');
          this.setState({ _isLoaded: true, _status: 'no_result' });
        }
      })
    } else {
      this.setState({ _isLoaded: true, _status: 'empty' });
      //alert('empty search');
    }
  }

  fetchMovies = () => {
    const search = this.search.current.value;
    if (search.trim() !== '') {
      axios.get(`http://${config.hostname}:${config.port}/torrents/yts/search/${search}`)
      .then((res) => {
        if (res.data.count !== 0) {
          this.setState({ movies: res.data.results.data.movies });
        } else {
          alert('No result');
        }
      })
    } else {
      alert('empty search');
    }
  }

  checkDatabase = (ytsID) => {
    axios.get(`http://${config.hostname}:${config.port}/movies/yts/${ytsID}`)
    .then((res) => {
      if (!res.data.success) {
        axios.get(`http://${config.hostname}:${config.port}/torrents/yts/${ytsID}`)
        .then((res) => {
          const movie = res.data.result.data.movie;

          movie.torrents.forEach((torrent) => {
						torrent.magnet = `magnet:?xt=urn:btih:${movie.torrents[0].hash}&dn=${encodeURI(movie.title)}&tr=http://track.one:1234/announce&tr=udp://track.two:80`;
						torrent.magnet2 = `magnet:?xt=urn:btih:${movie.torrents[0].hash}&dn=${encodeURI(movie.title)}&tr=http://track.one:1234/announce&tr=udp://tracker.openbittorrent.com:80`;
          })

          const newMovie = {
            ytsId: movie.id,
            name_fr: movie.title,
            name_en: movie.title,
            poster: movie.large_cover_image,
            ytsData: movie,
            description_fr: movie.description_full,
            description_en: movie.description_full,
            author: 'Someone',
            rating: movie.rating / 2
          }
          axios.post(`${config.serverURL}/movies`, newMovie)
          .then((res) => {
            if (res.data.success)
              this.props.history.push(`/watch/${res.data.movie._id}`);
            else
              alert('Could not create entry in Database for this movie');
          })
        });
      } else {
        this.props.history.push(`/watch/${res.data.movie._id}`);
      }
    })
  }

  render() {
    const { movies, _isLoaded } = this.state
    const { language } = this.props

    return (
      <div>
      {
        _isLoaded ? (
          <div className="posters-list row wrap">
          {
            movies.map((movie) => {
                if (!movie.large_cover_image)
                  movie.large_cover_image = 'http://story-one.com/wp-content/uploads/2016/02/Poster_Not_Available2.jpg';
                return (
                  // If doesn't exist in db create it and redirect on /watch/_id
                  // <Link to={`/watchyts/${movie.id}`} key={`movie-${movie.slug}`}>
                  //   <Poster movie={movie} language={language} />
                  // </Link>
                  <div onClick={() => this.checkDatabase(movie.id)}><Poster movie={movie} language={language} /></div>
                )
            })
          }
          </div>
        ) : <Loading />
      }
      </div>
      // <div>
      //   <h1>Test page</h1>
      //   <input ref={this.search} type="text" placeholder="search" />
      //   <button onClick={() => this.fetchMovies()}>Submit</button>
      //   {
      //     this.state.movies.map((movie) => {
      //       return (
      //         <div key={movie.slug}>
      //           <h1>{movie.title}</h1>
      //           <img src={movie.medium_cover_image} alt={movie.slug} />
      //           <iframe width="500" height="500"
      //             src={`https://www.youtube.com/embed/${movie.yt_trailer_code}`}>
      //           </iframe>
      //           <a style={{color: 'yellow'}} href={`https://www.imdb.com/title/${movie.imdb_code}`}>IMDb</a>
      //           <h2>Torrents:</h2>
      //           {
      //             movie.torrents.map((torrent) => {
      //               return (
      //                 <div>
      //                   <a style={{color: 'red'}} href={torrent.magnet}>Magnet</a> / <a style={{color: 'red'}} href={torrent.magnet2}>Magnet 2</a>
      //                   <br />
      //                   Quality: {torrent.quality}
      //                   <br />
      //                   Size: {torrent.size}
      //                   <br /><br />
      //                 </div>
      //               )
      //             })
      //           }
      //         </div>
      //       )
      //     })
      //   }
      // </div>
    );
  }
}

export default Search;
