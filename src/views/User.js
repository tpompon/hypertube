import React, { useState, useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import config from "config";
import translations from "translations";
import PostersSlider from "components/PostersSlider";
import MoviesSlider from "components/MoviesSlider";
import Loading from "components/Loading";
import { ReactComponent as VerifiedIcon } from "svg/verified.svg";
import { UserConsumer } from "store";

const User = props => {
  const [user, updateUser] = useState(null);
  const [_isLoaded, updateIsLoaded] = useState(false);
  const [heartbeat, updateHeartbeat] = useState([]);
  const [recents, updateRecents] = useState([]);
  const context = useContext(UserConsumer);
  const { language } = context;
  const { match } = props;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get(
      `http://${config.hostname}:${config.port}/user/username/${match.params.username}`
    );
    if (res.data.success) {
      updateUser(res.data.user[0]);
      const getMovies = await getMoviesList(res.data.user[0].heartbeat);
      updateHeartbeat(getMovies);
      updateIsLoaded(true);
    }
  };

  const getMoviesList = moviesListIds => {
    return Promise.all(
      moviesListIds.map(async movie => {
        const res = await axios.get(`${config.serverURL}/movies/${movie.id}`);
        if (res.data.success && res.data.movie) {
          return res.data.movie[0];
        }
      })
    );
  };

  const copyProfileURL = () => {
    const profileURL = document.createElement("textarea");
    const tooltipText = document.getElementsByClassName("tooltip-text")[0];
    tooltipText.innerHTML = translations[language].user.tooltip.copied;
    profileURL.value = `${window.location.origin}/user/${user.username}`;
    profileURL.setAttribute("readonly", "");
    profileURL.style = {
      display: "none",
      position: "absolute",
      left: "-9999px"
    };
    document.body.appendChild(profileURL);
    profileURL.select();
    document.execCommand("copy");
    document.body.removeChild(profileURL);
  };

  const resetTooltip = () => {
    const tooltipText = document.getElementsByClassName("tooltip-text")[0];
    tooltipText.innerHTML = translations[language].user.tooltip.copy;
  };

  return (
    <div>
      {_isLoaded ? (
        <div className="text-center">
          {user ? (
            <div>
              <div
                style={{
                  backgroundImage: `url('/covers/${user.cover}.svg')`,
                  paddingTop: 40,
                  paddingBottom: 50,
                  marginTop: -20
                }}
              >
                <div className="profile-avatar center">
                  <img src={user.avatar} alt={`Avatar ${user.username}`} />
                </div>
                <div style={{ marginTop: 20 }}>
                  <div>
                    {user.firstname} {user.lastname}
                  </div>
                  <div className="tooltip">
                    <div
                      className="username"
                      onClick={() => copyProfileURL()}
                      onMouseLeave={() => resetTooltip()}
                    >
                      @{user.username}{" "}
                      {user.verified ? (
                        <div className="verified" style={{ marginBottom: 2 }}>
                          <VerifiedIcon width="15" height="15" />
                        </div>
                      ) : null}
                    </div>
                    <span className="tooltip-text">
                      {translations[language].user.tooltip.copy}
                    </span>
                  </div>
                </div>
              </div>
              <h2>{translations[language].user.list.heartbeat}</h2>
              <PostersSlider
                number={1}
                movies={heartbeat}
                language={language}
              />
              <h2>{translations[language].user.list.recents}</h2>
              <MoviesSlider number={2} movies={recents} language={language} />
            </div>
          ) : (
            <h2>{translations[language].user.notFound}</h2>
          )}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default withRouter(User);
