// Core
import React, { useState, useEffect, useRef, useContext } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import config from "config";
import translations from "translations";
import { UserConsumer } from "store";
import API from "controllers";

// Components
import Button from "components/Button";
import Loading from "components/Loading";
import Rating from "react-rating";

// SVGs
import { ReactComponent as StarFull } from "svg/star-full.svg";
import { ReactComponent as StarEmpty } from "svg/star-empty.svg";
import { ReactComponent as ReportFlag } from "svg/report-flag.svg";
import { ReactComponent as Close } from "svg/close.svg";
import { ReactComponent as AddFav } from "svg/add_heart.svg";
import { ReactComponent as RemoveFav } from "svg/remove_heart.svg";

const Movie = props => {
  const { match } = props;
  const context = useContext(UserConsumer);
  const { language } = context;
  const { id } = match.params;
  const [movie, updateMovie] = useState({});
  const [user, updateUser] = useState({});
  const [comment, updateComment] = useState("");
  const [commentsLimit, setCommentsLimit] = useState(5);
  const [heartbeat, updateHeartbeat] = useState(false);
  const [rating, updateRating] = useState(0);
  const [ratingAverage, updateRatingAverage] = useState(0);
  const [ratingCount, updateRatingCount] = useState(0);
  const [loaded, updateLoaded] = useState(false);
  const [togglePlayer, updateTogglePlayer] = useState(false);
  const [subtitles, updateSubtitles] = useState({})
  const player = useRef(null);

  useEffect(() => {
    return () => {
      document.removeEventListener("scroll", handleScroll, false);
      document.removeEventListener("keydown", onEscape, false);

      const videoPlayer = document.getElementsByClassName('video-player')[0];
      if (videoPlayer && videoPlayer.currentTime > 5) {
        const watchPercent = (videoPlayer.currentTime / videoPlayer.duration * 100).toFixed(0);
        if (watchPercent >= 95) {
          API.movies.recentsById.post(id, null)
          API.movies.inprogressById.delete(id, null)
        } else {
          API.movies.byId.get(id).then(res => {
            API.movies.inprogressById.post(id, { ytsId: res.data.movie[0]._ytsId, percent: watchPercent, timecode: videoPlayer.currentTime.toString() })
          })
        }
      }
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMovie();
    // eslint-disable-next-line
  }, [id]);

  const fetchMovie = async () => {
    const resp = await API.movies.byId.get(id);
    if (resp) {
      if (resp.data.movie[0]) {
        updateMovie(resp.data.movie[0]);

        updateLoaded(true);

        document.addEventListener("scroll", handleScroll, false);
        document.addEventListener("keydown", onEscape, false);

        const res = await API.movies.inprogressById.get(id);
        if (res.data.success && res.data.found > 0) {
          const videoPlayer = document.getElementsByClassName('video-player')[0]
          videoPlayer.currentTime = res.data.list.inProgress[0].timecode;
        }

        const resSubtitles = await axios.get(`${config.serverURL}/torrents/subtitles/${resp.data.movie[0].ytsData.imdb_code}`)
        if (resSubtitles && resSubtitles.data.subtitles) {
          updateSubtitles(resSubtitles.data.subtitles)
        }
      }
    }
    const responseUser = await API.auth.check();
    if (responseUser) {
      updateUser(responseUser.data.user);

      const responseHeartbeat = await API.movies.heartbeatById.get(id)
      if (responseHeartbeat.data.success && responseHeartbeat.data.found > 0)
        updateHeartbeat(true);

      const responseRating = await API.movies.ratingsByIdAndUID.get(id);
      if (responseRating.data.rating)
        updateRating(responseRating.data.rating);

      const responseRatingCount = await API.movies.ratingsById.get(id);
      if (responseRatingCount.data.success) {
        updateRatingAverage(responseRatingCount.data.ratingAverage);
        updateRatingCount(responseRatingCount.data.ratingCount);
      }
    }
  };

  const handleScroll = () => {
    const moviePoster = document.getElementById("movie-page-poster-fullsize");
    const movieInfos = document.getElementById("movie-infos-fullsize");
    const top = window.pageYOffset;

    const maxBottom = movieInfos.offsetHeight + movieInfos.offsetTop;
    const posterHeight = moviePoster.offsetHeight + movieInfos.offsetTop;

    if (moviePoster && movieInfos && top + posterHeight <= maxBottom)
      moviePoster.style.marginTop = `${top}px`;
  };

  const onEnter = e => {
    if (e.keyCode === 13) addComment();
  };

  const onEscape = e => {
    if (e.keyCode === 27) hidePlayer();
  };

  const addComment = async () => {
    const newComment = {
      author: user.username,
      content: comment
    };

    if (newComment.content.trim() !== "") {
      const response = await API.movies.commentsById.post(id, newComment);
      if (response) {
        console.log(response.data);
      }
      updateMovie({ ...movie, comments: [...movie.comments, newComment] });
    }
    updateComment("");
  };

  const updatingRating = async value => {
    const newRating = {
      rating: value
    };
    const response = await API.movies.ratingsById.post(id, newRating);
    if (response) {
      updateRating(value);
      const responseRating = await API.movies.ratingsById.get(id);
      if (responseRating.data.success) {
        updateRatingAverage(responseRating.data.ratingAverage);
        updateRatingCount(responseRating.data.ratingCount);
      }
    }
  };

  const showPlayer = () => {
    if (player) {
      updateTogglePlayer(true);
      player.current.play();
    }
  };

  const hidePlayer = () => {
    if (player) {
      updateTogglePlayer(false);
      player.current.pause();
    }
  };

  const toggleHeartbeat = async () => {
    if (!heartbeat) API.movies.heartbeatById.post(id);
    else API.movies.heartbeatById.delete(id);
  
    updateHeartbeat(!heartbeat);
  };

  const reportComment = async id => {
    // const response = await API.movies.reportCommentById(movie._id, {
    //   commId: id
    // });
  };

  return (
    <div>
      {movie && loaded ? (
        <div>
          <div className="movie-page">
            <div className="row wrap">
              <img
                id="movie-page-poster-fullsize"
                className="movie-page-poster center"
                src={movie.poster}
                alt="Movie poster"
              />
              <div
                id="movie-infos-fullsize"
                className="col center"
                style={{
                  width: "45%",
                  padding: 50,
                  backgroundColor: "#16162e",
                  wordBreak: "break-word",
                  borderRadius: 20
                }}
              >
                <div className="movie-infos" style={{ marginBottom: 20 }}>
                  <div
                    className="row"
                    style={{ alignItems: "center", flexWrap: "wrap" }}
                  >
                    <h1>{movie.name}</h1>
                    <span style={{ marginTop: 10, marginLeft: 10 }}>
                      ({movie.ytsData.year})
                    </span>
                    <div
                      className="tooltip toggle-heartbeat"
                      onClick={() => toggleHeartbeat()}
                    >
                      {heartbeat ? (
                        <RemoveFav width="25" height="25" fill="crimson" />
                      ) : (
                        <AddFav width="25" height="25" fill="crimson" />
                      )}
                      <span className="tooltip-text">
                        {heartbeat
                          ? translations[language].movie.tooltip.heartbeatRemove
                          : translations[language].movie.tooltip.heartbeatAdd}
                      </span>
                    </div>
                  </div>
                  <div className="hr"></div>
                  <div className="container-ytb" style={{ marginBottom: 20 }}>
                    <iframe
                      title="trailer-high-size"
                      src={`//www.youtube.com/embed/${movie.ytsData.yt_trailer_code}?autoplay=1`}
                      allow="autoplay"
                      frameBorder="0"
                      allowFullScreen
                      className="video-ytb"
                    ></iframe>
                  </div>
                  {movie.ytsData.genres ? (
                    <div
                      className="genres row wrap"
                      style={{ marginBottom: 20 }}
                    >
                      {movie.ytsData.genres.map((genre, index) => (
                        <div key={index} className="genre">
                          {genre}
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <p>{movie.description}</p>
                  <div
                    className="wrap"
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {movie.ytsData.cast ? (
                      <div className="cast row" style={{ marginBottom: 20 }}>
                        {movie.ytsData.cast.map((person, index) => (
                          <a
                            className="pointer"
                            href={`https://www.imdb.com/name/nm${person.imdb_code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={`${person.name}-${index}`}
                          >
                            <img
                              style={{
                                width: 75,
                                height: 75,
                                objectFit: "cover",
                                borderRadius: "50%",
                                marginRight: -20
                              }}
                              src={
                                person.url_small_image
                                  ? person.url_small_image
                                  : `http://${config.hostname}:${config.port}/public/avatars/default_avatar.png`
                              }
                              alt={person.name}
                            />
                          </a>
                        ))}
                      </div>
                    ) : null}
                    <div>
                      <Rating
                        onChange={value => updatingRating(value)}
                        initialRating={rating}
                        emptySymbol={
                          <StarEmpty width="30" height="30" fill="#FFD700" />
                        }
                        fullSymbol={
                          <StarFull width="30" height="30" fill="#FFD700" />
                        }
                        fractions={2}
                      />
                      <br />
                      <span>
                        {translations[language].movie.rating} - {ratingAverage}{" "}
                        ({ratingCount})
                      </span>
                    </div>
                  </div>
                </div>
                <Button action={() => showPlayer()} content={translations[language].movie.watch} />
                <div>
                  <h2>{translations[language].movie.comments}</h2>
                  <div className="hr"></div>
                  <div className="comments col">
                    {movie.comments.length > 0 ? (
                      <div>
                        {
                          movie.comments.reverse().map((comment, index) => {
                            if (index < commentsLimit) {
                              return (
                                <div className="comment" key={`comment-${index}`}>
                                  <div
                                    onClick={() => reportComment(`${comment._id}`)}
                                    className="report-flag"
                                  >
                                    <ReportFlag width="20" height="20" />
                                  </div>
                                  <div className="comment-name">
                                    <a target="_blank" rel="noopener noreferrer" href={`http://localhost:3000/user/${comment.author}`}>@{comment.author}</a>
                                  </div>
                                  {comment.content}
                                </div>
                              );
                            }
                            return null;
                          })
                        }
                        {
                          movie.comments.length > 5 && movie.comments.length > commentsLimit ? (
                            <span className="more-comments" onClick={() => setCommentsLimit(old => old + 10)}>
                              More
                            </span>
                          ) : null
                        }
                      </div>
                    ) : (
                      <div
                        className="no-comments center"
                        style={{ marginTop: 50, marginBottom: 50 }}
                      >
                        {translations[language].movie.noComments}
                      </div>
                    )}
                  </div>
                  <input
                    className="dark-input comment-input"
                    onKeyDown={onEnter}
                    placeholder={translations[language].movie.reviewPlaceholder}
                    style={{ width: "100%", marginBottom: 20 }}
                    value={comment}
                    onChange={e => updateComment(e.target.value)}
                  />
                  <Button
                    content={translations[language].movie.reviewSubmit}
                    style={{ float: "right" }}
                    action={() => addComment()}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="movie-page-lowres">
            <div className="movie-infos" style={{ marginBottom: 20 }}>
              <img
                className="movie-page-poster-lowres"
                src={movie.poster}
                style={{ width: "100%" }}
                alt="poster"
              />
              <div className="row" style={{ alignItems: "center" }}>
                <h1>{movie.name}</h1>
                <span style={{ marginTop: 10, marginLeft: 10 }}>
                  ({movie.ytsData.year})
                </span>
                <div
                  className="toggle-heartbeat"
                  onClick={() => toggleHeartbeat()}
                >
                  {heartbeat ? (
                    <RemoveFav width="25" height="25" fill="crimson" />
                  ) : (
                    <AddFav width="25" height="25" fill="crimson" />
                  )}
                </div>
              </div>
              <div className="hr"></div>
              <div className="container-ytb" style={{ marginBottom: 20 }}>
                <iframe
                  title="trailer-low-size"
                  src={`//www.youtube.com/embed/${movie.ytsData.yt_trailer_code}?autoplay=1`}
                  allow="autoplay"
                  frameBorder="0"
                  allowFullScreen
                  className="video-ytb"
                ></iframe>
              </div>
              {movie.ytsData.genres ? (
                <div className="genres row wrap" style={{ marginBottom: 20 }}>
                  {movie.ytsData.genres.map((genre, index) => (
                    <div key={index} className="genre">
                      {genre}
                    </div>
                  ))}
                </div>
              ) : null}
              <p>{movie.description}</p>
              <div
                className="wrap"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                {movie.ytsData.cast ? (
                  <div className="cast row" style={{ marginBottom: 20 }}>
                    {movie.ytsData.cast.map((person, index) => (
                      <a
                        className="pointer"
                        href={`https://www.imdb.com/name/nm${person.imdb_code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={`${person.name}-${index}`}
                      >
                        <img
                          style={{
                            width: 75,
                            height: 75,
                            objectFit: "cover",
                            borderRadius: "50%",
                            marginRight: -20
                          }}
                          src={
                            person.url_small_image
                              ? person.url_small_image
                              : `http://${config.hostname}:${config.port}/public/avatars/default_avatar.png`
                          }
                          alt={person.name}
                        />
                      </a>
                    ))}
                  </div>
                ) : null}
                <div>
                  <Rating
                    onChange={value => updatingRating(value)}
                    initialRating={rating}
                    emptySymbol={
                      <StarEmpty width="30" height="30" fill="#FFD700" />
                    }
                    fullSymbol={
                      <StarFull width="30" height="30" fill="#FFD700" />
                    }
                    fractions={2}
                  />
                  <br />
                  <span>
                    {translations[language].movie.rating} - {ratingAverage} (
                    {ratingCount})
                  </span>
                </div>
              </div>
            </div>
            <Button action={() => showPlayer()} content={translations[language].movie.watch} />
            <div>
              <h2>{translations[language].movie.comments}</h2>
              <div className="hr"></div>
              <div className="comments col">
                {movie.comments.length > 0 ? (
                  <div>
                    {
                      movie.comments.reverse().map((comment, index) => {
                        if (index < commentsLimit) {
                          return (
                            <div className="comment" key={`comment-${index}`}>
                              <div
                                onClick={() => reportComment(`${comment._id}`)}
                                className="report-flag"
                              >
                                <ReportFlag width="20" height="20" />
                              </div>
                              <div className="comment-name">
                                {comment.author}
                              </div>
                              {comment.content}
                            </div>
                          );
                        }
                        return null;
                      })
                    }
                    {
                      movie.comments.length > 5 && movie.comments.length > commentsLimit ? (
                        <span className="more-comments" onClick={() => setCommentsLimit(old => old + 10)}>
                          More
                        </span>
                      ) : null
                    }
                  </div>
                ) : (
                  <div
                    className="no-comments center"
                    style={{ marginTop: 50, marginBottom: 50 }}
                  >
                    {translations[language].movie.noComments}
                  </div>
                )}
              </div>
              <input
                className="dark-input comment-input"
                placeholder={translations[language].movie.reviewPlaceholder}
                style={{ width: "100%", marginBottom: 20 }}
                onChange={e => updateComment(e.target.value)}
              />
              <Button
                content={translations[language].movie.reviewSubmit}
                style={{ float: "right" }}
                action={() => addComment()}
              />
            </div>
          </div>

          {/* Player */}
          <div
            className="player-container"
            style={{
              display: togglePlayer ? "block" : "none",
              position: "absolute",
              top: 100,
              width: "100%",
              backgroundColor: "black",
              height: "93vh"
            }}
          >
            <div
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              <span
                className="close-icon"
                onClick={() => hidePlayer()}
                style={{ position: "absolute", top: 25, right: 25 }}
              >
                <Close width="15" height="15" fill="#fff" />
              </span>
              <video
                ref={player}
                className="video-player"
                width="100%"
                controls
                preload="metadata"
                controlsList="nodownload"
              >
                {/* <source src={ `http://${config.hostname}:${config.port}/torrents/stream/${encodeURIComponent(movie.ytsData.torrents[0].magnet)}` } /> */}
                <source src="https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_1280_10MG.mp4" />
                {
                  Object.entries(subtitles).map(entry => (
                    <track
                      label={translations[language].movie.subtitles[entry[0]]}
                      key={ `language-${entry[0]}` }
                      kind="subtitles"
                      srcLang={entry[0]}
                      src={ `data:text/vtt;base64, ${entry[1]}` }
                      default={ entry[0] === language ? true : false }
                    />
                  ))
                }
              </video>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {!movie ? (
            <div style={{ color: "white", textAlign: "center" }}>
              {translations[language].movie.noResults}
            </div>
          ) : (
            <Loading />
          )}
        </div>
      )}
    </div>
  );
};

export default withRouter(Movie);
