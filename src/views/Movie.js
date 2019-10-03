import React, { useState, useEffect, useRef, useContext } from 'react'
import { withRouter } from "react-router-dom"
import axios from 'axios'
import config from 'config'
import translations from 'translations'
import Rating from 'react-rating'
import Button from 'components/Button'
import Loading from 'components/Loading'
import { ReactComponent as StarFull } from 'svg/star-full.svg'
import { ReactComponent as StarEmpty } from 'svg/star-empty.svg'
import { ReactComponent as VerifiedIcon } from 'svg/verified.svg'
import { ReactComponent as ReportFlag } from 'svg/report-flag.svg'
import { ReactComponent as Close } from 'svg/close.svg'
import { ReactComponent as AddFav } from 'svg/add_heart.svg'
import { ReactComponent as RemoveFav } from 'svg/remove_heart.svg'
import { UserConsumer } from 'store'

const Movie = (props) => {

  const { match } = props
  const context = useContext(UserConsumer)
  const { language } = context
  const { id } = match.params
  //const [id, updateId] = useState(parseInt(id))
  const [movie, updateMovie] = useState({})
  const [user, updateUser] = useState({})
  const [comment, updateComment] = useState("")
  const [heartbeat, updateHeartbeat] = useState(false)
  const [rating, updateRating] = useState(0)
  const [ratingAverage, updateRatingAverage] = useState(0)
  const [ratingCount, updateRatingCount] = useState(0)
  const [loaded, updateLoaded] = useState(false)
  const [togglePlayer, updateTogglePlayer] = useState(false)
  const [moviePath, updateMoviePath] = useState("https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_1280_10MG.mp4")
  const player = useRef(null)

  useEffect(() => {
    fetchMovie()

    return () => {
      document.removeEventListener('scroll', handleScroll, false);
      document.removeEventListener('scroll', onEnter, false);
      document.removeEventListener('scroll', onEscape, false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchMovie();
  }, [id]);

  const fetchMovie = async() => {
    const reponseMovie = await axios.get(`http://${config.hostname}:${config.port}/movies/${id}`)
    if (reponseMovie) {
      updateMovie(reponseMovie.data.movie[0])
      updateLoaded(true)
      if (reponseMovie.data.movie[0]) {
        // Download torrent
        // const { movie } = this.state;
        // const body = {
        //   name: movie.ytsData.slug,
        //   magnet: movie.ytsData.torrents[0].magnet
        // }
        // axios.post(`${config.serverURL}/torrents/download`, body)
        // .then((res) => {
        //   console.log(res.data);
        //   this.setState({moviePath: res.data.moviePath}, () => {
        //     const videoPlayer = document.getElementsByClassName('video-player')[0];
        //     videoPlayer.load();
        //     videoPlayer.addEventListener('timeupdate', (ret) => {
        //       console.log('Actual time showing:', videoPlayer.currentTime)
        //       console.log('Duration:', videoPlayer.duration)
        //     });
        //   })
        // })

        document.addEventListener('scroll', handleScroll, false);
        document.querySelector('.comment-input').addEventListener('keydown', onEnter, false);
        document.addEventListener('keydown', onEscape, false);

        // Remove les Events Listener dans le WillUnmount - sinon Memory Leaks -

        // Download torrent and display
        // axios.get(`http://${config.hostname}:${config.port}/torrents/download/${this.state.movie.name}`)
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
    }
    const responseUser = await axios.get(`http://${config.hostname}:${config.port}/auth`)
    if (responseUser) {
      updateUser(responseUser.data.user)
      const responseHeartbeat = await axios.get(`http://${config.hostname}:${config.port}/movie/${id}/heartbeat`, { params: { uid: responseUser.data.user._id } })
      if (responseHeartbeat.data.success && responseHeartbeat.data.found > 0) {
        updateHeartbeat(true)
      }
      const responseRating = await axios.get(`http://${config.hostname}:${config.port}/movie/${id}/ratings/${responseUser.data.user._id}`)
      if (responseRating.data.rating) {
        updateRating(responseRating.data.rating)
      }
      const responseRatingCount = await axios.get(`http://${config.hostname}:${config.port}/movie/${id}/ratings`)
      if (responseRatingCount.data.success) {
        updateRatingAverage(responseRatingCount.data.ratingAverage)
        updateRatingCount(responseRatingCount.data.ratingCount)
      }
    }
  }

  const handleScroll = () => {
    const moviePoster = document.getElementById('movie-page-poster-fullsize');
    const movieInfos = document.getElementById('movie-infos-fullsize');
    const top = window.pageYOffset;

    const maxBottom = movieInfos.offsetHeight + movieInfos.offsetTop
    const posterHeight = moviePoster.offsetHeight + movieInfos.offsetTop;

    if (top + posterHeight <= maxBottom)
      moviePoster.style.marginTop = `${top}px`;
  }
  const onEnter = (e) => { if (e.keyCode === 13) addComment(); }
  const onEscape = (e) => { if (e.keyCode === 27) hidePlayer(); }


  const addComment = async() => {
    const newComment = {
      author: user.username,
      content: comment
    }

    // To fix
    // user.username et comment vides lorsque que l'on envoie avec la touche ENTER

    if (newComment.content.trim() !== '') {
      const response = await axios.post(`http://${config.hostname}:${config.port}/movie/${id}/comments`, newComment)
      if (response) {
        console.log(response.data)
      }
      updateMovie({ ...movie, comments: [...movie.comments, newComment] })
    }
    updateComment("")
  }

  const updatingRating = async(value) => {
    const newRating = {
      uid: user._id,
      rating: value,
    }
    const response = await axios.post(`http://${config.hostname}:${config.port}/movie/${id}/ratings`, newRating)
    if (response) {
      updateRating(value)
      const responseRating = await axios.get(`http://${config.hostname}:${config.port}/movie/${id}/ratings`)
      if (responseRating.data.success) {
        updateRatingAverage(responseRating.data.ratingAverage)
        updateRatingCount(responseRating.data.ratingCount)
      }
    }
  }

  // Make a state
  const showPlayer = () => {
    updateTogglePlayer(true)
    player.current.play();
  }

  const hidePlayer = () => {
    updateTogglePlayer(false)
    player.current.pause();
  }

  const toggleHeartbeat = async() => {
    if (!heartbeat) {
      axios.post(`http://${config.hostname}:${config.port}/movie/${id}/heartbeat`, { uid: user._id }); // ipare ID (replace with logged user id)
    } else {
      axios.delete(`http://${config.hostname}:${config.port}/movie/${id}/heartbeat`, { data: { uid: user._id } }); // ipare ID (replace with logged user id)
    }
    updateHeartbeat(!heartbeat)
  }

  const reportComment = async(id) => {
    const response = await axios.post(`${config.serverURL}/movie/${movie._id}/comments/report`, { commId: id })
    console.log(response)
  }

  return (
    <div>
      {
        (movie && loaded)
        ? (
          <div>
            <div className="movie-page">
              <div className="row wrap">
                <img id="movie-page-poster-fullsize" className="movie-page-poster center" src={movie.poster} alt="Movie poster" />
                <div id="movie-infos-fullsize" className="col center" style={{ width: '45%', padding: 50, backgroundColor: '#16162e', wordBreak: 'break-word', borderRadius: 20 }}>
                  <div className="movie-infos" style={{marginBottom: 20}}>
                    <div className="row" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                      <h1>{movie.name}</h1>
                      <span style={{marginTop: 10, marginLeft: 10}}>({movie.ytsData.year})</span>
                      <div className="tooltip toggle-heartbeat" onClick={() => toggleHeartbeat()}>
                        {(heartbeat) ? <RemoveFav width="25" height="25" fill="crimson" /> : <AddFav width="25" height="25" fill="crimson" />}
                        <span className="tooltip-text">{(heartbeat) ? translations[language].movie.tooltip.heartbeatRemove : translations[language].movie.tooltip.heartbeatAdd}</span>
                      </div>
                    </div>
                    <div className="hr"></div>
                    <div className="container-ytb" style={{marginBottom: 20}}>
                      <iframe src={`//www.youtube.com/embed/${movie.ytsData.yt_trailer_code}?autoplay=1`}
                      allow="autoplay" frameBorder="0" allowFullScreen className="video-ytb"></iframe>
                    </div>
                    {
                      movie.ytsData.genres ? (
                        <div className="genres row wrap" style={{marginBottom: 20}}>
                        {
                          movie.ytsData.genres.map((genre, index) => (
                              <div key={index} className="genre">{genre}</div>
                            ))
                        }
                        </div>
                      ) : null
                    }
                    <p>{movie.description}</p>
                    <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {
                        movie.ytsData.cast ? (
                          <div className="cast row" style={{marginBottom: 20}}>
                          {
                            movie.ytsData.cast.map((person, index) => (
                                <a className="pointer" href={`https://www.imdb.com/name/nm${person.imdb_code}`} target="_blank" key={`${person.name}-${index}`}>
                                  <img style={{ width: 75, height: 75, objectFit: 'cover', borderRadius: '50%', marginRight: -20 }} src={person.url_small_image ? person.url_small_image : `http://${config.hostname}:${config.port}/public/avatars/default_avatar.png`} alt={person.name} />
                                </a>
                              ))
                          }
                          </div>
                        ) : null
                      }
                      <div>
                        <Rating
                          onChange={(value) => updatingRating(value)}
                          initialRating={rating}
                          emptySymbol={<StarEmpty width="30" height="30" fill="#FFD700" />}
                          fullSymbol={<StarFull width="30" height="30" fill="#FFD700" />}
                          fractions={2}
                        />
                        <br />
                        <span>{translations[language].movie.rating} - {ratingAverage} ({ratingCount})</span>
                      </div>
                    </div>
                  </div>
                  <span onClick={() => showPlayer()}><Button content={translations[language].movie.watch} /></span>
                  <div>
                    <h2>{translations[language].movie.comments}</h2>
                    <div className="hr"></div>
                    <div className="comments col">
                    {
                      movie.comments.length > 0 ? (
                        movie.comments.map((comment, index) => (
                            <div className="comment" key={`comment-${index}`}>
                              <div onClick={() => reportComment(`${comment._id}`)} className="report-flag"><ReportFlag width="20" height="20" /></div>
                              <div className="comment-name">{comment.author}<span style={{marginLeft: 10}}><VerifiedIcon width="15" height="15" /></span></div>
                              {comment.content}
                            </div>
                          ))
                      ) : (
                        <div className="no-comments center" style={{marginTop: 50, marginBottom: 50}}>{translations[language].movie.noComments}</div>
                      )
                    }
                    </div>
                    <input className="dark-input comment-input" placeholder={translations[language].movie.reviewPlaceholder} style={{width: '100%', marginBottom: 20}} value={comment} onChange={e => updateComment(e.target.value)} />
                    <Button content={translations[language].movie.reviewSubmit} style={{float: 'right'}} action={() => addComment()} />
                  </div>
                </div>
              </div>
            </div>
            <div className="movie-page-lowres">
              <div className="movie-infos" style={{marginBottom: 20}}>
                <img className="movie-page-poster-lowres" src={movie.poster} style={{ width: '100%' }} alt="poster" />
                <div className="row" style={{ alignItems: 'center' }}>
                  <h1>{movie.name}</h1>
                  <span style={{marginTop: 10, marginLeft: 10}}>({movie.ytsData.year})</span>
                  <div className="toggle-heartbeat" onClick={() => toggleHeartbeat()}>
                    {(heartbeat) ? <RemoveFav width="25" height="25" fill="crimson" /> : <AddFav width="25" height="25" fill="crimson" />}
                  </div>
                </div>
                <div className="hr"></div>
                <div className="container-ytb" style={{marginBottom: 20}}>
                  <iframe src={`//www.youtube.com/embed/${movie.ytsData.yt_trailer_code}?autoplay=1`}
                  allow="autoplay" frameBorder="0" allowFullScreen className="video-ytb"></iframe>
                </div>
                {
                  movie.ytsData.genres ? (
                    <div className="genres row wrap" style={{marginBottom: 20}}>
                    {
                      movie.ytsData.genres.map((genre, index) => (
                          <div key={ index } className="genre">{genre}</div>
                        ))
                    }
                    </div>
                  ) : null
                }
                <p>{movie.description}</p>
                <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {
                    movie.ytsData.cast ? (
                      <div className="cast row" style={{marginBottom: 20}}>
                      {
                        movie.ytsData.cast.map((person, index) => (
                            <a className="pointer" href={`https://www.imdb.com/name/nm${person.imdb_code}`} target="_blank" key={`${person.name}-${index}`}>
                              <img style={{ width: 75, height: 75, objectFit: 'cover', borderRadius: '50%', marginRight: -20 }} src={person.url_small_image ? person.url_small_image : `http://${config.hostname}:${config.port}/public/avatars/default_avatar.png`} alt={person.name} />
                            </a>
                          ))
                      }
                      </div>
                    ) : null
                  }
                  <div>
                    <Rating
                      onChange={(value) => updatingRating(value)}
                      initialRating={rating}
                      emptySymbol={<StarEmpty width="30" height="30" fill="#FFD700" />}
                      fullSymbol={<StarFull width="30" height="30" fill="#FFD700" />}
                      fractions={2}
                    />
                    <br />
                    <span>{translations[language].movie.rating} - {ratingAverage} ({ratingCount})</span>
                  </div>
                </div>
              </div>
              <Button content={translations[language].movie.watch} />
              <div>
                <h2>{translations[language].movie.comments}</h2>
                <div className="hr"></div>
                <div className="comments col">
                {
                  movie.comments.length > 0 ? (
                    movie.comments.map((comment, index) => (
                        <div className="comment" key={`comment-${index}`}>
                          <div onClick={() => reportComment(comment._id)} className="report-flag"><ReportFlag width="20" height="20" /></div>
                          <div className="comment-name">{comment.author}<span style={{marginLeft: 10}}><VerifiedIcon width="15" height="15" /></span></div>
                          {comment.content}
                        </div>
                      ))
                  ) : (
                    <div className="no-comments center" style={{marginTop: 50, marginBottom: 50}}>{translations[language].movie.noComments}</div>
                  )
                }
                </div>
                <input className="dark-input comment-input" placeholder={translations[language].movie.reviewPlaceholder} style={{width: '100%', marginBottom: 20}} onChange={e => updateComment(e.target.value)} />
                <Button content={translations[language].movie.reviewSubmit} style={{float: 'right'}} action={() => addComment()} />
              </div>
            </div>

            {/* Player */}
            <div className="player-container" style={{display: (togglePlayer) ? "block" : 'none', position: 'absolute', top: 100, width: '100%', backgroundColor: "black", height: '93vh'}}>
              <div style={{position: 'relative', width: '100%', height: '100%'}}>
                <span className="close-icon" onClick={() => hidePlayer()} style={{position: 'absolute', top: 25, right: 25}}><Close width="15" height="15" fill="#fff" /></span>
                <video ref={ player } className="video-player" width='100%' controls controlsList="nodownload">
                  {
                    moviePath ? (
                      <source
                        src={moviePath}
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

export default withRouter(Movie)
