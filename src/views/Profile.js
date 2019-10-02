import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import config from 'config'
import MoviesSlider from 'components/MoviesSlider'
import MoviesSlider2 from 'components/MoviesSlider2'
import translations from 'translations'
import Loading from 'components/Loading'
import { ReactComponent as VerifiedIcon } from 'svg/verified.svg'
import { ReactComponent as PencilIcon } from 'svg/pencil.svg'
import { ReactComponent as CinemaIcon } from 'svg/cinema-icon.svg'
import { ReactComponent as JapanIcon } from 'svg/japan-icon.svg'
import { ReactComponent as AnimalsIcon } from 'svg/animals-icon.svg'
import { ReactComponent as FruitsIcon } from 'svg/fruits-icon.svg'

const heartbeat = [
  { id: 1, name_fr: "L'Arnacoeur", name_en: "L'Arnacoeur", poster: "/posters/arnacoeur.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 2, name_fr: "Hunger Games", name_en: "Hunger Games", poster: "/posters/hunger_games.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 3, name_fr: "Le Monde de Narnia", name_en: "Narnia's World", poster: "/posters/narnia.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 4, name_fr: "Pirates des Caraïbes", name_en: "Pirates of Caraïbes", poster: "/posters/pirates_des_caraibes.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 7, name_fr: "Star Wars: Les Derniers Jedi", name_en: "Star Wars: The Last Jedi", poster: "/posters/star_wars2.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.2 },
  { id: 8, name_fr: "Titanic", name_en: "Titanic", poster: "/posters/titanic.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 9, name_fr: "Spiderman: Homecoming", name_en: "Spiderman: Homecoming", poster: "/posters/spiderman.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 10, name_fr: "Dunkerque", name_en: "Dunkerque", poster: "/posters/dunkerque.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 }
]

const recents = [
  { id: 1, name_fr: "L'Arnacoeur", name_en: "L'Arnacoeur", poster: "/posters/arnacoeur.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 2, name_fr: "Hunger Games", name_en: "Hunger Games", poster: "/posters/hunger_games.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 3, name_fr: "Le Monde de Narnia", name_en: "Narnia's World", poster: "/posters/narnia.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 4, name_fr: "Pirates des Caraïbes", name_en: "Pirates of Caraïbes", poster: "/posters/pirates_des_caraibes.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
]

const inProgress = [
  { id: 1, name_fr: "L'Arnacoeur", name_en: "L'Arnacoeur", poster: "/posters/arnacoeur.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 2, name_fr: "Hunger Games", name_en: "Hunger Games", poster: "/posters/hunger_games.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 3, name_fr: "Le Monde de Narnia", name_en: "Narnia's World", poster: "/posters/narnia.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 4, name_fr: "Pirates des Caraïbes", name_en: "Pirates of Caraïbes", poster: "/posters/pirates_des_caraibes.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
]

const Profile = (props) => {

  const [cover, updateCover] = useState("url('/covers/cinema.svg')")
  const [user, updateUser] = useState({})
  const [heartbeat, updateHeartbeat] = useState([])
  const [recents, updateRecents] = useState([])
  const [inProgress, updateInProgress] = useState([])
  const [_isLoaded, updateIsLoaded] = useState(false)
  const [toggleCoverMenu, updateToggleCoverMenu] = useState(false)
  const uploadAvatar = useRef(null)
  const { language } = props;

  useEffect(() => {
    axios.get(`${config.serverURL}/auth`)
      .then(res => {
        axios.get(`${config.serverURL}/user/${res.data.user._id}`)
          .then(res => {
            if (res.data.success) {
              updateUser(res.data.user[0])
              updateHeartbeat(getMoviesList(res.data.user[0].heartbeat))
              updateCover(res.data.user[0].cover)
              updateIsLoaded(true)
              updateCoverBackground(cover)
            }
          });
        // const coversMenu = document.getElementsByClassName('covers-menu')[0];
        // document.onclick = (e) => {
        //   if (e.target.classList[0] !== 'covers-menu' && e.target.classList[0] !== 'covers-menu-child' && e.target.classList[0] !== 'cover-icon') {
        //     if (e.target.classList[0] !== 'edit-cover-box' && e.target.classList[0] !== 'pencil-icon') {
        //       coversMenu.style.display = 'none';
        //     }
        //   }
        // }
      })
  }, [])
  
  const getMoviesList = (moviesListIds) => {
    let array = [];
    moviesListIds.map((movie) => {
      axios.get(`${config.serverURL}/movies/${movie.id}`)
        .then(res => {
          if (res.data.success && res.data.movie) {
            array.push(res.data.movie[0]);
          }
        })
    });
    return array;
  }

  const copyProfileURL = () => {
    const profileURL = document.createElement('textarea');
    const tooltipText = document.getElementsByClassName("tooltip-text")[0];
    tooltipText.innerHTML = language === 'FR' ? "Copié" : "Copied to clipboard";
    profileURL.value = `${window.location.origin}/user/${user.username}`;
    profileURL.setAttribute('readonly', '');
    profileURL.style = {display: 'none', position: 'absolute', left: '-9999px'};
    document.body.appendChild(profileURL);
    profileURL.select();
    document.execCommand('copy');
    document.body.removeChild(profileURL);
  }

  const resetTooltip = () => {
    const tooltipText = document.getElementsByClassName("tooltip-text")[0];
    tooltipText.innerHTML = translations[language].profile.tooltip.copy;
  }

  const updateCoverBackground = (cover) => {
    const coversMenu = document.getElementsByClassName('covers-menu-child');
    const coverSelected = document.getElementsByClassName('cover-selected')[0];
    coverSelected.classList.remove('cover-selected');

    let body = {};
    if (cover === 'cinema' || cover === "url('/covers/cinema.svg')") {
      updateCover("url('/covers/cinema.svg')")
      coversMenu[0].classList.add('cover-selected');
      body.cover = "url('/covers/cinema.svg')";
    } else if (cover === 'japan' || cover === "url('/covers/japan.svg')") {
      updateCover("url('/covers/japan.svg')")
      coversMenu[1].classList.add('cover-selected');
      body.cover = "url('/covers/japan.svg')";
    } else if (cover === 'animals' || cover === "url('/covers/animals.svg')") {
      updateCover("url('/covers/animals.svg')")
      coversMenu[2].classList.add('cover-selected');
      body.cover = "url('/covers/animals.svg')";
    } else if (cover === 'fruits' || cover === "url('/covers/fruits.svg')") {
      updateCover("url('/covers/fruits.svg')")
      coversMenu[3].classList.add('cover-selected');
      body.cover = "url('/covers/fruits.svg')";
    }

    axios.put(`http://${config.hostname}:${config.port}/user/${user._id}`, body);
  }

  const onChangeAvatar = (event) => {
    if (event.target.files[0]) {
      event.preventDefault();
      const data = new FormData();
      data.append('file', event.target.files[0]);
      data.append('filename', event.target.files[0].name);
      axios.post(`${config.serverURL}/user/${user._id}/avatar`, data)
        .then((res) => {
          if (res.data.success) {
            updateUser({ ...user, avatar: `http://${config.hostname}:${config.port}/${res.data.file}` })
          }
        });
    }
  }

  return (
    <div>
      {
        _isLoaded ? (
          <div className="text-center">
            <div className="cover" style={{backgroundImage: `${cover}`, paddingTop: 40, paddingBottom: 50, marginTop: -20}}>
              <div className="profile-avatar center">
                <a className="profile-avatar-overlay" onClick={() => uploadAvatar.current.click()}>{translations[language].profile.updateAvatar}</a>
                <input type="file" id="file" ref={ uploadAvatar } onChange={ (event) => onChangeAvatar(event) } style={{display: "none"}}/>
                <img src={user.avatar} alt={`Avatar ${user.username}`} />
              </div>
              <div style={{marginTop: 20}}>
                <div>{user.firstname} {user.lastname} <span style={{fontStyle: 'italic', fontSize: '.8em'}}>{translations[language].profile.you}</span></div>
                <div className="tooltip">
                  <div className="username" onClick={() => copyProfileURL()} onMouseLeave={() => resetTooltip()}>@{user.username} {user.verified ? <div className="verified" style={{marginBottom: 2}}><VerifiedIcon width="15" height="15" /></div> : null}</div>
                  <span className="tooltip-text">{translations[language].profile.tooltip.copy}</span>
                </div>
              </div>
              <div className="edit-cover-box tooltip-left" onClick={() => updateToggleCoverMenu(!toggleCoverMenu)}>
                <PencilIcon className="pencil-icon" fill="#fff" width="15" height="15" style={{marginTop: 10 }} />
                <span className="tooltip-text-left">{translations[language].profile.editCover}</span>
                <div className="covers-menu" style={{ position: 'absolute', display: (toggleCoverMenu) ? "block" : 'none', backgroundColor: '#04050C', borderRadius: 10, width: 100, marginBottom: 10, bottom: 50, right: 0, zIndex: 9 }}>
                  <div className="covers-menu-child cover-selected" onClick={() => updateCoverBackground('cinema')}><CinemaIcon width="25" height="25" /></div>
                  <div className="covers-menu-child" onClick={() => updateCoverBackground('japan')}><JapanIcon width="25" height="25" /></div>
                  <div className="covers-menu-child" onClick={() => updateCoverBackground('animals')}><AnimalsIcon width="25" height="25" /></div>
                  <div className="covers-menu-child" onClick={() => updateCoverBackground('fruits')}><FruitsIcon width="25" height="25" /></div>
                </div>
              </div>
            </div>
            <h2>{translations[language].profile.list.heartbeat}</h2>
            <MoviesSlider2 number={1} movies={heartbeat} language={language} />
            <h2>{translations[language].profile.list.recents}</h2>
            <MoviesSlider number={2} movies={recents} language={language} />
            <h2>{translations[language].profile.list.continue}</h2>
            <MoviesSlider number={3} movies={inProgress} language={language} />
          </div>
        ) : <Loading />
      }
    </div>
  );

}

export default Profile;
