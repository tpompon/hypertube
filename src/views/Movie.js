import React from 'react'
import axios from 'axios'
import config from '../config'
import translations from '../translations'
import Rating from 'react-rating'
import Button from '../components/Button'
import { ReactComponent as StarFull } from '../svg/star-full.svg'
import { ReactComponent as StarEmpty } from '../svg/star-empty.svg'
import { ReactComponent as VerifiedIcon } from '../svg/verified.svg'
import { ReactComponent as ReportFlag } from '../svg/report-flag.svg'
import { ReactComponent as Close } from '../svg/close.svg'

class Movie extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: parseInt(this.props.match.params.id),
      movie: {},
      comment: ""
    }
  }

  componentWillMount() {
    axios.get(`http://${config.hostname}:${config.port}/movie/${this.props.match.params.id}`)
      .then(res => this.setState({movie: res.data, loaded: true}))
      .then(() => {
        if (this.state.movie) {
          document.querySelector('.comment-input').addEventListener('keypress', (e) => {
            var key = e.which || e.keyCode;
            if (key === 13) {
              this.refs.reviewSubmit.click();
            }
          });
          document.addEventListener('keydown', (e) => {
            var key = e.which || e.keyCode;
            if (key === 27) {
              this.hidePlayer();
            }
          });
        }
      })
  }

  addComment = () => {
    const body = {
      id: this.state.movie.comments.length + 1,
      author: "ipare",
      content: this.state.comment
    }

    axios.post(`http://${config.hostname}:${config.port}/movie/${this.props.match.params.id}/comments`, body)
      .then(res => console.log(res.data));
  
    this.state.movie.comments.push(body);
    this.setState({comment: ""});
  }

  showPlayer = () => {
    const playerContainer = document.getElementsByClassName('player-container')[0];
    playerContainer.style.display = 'block';
  }
  hidePlayer = () => {
    const playerContainer = document.getElementsByClassName('player-container')[0];
    playerContainer.style.display = 'none';
  }

  render() {
    const { movie, loaded } = this.state;
    const { language } = this.props;


    return (
      <div>
        {
          (movie && loaded)
          ? (
            <div>
              <div className="movie-page">
                <div className="row wrap">
                  <img className="movie-page-poster center" src={movie.poster} alt="Movie poster" />
                  <div className="col center" style={{ width: '45%', padding: 50, backgroundColor: '#16162e', wordBreak: 'break-word', borderRadius: 20 }}>
                    <div className="movie-infos" style={{marginBottom: 20}}>
                      <h1>{(language === 'FR') ? movie.name_fr : movie.name_en}</h1>
                      <p>{(language === 'FR') ? movie.description_fr : movie.description_en}</p>
                      {translations[language].movie.userRating}
                      <Rating
                        initialRating={movie} // Put user notation
                        emptySymbol={<StarEmpty width="20" height="20" fill="#FFD700" />}
                        fullSymbol={<StarFull width="20" height="20" fill="#FFD700" />}
                        fractions={2}
                      />
                      <br />
                      <span>{translations[language].movie.rating} - {movie.rating}</span>
                    </div>
                    <span onClick={() => this.showPlayer()}><Button content={translations[language].movie.watch} /></span>
                    <div>
                      <h2>{translations[language].movie.comments}</h2>
                      <div className="comments col">
                      {
                        movie.comments.map((comment) => {
                          return (
                            <div className="comment">
                              <div className="report-flag"><ReportFlag width="20" height="20" /></div>
                              <div className="comment-name">{comment.author}<span style={{marginLeft: 10}}><VerifiedIcon width="15" height="15" /></span></div>
                              {comment.content}
                            </div>
                          )
                        })
                      }
                      </div>
                      <input className="dark-input comment-input" placeholder={translations[language].movie.reviewPlaceholder} style={{width: '100%', marginBottom: 20}} value={this.state.comment} onChange={e => this.setState({ comment: e.target.value })} />
                      <div style={{float: 'right'}} ref="reviewSubmit" onClick={() => this.addComment()}><Button content={translations[language].movie.reviewSubmit} /></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="movie-page-lowres">
                <div className="movie-infos" style={{marginBottom: 20}}>
                  <img className="movie-page-poster-lowres" src={movie.poster} style={{ width: '100%' }} alt="poster" />
                  <h1>{(language === 'FR') ? movie.name_fr : movie.name_en}</h1>
                  <p>{(language === 'FR') ? movie.description_fr : movie.description_en}</p>
                  {translations[language].movie.userRating}
                  <Rating
                    initialRating={0} // Put user notation
                    emptySymbol={<StarEmpty width="20" height="20" fill="#FFD700" />}
                    fullSymbol={<StarFull width="20" height="20" fill="#FFD700" />}
                    fractions={2}
                  />
                  <br />
                  <span>{translations[language].movie.rating} - {movie.rating}</span>
                </div>
                <Button content={translations[language].movie.watch} />
                <div>
                  <h2>{translations[language].movie.comments}</h2>
                  <div className="comments col">
                    <div className="comment">
                      <div className="comment-name">Thomas P.<span style={{marginLeft: 10}}><VerifiedIcon width="15" height="15" /></span></div>
                      Un bon film
                    </div>
                    <div className="comment">
                      <div className="comment-name">Irina P.<span style={{marginLeft: 10}}><VerifiedIcon width="15" height="15" /></span></div>
                      Franchement sympa allez le voir c'est vraiment un film de qualité blablabla lorem ipsum you know c'est un long commentaire que j'écris voilà voilà ça y est on a plus d'une ligne là
                    </div>
                    <div className="comment">
                      <div className="comment-name">Audrey F.</div>
                      Cool.
                    </div>
                  </div>
                  <input className="dark-input comment-input" placeholder={translations[language].movie.reviewPlaceholder} style={{width: '100%', marginBottom: 20}} onChange={e => this.setState({ comment: e.target.value })} />
                  <div style={{float: 'right'}} onClick={() => this.addComment()}><Button content={translations[language].movie.reviewSubmit} /></div>
                </div>
              </div>

              {/* Player */}
              <div className="player-container" style={{display: 'none', position: 'absolute', top: 100, width: '100%', backgroundColor: "black", height: '93vh'}}>
                <div style={{position: 'relative', width: '100%', height: '100%'}}>
                  <span className="close-icon" onClick={() => this.hidePlayer()} style={{position: 'absolute', top: 25, right: 25}}><Close width="15" height="15" fill="#fff" /></span>
                </div>
              </div>

            </div>
          )
          : (
            <div>
            {
              (!movie) ? (
                <div style={{ color: 'white', textAlign: 'center' }}>
                  {translations[language].movie.noResults}
                </div>
              ) : <p>Loading...</p>
            }
            </div>
          )
        }
      </div>
    )
  }
}

export default Movie
