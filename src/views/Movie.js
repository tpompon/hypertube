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
import { ReactComponent as AddFav } from '../svg/add_heart.svg'
import { ReactComponent as RemoveFav } from '../svg/remove_heart.svg'

class Movie extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: parseInt(this.props.match.params.id),
      movie: {},
      comment: "",
      heartbeat: false
    }
  }

  componentWillMount() {
    axios.get(`http://${config.hostname}:${config.port}/movie/${this.props.match.params.id}`)
      .then(res => this.setState({movie: res.data.movie[0], loaded: true}))
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
          // Remove les Events Listener dans le WillUnmount - sinon Memory Leaks -
        }
      })
    axios.get(`http://${config.hostname}:${config.port}/movie/${this.props.match.params.id}/heartbeat`, { params: { uid: "5d682020d7bbba2a386edf74" } })
      .then((res) => {
        if (res.data.success && res.data.found > 0) {
          this.setState({ heartbeat: true });
        }
      });
  }

  addComment = () => {
    const newComment = {
      author: "ipare",
      content: this.state.comment
    }

    axios.post(`http://${config.hostname}:${config.port}/movie/${this.props.match.params.id}/comments`, newComment)
      .then(res => console.log(res.data));
  
    this.state.movie.comments.push(newComment);
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

  toggleHeartbeat = () => {
    const { language } = this.state;
    const heartbeatTooltip = document.getElementsByClassName('tooltip-text')[0];

    // Remplacer avec les traductions, object translations non accessible, pourquoi ?
    this.setState({ heartbeat: !this.state.heartbeat }, () => {
      if (this.state.heartbeat) {
        axios.post(`http://${config.hostname}:${config.port}/movie/${this.props.match.params.id}/heartbeat`, { uid: "5d682020d7bbba2a386edf74" }); // ipare ID (replace with logged user id)
        heartbeatTooltip.innerHTML = "Remove"; //translations[language].movie.tooltip.heartbeatRemove
      } else {
        // Need data object for DELETE REQUEST cf. https://github.com/axios/axios/issues/736 (not working without)
        axios.delete(`http://${config.hostname}:${config.port}/movie/${this.props.match.params.id}/heartbeat`, { data: { uid: "5d682020d7bbba2a386edf74" } }); // ipare ID (replace with logged user id)
        heartbeatTooltip.innerHTML = "Add"; //translations[language].movie.tooltip.heartbeatAdd
      }
    });
  }

  render() {
    const { movie, loaded, heartbeat } = this.state;
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
                      <div className="row" style={{ alignItems: 'center' }}>
                        <h1>{(language === 'fr') ? movie.name_fr : movie.name_en}</h1>
                        <div className="tooltip toggle-heartbeat" onClick={() => this.toggleHeartbeat()}>
                          {(heartbeat) ? <RemoveFav width="25" height="25" fill="crimson" /> : <AddFav width="25" height="25" fill="crimson" />}
                          <span className="tooltip-text">{(heartbeat) ? translations[language].movie.tooltip.heartbeatRemove : translations[language].movie.tooltip.heartbeatAdd}</span>
                        </div>
                      </div>
                      <div className="hr"></div>
                      <p>{(language === 'fr') ? movie.description_fr : movie.description_en}</p>
                      <Rating
                        initialRating={0} // Put user notation
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
                      <div className="hr"></div>
                      <div className="comments col">
                      {
                        movie.comments.length > 0 ? (
                          movie.comments.map((comment) => {
                            return (
                              <div className="comment">
                                <div className="report-flag"><ReportFlag width="20" height="20" /></div>
                                <div className="comment-name">{comment.author}<span style={{marginLeft: 10}}><VerifiedIcon width="15" height="15" /></span></div>
                                {comment.content}
                              </div>
                            )
                          })
                        ) : (
                          <div className="no-comments center" style={{marginTop: 50, marginBottom: 50}}>{translations[language].movie.noComments}</div>
                        )
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
                  <div className="row" style={{ alignItems: 'center' }}>
                    <h1>{(language === 'fr') ? movie.name_fr : movie.name_en}</h1>
                    <div className="toggle-heartbeat" onClick={() => this.toggleHeartbeat()}>
                      {(heartbeat) ? <RemoveFav width="25" height="25" fill="crimson" /> : <AddFav width="25" height="25" fill="crimson" />}
                    </div>
                  </div>
                  <div className="hr"></div>
                  <p>{(language === 'fr') ? movie.description_fr : movie.description_en}</p>
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
                  <div className="hr"></div>
                  <div className="comments col">
                  {
                    movie.comments.length > 0 ? (
                      movie.comments.map((comment) => {
                        return (
                          <div className="comment">
                            <div className="report-flag"><ReportFlag width="20" height="20" /></div>
                            <div className="comment-name">{comment.author}<span style={{marginLeft: 10}}><VerifiedIcon width="15" height="15" /></span></div>
                            {comment.content}
                          </div>
                        )
                      })
                    ) : (
                      <div className="no-comments center" style={{marginTop: 50, marginBottom: 50}}>{translations[language].movie.noComments}</div>
                    )
                  }
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
              ) : (
                <div class="container">
                  <div class="flex" style={{ marginTop: 300 }}>
                    <div class="loader">
                    </div>
                  </div>
                  <div class="load-text">Loading...</div>
                </div>
              )
            }
            </div>
          )
        }
      </div>
    )
  }
}

export default Movie
