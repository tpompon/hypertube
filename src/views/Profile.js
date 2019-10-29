import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import config from "config";
import PostersSlider from "components/PostersSlider";
import translations from "translations";
import Loading from "components/Loading";
import { ReactComponent as VerifiedIcon } from "svg/verified.svg";
import { ReactComponent as PencilIcon } from "svg/pencil.svg";
import { ReactComponent as CinemaIcon } from "svg/cinema-icon.svg";
import { ReactComponent as JapanIcon } from "svg/japan-icon.svg";
import { ReactComponent as AnimalsIcon } from "svg/animals-icon.svg";
import { ReactComponent as FruitsIcon } from "svg/fruits-icon.svg";
import { UserConsumer } from "store";
import API from "controllers";
import { verifyAvatarExt, verifyAvatarSize } from "utils/functions"

const covers = ["cinema", "japan", "animals", "fruits"];

const Profile = () => {
  const [cover, updateCover] = useState("cinema");
  const [user, updateUser] = useState({});
  const [heartbeat, updateHeartbeat] = useState([]);
  const [recents, updateRecents] = useState([]);
  const [inProgress, updateInProgress] = useState([]);
  const [_isLoaded, updateIsLoaded] = useState(false);
  const [toggleCoverMenu, updateToggleCoverMenu] = useState(false);
  const refMenu = useRef(null);
  const uploadAvatar = useRef(null);
  const context = useContext(UserConsumer);
  const { language, avatar, updateAvatar } = context;

  const isCancelled = useRef(false)

  useEffect(() => {
    fetchData();
    window.addEventListener("mousedown", closeCoverMenu);
    return () => {
      isCancelled.current = true
      window.removeEventListener("mousedown", closeCoverMenu);
    };
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    const check = await axios.get(`${config.serverURL}/auth`);
    if (!isCancelled.current && check.data.auth) {
      const res = await API.users.byId.get();
      if (!isCancelled.current && res.data.success) {
        updateUser(res.data.user[0]);
        const getHeartbeatList = await getMoviesList(res.data.user[0].heartbeat);
        updateHeartbeat(getHeartbeatList);
        const getRecentsList = await getMoviesList(res.data.user[0].recents);
        updateRecents(getRecentsList);
        const getInProgressList = await getMoviesList(res.data.user[0].inProgress);
        updateInProgress(getInProgressList);
        updateCoverBackground(res.data.user[0].cover);
        updateIsLoaded(true);
      }
    }
  };

  const closeCoverMenu = event => {
    if (refMenu && event && refMenu.current && refMenu.current.contains(event.target)) return;
    updateToggleCoverMenu(false);
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
    tooltipText.innerHTML = language === "FR" ? "Copié" : "Copied to clipboard";
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
    tooltipText.innerHTML = translations[language].profile.tooltip.copy;
  };

  const updateCoverBackground = cover => {
    let body = {};
    if (covers.includes(cover)) {
      updateCover(cover);
      body.cover = cover;
    }
    API.users.byId.put(user._id, body);
  };

  const onChangeAvatar = async event => {
    if (event.target.files[0]) {
      if (verifyAvatarExt(event.target.files[0])) {
        if (verifyAvatarSize(event.target.files[0])) {
          event.preventDefault();
          const data = new FormData();
          data.append("file", event.target.files[0]);
          data.append("filename", event.target.files[0].name);
          const response = await API.users.avatarById.post(data);
          if (response.data.success) {
            updateAvatar(
              `http://${config.hostname}:${config.port}/${response.data.file}`
            );
            updateUser({
              ...user,
              avatar: `http://${config.hostname}:${config.port}/${response.data.file}`
            });
          }
        } else alert("Avatar size exceeds limit")
      } else alert("Invalid avatar type")
    }
  };

  return (
    <div>
      {_isLoaded ? (
        <div className="text-center">
          <div
            className="cover"
            style={{
              backgroundImage: `url('/covers/${cover}.svg')`,
              paddingTop: 40,
              paddingBottom: 50,
              marginTop: -20
            }}
          >
            <div className="profile-avatar center">
              <div
                className="profile-avatar-overlay"
                onClick={() => uploadAvatar.current.click()}
              >
                {translations[language].profile.updateAvatar}
              </div>
              <input
                type="file"
                id="file"
                ref={uploadAvatar}
                onChange={event => onChangeAvatar(event)}
                style={{ display: "none" }}
              />
              <img src={avatar} alt={`Avatar ${user.username}`} />
            </div>
            <div style={{ marginTop: 20 }}>
              <div>
                {user.firstname} {user.lastname}{" "}
                <span style={{ fontStyle: "italic", fontSize: ".8em" }}>
                  {translations[language].profile.you}
                </span>
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
                  {translations[language].profile.tooltip.copy}
                </span>
              </div>
            </div>
            <div
              ref={refMenu}
              className="edit-cover-box tooltip-left"
              onClick={() => updateToggleCoverMenu(!toggleCoverMenu)}
            >
              <PencilIcon
                className="pencil-icon"
                fill="#fff"
                width="15"
                height="15"
                style={{ marginTop: 10 }}
              />
              <span className="tooltip-text-left">
                {translations[language].profile.editCover}
              </span>
              <div
                className="covers-menu"
                style={{
                  position: "absolute",
                  display: toggleCoverMenu ? "block" : "none",
                  backgroundColor: "#04050C",
                  borderRadius: 10,
                  width: 100,
                  marginBottom: 10,
                  bottom: 50,
                  right: 0,
                  zIndex: 9
                }}
              >
                <div
                  className={`covers-menu-child ${
                    cover === "cinema" ? "cover-selected" : null
                  }`}
                  onClick={() => updateCoverBackground("cinema")}
                >
                  <CinemaIcon width="25" height="25" />
                </div>
                <div
                  className={`covers-menu-child ${
                    cover === "japan" ? "cover-selected" : null
                  }`}
                  onClick={() => updateCoverBackground("japan")}
                >
                  <JapanIcon width="25" height="25" />
                </div>
                <div
                  className={`covers-menu-child ${
                    cover === "animals" ? "cover-selected" : null
                  }`}
                  onClick={() => updateCoverBackground("animals")}
                >
                  <AnimalsIcon width="25" height="25" />
                </div>
                <div
                  className={`covers-menu-child ${
                    cover === "fruits" ? "cover-selected" : null
                  }`}
                  onClick={() => updateCoverBackground("fruits")}
                >
                  <FruitsIcon width="25" height="25" />
                </div>
              </div>
            </div>
          </div>
          <h2>{translations[language].profile.list.continue}</h2>
          <PostersSlider number={1} movies={inProgress} language={language} />
          <h2>{translations[language].profile.list.heartbeat}</h2>
          <PostersSlider number={2} movies={heartbeat} language={language} />
          <h2>{translations[language].profile.list.recents}</h2>
          <PostersSlider number={3} movies={recents} language={language} />
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Profile;
