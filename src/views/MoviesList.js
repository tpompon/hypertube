import React from 'react';
import axios from 'axios'
import config from '../config'
import Poster from '../components/Poster'
import { Link } from "react-router-dom";

// const movies = [
//   { id: 1, name_fr: "L'Arnacoeur", name_en: "L'Arnacoeur", poster: "/posters/arnacoeur.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 3.5 },
//   { id: 2, name_fr: "Hunger Games", name_en: "Hunger Games", poster: "/posters/hunger_games.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4 },
//   { id: 3, name_fr: "Le Monde de Narnia", name_en: "Narnia's World", poster: "/posters/narnia.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.5 },
//   { id: 4, name_fr: "Pirates des Caraïbes", name_en: "Pirates of Caraïbes", poster: "/posters/pirates_des_caraibes.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 3 },
//   { id: 5, name_fr: "Star Wars: Le Réveil de la Force", name_en: "Star Wars: Strength Awakening", poster: "/posters/star_wars.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 3.5 },
//   { id: 6, name_fr: "Sully", name_en: "Sully", poster: "/posters/sully.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4 },
//   { id: 7, name_fr: "Star Wars: Les Derniers Jedi", name_en: "Star Wars: The Last Jedi", poster: "/posters/star_wars2.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4 },
//   { id: 8, name_fr: "Titanic", name_en: "Titanic", poster: "/posters/titanic.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.5 },
//   { id: 9, name_fr: "Spiderman: Homecoming", name_en: "Spiderman: Homecoming", poster: "/posters/spiderman.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4 },
//   { id: 10, name_fr: "Dunkerque", name_en: "Dunkerque", poster: "/posters/dunkerque.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4 }
// ]

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
      movies: []
    }
  }

  componentWillMount() {
    axios.get(`http://${config.hostname}:${config.port}/movies`)
    .then(res => {
      if (res.data.success) {
        this.setState({movies: res.data.movies}, () => {
          if (this.props.language === 'FR') {
            this.state.movies.sort(compare_fr);
          } else {
            this.state.movies.sort(compare_en);
          }
        });
      }
    });
  }

  render() {
    const { movies } = this.state;
    const { search, language } = this.props;

    return (
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
    );
  }
}

export default MoviesList
