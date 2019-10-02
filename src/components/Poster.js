import React from 'react';
import axios from 'axios';
import config from 'config';
import translations from 'translations';
import Rating from 'react-rating'
import { ReactComponent as StarFull } from 'svg/star-full.svg'
import { ReactComponent as StarEmpty } from 'svg/star-empty.svg'

class Poster extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ratingAverage: 0,
      ratingCount: 0
    }
  }

  componentDidMount() {
    axios.get(`${config.serverURL}/movie/${this.props.movie._id}/ratings`)
    .then(res => {
      if (res.data.success) {
        this.setState({ ratingAverage: res.data.ratingAverage, ratingCount: res.data.ratingCount });
      }
    })
  }

  render() {
    const { movie, language } = this.props;
    const { ratingAverage, ratingCount } = this.state;

    return (
      <div className="poster-container">
        <img className="movie-poster" src={movie.poster} alt={movie.name} />
        <div className="poster-overlay">
          <div className="poster-content">
            <h3>{movie.name}</h3>
            <p>{movie.description}</p>
            <span>{translations[language].poster.rating} - <Rating readonly={true} initialRating={ratingAverage} emptySymbol={<StarEmpty width="15" height="15" fill="#FFD700" />} fullSymbol={<StarFull width="15" height="15" fill="#FFD700" />} fractions={2} /> ({ratingCount})</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Poster;
