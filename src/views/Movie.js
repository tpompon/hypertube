import React from 'react'
import axios from 'axios'
import config from '../config'
import translations from '../translations'
import Rating from 'react-rating'
import Button from '../components/Button'
import Loading from '../components/Loading'
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
      user: {},
      comment: "",
      heartbeat: false,
      rating: 0,
      ratingAverage: 0,
      ratingCount: 0,
      moviePath: 'https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_1280_10MG.mp4'
    }
  }

  componentDidMount() {
    axios.get(`http://${config.hostname}:${config.port}/movies/${this.props.match.params.id}`)
    .then(res => this.setState({movie: res.data.movie[0], loaded: true}))
    .then(() => {
      if (this.state.movie) {
        console.log(this.state.movie)
        document.querySelector('.comment-input').addEventListener('keypress', (e) => {
          const key = e.which || e.keyCode;
          if (key === 13) {
            this.refs.reviewSubmit.click();
          }
        });
        document.addEventListener('keydown', (e) => {
          const key = e.which || e.keyCode;
          if (key === 27) {
            this.hidePlayer();
          }
        });
        // Remove les Events Listener dans le WillUnmount - sinon Memory Leaks -

        // Download torrent and display
        // axios.get(`http://${config.hostname}:${config.port}/torrents/download/${this.state.movie.name_fr}`)
        // .then(res => {
        //   this.setState({ moviePath: res.data.moviePath });
        //   console.log(this.state.moviePath)
        //   setTimeout(() => {
        //     const videoPlayer = document.getElementsByClassName('video-player')[0];
        //     videoPlayer.load();
        //     alert('loaded');
        //   }, 1000);
        // })
      }
    })
    axios.get(`http://${config.hostname}:${config.port}/auth`)
    .then(res => {
      this.setState({ user: res.data.user });
      axios.get(`http://${config.hostname}:${config.port}/movie/${this.props.match.params.id}/heartbeat`, { params: { uid: res.data.user._id } })
      .then((res) => {
        if (res.data.success && res.data.found > 0) {
          this.setState({ heartbeat: true });
        }
      });
      axios.get(`http://${config.hostname}:${config.port}/movie/${this.props.match.params.id}/ratings/${res.data.user._id}`)
      .then(res => {
        if (res.data.rating) {
          this.setState({ rating: res.data.rating });
        }
      })
      axios.get(`http://${config.hostname}:${config.port}/movie/${this.props.match.params.id}/ratings`)
      .then(res => {
        if (res.data.success) {
          this.setState({ ratingAverage: res.data.ratingAverage, ratingCount: res.data.ratingCount });
        }
      })
    })
  }

  addComment = () => {
    const { user } = this.state;
    const newComment = {
      author: user.username,
      content: this.state.comment
    }

    if (newComment.content.trim() !== '') {
      axios.post(`http://${config.hostname}:${config.port}/movie/${this.props.match.params.id}/comments`, newComment)
      .then(res => console.log(res.data));
  
      this.state.movie.comments.push(newComment);
    }
    this.setState({comment: ""});
  }

  updateRating = (value) => {
    const { user } = this.state;
    const newRating = {
      uid: user._id,
      rating: value
    }
    axios.post(`http://${config.hostname}:${config.port}/movie/${this.props.match.params.id}/ratings`, newRating)
    .then(() => {
      this.setState({ rating: value });
      axios.get(`http://${config.hostname}:${config.port}/movie/${this.props.match.params.id}/ratings`)
      .then(res => {
        if (res.data.success) {
          this.setState({ ratingAverage: res.data.ratingAverage, ratingCount: res.data.ratingCount });
        }
      })
    })
  }

  showPlayer = () => {
    const playerContainer = document.getElementsByClassName('player-container')[0];
    const videoPlayer = document.getElementsByClassName('video-player')[0];
    playerContainer.style.display = 'block';
    videoPlayer.play();
  }
  hidePlayer = () => {
    const playerContainer = document.getElementsByClassName('player-container')[0];
    const videoPlayer = document.getElementsByClassName('video-player')[0];
    playerContainer.style.display = 'none';
    videoPlayer.pause();
  }

  toggleHeartbeat = () => {
    const { user } = this.state;
    this.setState({ heartbeat: !this.state.heartbeat }, () => {
      if (this.state.heartbeat) {
        axios.post(`http://${config.hostname}:${config.port}/movie/${this.props.match.params.id}/heartbeat`, { uid: user._id }); // ipare ID (replace with logged user id)
      } else {
        // Need data object for DELETE REQUEST cf. https://github.com/axios/axios/issues/736 (not working without)
        axios.delete(`http://${config.hostname}:${config.port}/movie/${this.props.match.params.id}/heartbeat`, { data: { uid: user._id } }); // ipare ID (replace with logged user id)
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
                        <span style={{marginTop: 10, marginLeft: 10}}>({movie.ytsData.year})</span>
                        <div className="tooltip toggle-heartbeat" onClick={() => this.toggleHeartbeat()}>
                          {(heartbeat) ? <RemoveFav width="25" height="25" fill="crimson" /> : <AddFav width="25" height="25" fill="crimson" />}
                          <span className="tooltip-text">{(heartbeat) ? translations[language].movie.tooltip.heartbeatRemove : translations[language].movie.tooltip.heartbeatAdd}</span>
                        </div>
                      </div>
                      <div className="hr"></div>
                      <p>{(language === 'fr') ? movie.description_fr : movie.description_en}</p>
                      <div className="cast row">
                        {
                          movie.ytsData.cast.map((person) => {
                            return (
                              <a className="pointer" href={`https://www.imdb.com/name/nm${person.imdb_code}`} target="_blank" key={person.name}>
                                <img style={{ width: 75, height: 75, objectFit: 'cover', borderRadius: '50%', marginRight: -20 }} src={person.url_small_image ? person.url_small_image : `http://${config.hostname}:${config.port}/public/avatars/default_avatar.png`} alt={person.name} />
                              </a>
                            )
                          })
                        }
                      </div>
                      <Rating
                        onChange={(value) => this.updateRating(value)}
                        initialRating={this.state.rating}
                        emptySymbol={<StarEmpty width="30" height="30" fill="#FFD700" />}
                        fullSymbol={<StarFull width="30" height="30" fill="#FFD700" />}
                        fractions={2}
                      />
                      <br />
                      <span>{translations[language].movie.rating} - {this.state.ratingAverage} ({this.state.ratingCount})</span>
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
                              <div className="comment" key={`comment-${comment._id}`}>
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
                    <span style={{marginTop: 10, marginLeft: 10}}>({movie.ytsData.year})</span>
                    <div className="toggle-heartbeat" onClick={() => this.toggleHeartbeat()}>
                      {(heartbeat) ? <RemoveFav width="25" height="25" fill="crimson" /> : <AddFav width="25" height="25" fill="crimson" />}
                    </div>
                  </div>
                  <div className="hr"></div>
                  <p>{(language === 'fr') ? movie.description_fr : movie.description_en}</p>
                  <div className="cast row">
                    {
                      movie.ytsData.cast.map((person) => {
                        return (
                          <a className="pointer" href={`https://www.imdb.com/name/nm${person.imdb_code}`} target="_blank" key={person.name}>
                            <img style={{ width: 75, height: 75, objectFit: 'cover', borderRadius: '50%', marginRight: -20 }} src={person.url_small_image ? person.url_small_image : `http://${config.hostname}:${config.port}/public/avatars/default_avatar.png`} alt={person.name} />
                          </a>
                        )
                      })
                    }
                  </div>
                  <Rating
                    onChange={(value) => this.updateRating(value)}
                    initialRating={this.state.rating}
                    emptySymbol={<StarEmpty width="30" height="30" fill="#FFD700" />}
                    fullSymbol={<StarFull width="30" height="30" fill="#FFD700" />}
                    fractions={2}
                  />
                  <br />
                  <span>{translations[language].movie.rating} - {this.state.ratingAverage} ({this.state.ratingCount})</span>
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
                          <div className="comment" key={`comment-${comment._id}`}>
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
                  <video className="video-player" width='100%' controls controlsList="nodownload">
                  {
                    this.state.moviePath ? (
                        <source
                          src={this.state.moviePath}
                          type="video/mp4"
                        />
                    ) : null
                  }
                  </video>
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
                <Loading />
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
