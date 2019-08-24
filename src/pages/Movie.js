import React from 'react'
import Button from '../components/Button'

const movies = [
  { id: 1, name_fr: "L'Arnacoeur", name_en: "L'Arnacoeur", poster: "/posters/arnacoeur.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 2, name_fr: "Hunger Games", name_en: "Hunger Games", poster: "/posters/hunger_games.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 3, name_fr: "Le Monde de Narnia", name_en: "Narnia's World", poster: "/posters/narnia.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 4, name_fr: "Pirates des Caraïbes", name_en: "Pirates of Caraïbes", poster: "/posters/pirates_des_caraibes.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 5, name_fr: "Star Wars: Le Réveil de la Force", name_en: "Star Wars: Strength Awakening", poster: "/posters/star_wars.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 6, name_fr: "Sully", name_en: "Sully", poster: "/posters/sully.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 7, name_fr: "Star Wars: Les Derniers Jedi", name_en: "Star Wars: The Last Jedi", poster: "/posters/star_wars2.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.2 },
  { id: 8, name_fr: "Titanic", name_en: "Titanic", poster: "/posters/titanic.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 9, name_fr: "Spiderman: Homecoming", name_en: "Spiderman: Homecoming", poster: "/posters/spiderman.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 10, name_fr: "Dunkerque", name_en: "Dunkerque", poster: "/posters/dunkerque.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 }
]

class Movie extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: parseInt(this.props.match.params.id)
    }
  }

  render() {

    const movie = movies.find(x => x.id === this.state.id);
    const { language } = this.props;

    return (
      <div>
        {
          (movie)
          ? (
            <div>
              <div className="movie-page">
                <div className="row wrap">
                  <img className="movie-page-poster center" src={movie.poster} alt="poster" style={{ marginBottom: 50 }} />
                  <div className="col center" style={{ width: '50%', padding: 20, backgroundColor: '#16162e', wordBreak: 'break-word', borderRadius: 20 }}>
                    <div className="movie-infos" style={{marginBottom: 20}}>
                      <h1>{(language === 'FR') ? movie.name_fr : movie.name_en}</h1>
                      <p>{(language === 'FR') ? movie.description_fr : movie.description_en}</p>
                      <span>{(language === 'FR') ? 'Note' : 'Rating'} - {movie.rating}</span>
                    </div>
                    <Button content={(language === 'FR') ? 'Regarder' : 'Watch'} />
                  </div>
                </div>
              </div>
              <div className="movie-page-lowres">
                <div className="movie-infos" style={{marginBottom: 20}}>
                  <img className="movie-page-poster-lowres" src={movie.poster} style={{ width: '100%' }} alt="poster" />
                  <h1>{(language === 'FR') ? movie.name_fr : movie.name_en}</h1>
                  <p>{(language === 'FR') ? movie.description_fr : movie.description_en}</p>
                  <span>{(language === 'FR') ? 'Note' : 'Rating'} - {movie.rating}</span>
                </div>
                <Button content={(language === 'FR') ? 'Regarder' : 'Watch'} />
              </div>
            </div>
          )
          : (
            <div style={{ color: 'white', textAlign: 'center' }}>
              {(language === 'FR') ? 'Aucun résultat' : 'No result'}
            </div>
          )
        }
      </div>
    )
  }
}

export default Movie
