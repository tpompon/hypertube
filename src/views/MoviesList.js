import React from 'react';
import axios from 'axios'
import config from '../config'
import Poster from '../components/Poster'
import Loading from '../components/Loading'
import { Link } from "react-router-dom";

function compare_fr(a, b) {
  const nameA = a.name_fr.toUpperCase();
  const nameB = b.name_fr.toUpperCase();
  
  let comparison = 0;
  if (nameA > nameB) {
    comparison = 1;
  } else if (nameA < nameB) {
    comparison = -1;
  }
  return comparison;
}

function compare_en(a, b) {
  const nameA = a.name_en.toUpperCase();
  const nameB = b.name_en.toUpperCase();
  
  let comparison = 0;
  if (nameA > nameB) {
    comparison = 1;
  } else if (nameA < nameB) {
    comparison = -1;
  }
  return comparison;
}

class MoviesList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      _isLoaded: false
    }
  }

  componentDidMount() {
    axios.get(`http://${config.hostname}:${config.port}/movies`)
    .then(res => {
      if (res.data.success) {
        this.setState({movies: res.data.movies}, () => {
          if (this.props.language === 'FR') {
            this.state.movies.sort(compare_fr);
            this.setState({_isLoaded: true});
          } else {
            this.state.movies.sort(compare_en);
            this.setState({_isLoaded: true});
          }
        });
      }
    });
  }

  render() {
    const { movies, _isLoaded } = this.state;
    const { search, language } = this.props;

    return (
      <div>
      {
        _isLoaded ? (
          <div className="posters-list row wrap">
          {
            movies.map((movie) => {
              if (movie.name_fr.toLowerCase().trim().includes(search.toLowerCase().trim())) {
                return (
                  <Link to={`/watch/${movie._id}`} key={`movie-${movie._id}`}>
                    <Poster movie={movie} language={language} />
                  </Link>
                )
              }
              return null;
            })
          }
          </div>
        ) : <Loading />
      }
      </div>
    );
  }
}

export default MoviesList
