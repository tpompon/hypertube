import React from 'react';
import axios from 'axios'
import config from '../config'
import Button from '../components/Button'
import Poster from '../components/Poster'
import Loading from '../components/Loading'
import { UserConsumer } from '../store';
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

  static contextType = UserConsumer

  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      filter: {
        genre: "",
        minYear: "",
        maxYear: "",
        minRating: "",
        maxRating: ""
      },
      _isLoaded: false
    }
  }

  componentDidMount() {
    console.log("test")
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
  
  updateFilter = () => {
    const fGenre = document.getElementById("filter_genre");
    const fMinYear = document.getElementById("filter_minyear");
    const fMaxYear = document.getElementById("filter_maxyear");
    const fMinRating = document.getElementById("filter_minrating");
    const fMaxRating = document.getElementById("filter_maxrating");

    this.setState({
      filter: {
        genre: fGenre.value,
        minYear: fMinYear.value,
        maxYear: fMaxYear.value,
        minRating: fMinRating.value,
        maxRating: fMaxRating.value
      }
    })
  }

  searchRequest = () => {
    const { filter } = this.state;
    axios.get(`http://${config.hostname}:${config.port}/movies?genre=${filter.genre}&minyear=${filter.minYear}&maxyear=${filter.maxYear}&minrating=${filter.minRating}&maxRating=${filter.maxRating}`)
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
    const { language } = this.props;
    const { search } = this.context
    return (
      <div>
      {
        _isLoaded ? (
          <div className="col">
            <div className="row wrap" style={{ justifyContent: 'center', marginBottom: 20 }}>
              <input id="filter_minyear" onChange={() => this.updateFilter()} className="dark-input" type="number" placeholder="Min. Year" />
              <input id="filter_maxyear" onChange={() => this.updateFilter()} className="dark-input" type="number" placeholder="Max. Year" style={{marginLeft: 10, marginRight: 30}} />
              <select id="filter_genre" onChange={() => this.updateFilter()} className="dark-input">
                <option value="">Genre:</option>
                <option value="0">Comedy</option>
                <option value="1">Sci-Fi</option>
                <option value="2">Horror</option>
                <option value="3">Romance</option>
                <option value="4">Action</option>
                <option value="5">Thriller</option>
                <option value="6">Drama</option>
                <option value="7">Mystery</option>
                <option value="8">Crime</option>
                <option value="9">Animation</option>
                <option value="10">Adventure</option>
                <option value="11">Fantasy</option>
                <option value="12">Superhero</option>
                <option value="13">Documentary</option>
                <option value="14">Music</option>
                <option value="15">Family</option>
              </select>
              <input id="filter_minrating" onChange={() => this.updateFilter()} className="dark-input" type="number" placeholder="Min. Rating" style={{marginLeft: 30}} />
              <input id="filter_maxrating" onChange={() => this.updateFilter()} className="dark-input" type="number" placeholder="Max. Rating" style={{marginLeft: 10}} />
              <Button action={() => this.searchRequest()} content="Search" />
            </div>
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
          </div>
        ) : <Loading />
      }
      </div>
    );
  }
}

export default MoviesList
