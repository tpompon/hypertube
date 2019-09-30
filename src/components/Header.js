import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import config from '../config'
import translations from '../translations'
import { ReactComponent as SearchIcon } from '../svg/search.svg'
import { Link } from "react-router-dom";
import { UserConsumer } from "../store"

axios.defaults.withCredentials = true;

const Header = (props) => {

  const [searchMovie, updateSearchMovie] = useState("")
  const [movies, updateMovies] = useState([])
  const [user, updateUser] = useState({})
  const [_isAuth, updateIsAuth] = useState(false)
  const context = useContext(UserConsumer)

  useEffect(() => {
    axios.get(`http://${config.hostname}:${config.port}/auth`)
    .then(res => {
      if (res.data.auth) {
        updateIsAuth(true)
        axios.get(`http://${config.hostname}:${config.port}/user/${res.data.user._id}`)
        .then(res => {
          if (res.data.success) {
            updateUser(res.data.user[0])
            axios.get(`http://${config.hostname}:${config.port}/movies`)
              .then(res => {
                if (res.data.success) {
                  updateMovies(res.data.movies)
                  const showSearchBar = document.getElementsByClassName('show-search-bar')[0];
                  const searchBarCollapse = document.getElementsByClassName('search-bar-collapse')[0];
                  const avatar = document.getElementsByClassName('avatar')[0];
                  const avatarDropdown = document.getElementsByClassName('avatar-dropdown')[0];
              
                  document.onclick = (e) => {
                    if (e.target.classList[0] !== 'avatar-dropdown' && e.target.classList[0] !== 'avatar-dropdown-item') {
                      if (e.target.classList[0] !== 'avatar') {
                        closeMenus();
                      }
                    } else if (e.target.classList[0] !== 'input-search-bar') {
                      closeMenus();
                    }
                  };
              
                  showSearchBar.addEventListener("click", () => {
                    if (searchBarCollapse.style.display === "block") {
                      searchBarCollapse.style.display = "none";
                    } else {
                      searchBarCollapse.style.display = "block";
                    }
                  }, false);
              
                  avatar.addEventListener("click", () => {
                    if (avatarDropdown.style.display === "block") {
                      avatarDropdown.style.display = "none";
                    } else {
                      avatarDropdown.style.display = "block";
                    }
                  }, false);
                }
              });
          }
        });
      }
    });
  }, [])

  const resetSearchBar = () => {
    const searchBarExtended = document.getElementsByClassName('search-bar-extended')[0];
    const searchBarExtendedLowRes = document.getElementsByClassName('search-bar-extended')[1];
    const searchBar = document.getElementsByClassName('search-bar')[0];
    const searchBarCollapse = document.getElementsByClassName('search-bar-collapse')[0];

    updateSearchMovie("");
    context.updateSearch("");

    searchBar.style.borderRadius = '20px 20px 20px 20px'
    searchBarCollapse.style.borderRadius = '0px 0px 0px 0px'
    searchBarExtended.style.display = 'none';
    searchBarExtendedLowRes.style.display = 'none';
  }

  const closeMenus = () => {
    // if (this.state._isAuth) {
    //   const avatarDropdown = document.getElementsByClassName('avatar-dropdown')[0];
    //   avatarDropdown.style.display = "none";
  
    //   const searchBarExtended = document.getElementsByClassName('search-bar-extended')[0];
    //   const searchBarExtendedLowRes = document.getElementsByClassName('search-bar-extended')[1];
    //   const searchBar = document.getElementsByClassName('search-bar')[0];
    //   const searchBarCollapse = document.getElementsByClassName('search-bar-collapse')[0];
  
    //   searchBar.style.borderRadius = '20px 20px 20px 20px'
    //   searchBarCollapse.style.borderRadius = '0px 0px 0px 0px'
    //   searchBarExtended.style.display = 'none';
    //   searchBarExtendedLowRes.style.display = 'none';
    // }
  }

  const handleSearch = (event) => {
    const searchBarExtended = document.getElementsByClassName('search-bar-extended')[0];
    const searchBarExtendedLowRes = document.getElementsByClassName('search-bar-extended')[1];
    const searchBar = document.getElementsByClassName('search-bar')[0];
    const searchBarCollapse = document.getElementsByClassName('search-bar-collapse')[0];

    if (props.extended) {
      if (event.target.value.trim() !== '') {
        searchBar.style.borderRadius = '20px 20px 0px 0px'
        searchBarCollapse.style.borderRadius = '0px 0px 20px 20px'
        searchBarExtended.style.display = 'block';
        searchBarExtendedLowRes.style.display = 'block';
      } else {
        searchBar.style.borderRadius = '20px 20px 20px 20px'
        searchBarCollapse.style.borderRadius = '0px 0px 0px 0px'
        searchBarExtended.style.display = 'none';
        searchBarExtendedLowRes.style.display = 'none';
      }
    }

    updateSearchMovie(event.target.value)
    context.updateSearch(event.target.value);
  }

  const { language } = props;
    return (
      <header style={{ marginBottom: 20 }}>
          {
            _isAuth ? (
              <div>
                <div className="App-header align-center">
                  <Link to="/" onClick={() => closeMenus()}>
                    <img className="logo" src={process.env.PUBLIC_URL + '/logo.png'} alt="Logo" />
                  </Link>
                  <div className="search-bar">
                    <div className="row align-center">
                      <input className="input-search-bar" type="text" placeholder={translations[language].header.searchPlaceholder} spellCheck="false" value={searchMovie} onChange={handleSearch} />
                      <SearchIcon className="submit-search-bar" style={{ fill: "#fff", width: 20, height: 20 }} />
                    </div>
                    {
                      (props.extended) ? (
                        <div className="search-bar-extended">
                        {
                          movies.map((movie) => {
                            if (movie.name_fr.toLowerCase().trim().startsWith(searchMovie.toLowerCase().trim()) || movie.name_en.toLowerCase().trim().startsWith(searchMovie.toLowerCase().trim())) {
                              return (
                                <Link to={`/watch/${movie._id}`} key={`movie-${movie._id}`} onClick={() => resetSearchBar()}>
                                  <div className="search-bar-extended-result"><img src={movie.poster} width="20" height="20" alt={`movie-${movie._id}`} style={{marginRight: 10}} />{(language === 'fr') ? movie.name_fr : movie.name_en}</div>
                                </Link>
                              )
                            }
                            return null;
                          })
                        }
                        </div>
                      ) : (
                        null
                      )
                    }
                  </div>
                  <SearchIcon className="show-search-bar" style={{ fill: "#fff", width: 20, height: 20 }} />
                  <div style={{position: 'relative'}}>
                    <img className="avatar" src={user.avatar} alt="Avatar" width="50" height="50" />
                    <div className="avatar-dropdown">
                      <Link to="/search" onClick={() => closeMenus()}>
                        <div className="avatar-dropdown-item">
                          Search
                        </div>
                      </Link>
                      <Link to="/profile" onClick={() => closeMenus()}>
                        <div className="avatar-dropdown-item">
                          {translations[language].header.avatarMenu.profile}
                        </div>
                      </Link>
                      <Link to="/settings" onClick={() => closeMenus()}>
                        <div className="avatar-dropdown-item">
                          {translations[language].header.avatarMenu.settings}
                        </div>
                      </Link>
                      <Link to="/logout" onClick={() => closeMenus()}>
                        <div className="avatar-dropdown-item">
                          {translations[language].header.avatarMenu.logout}
                        </div>
                      </Link>
                    </div>
                  </div>
                  
                </div>
                <div className="search-bar-collapse">
                <div className="row align-center">
                  <input className="input-search-bar-collapse" type="text" placeholder={translations[language].header.searchPlaceholder} spellCheck="false" value={searchMovie} onChange={handleSearch} />
                  <SearchIcon className="submit-search-bar-collapse" style={{ fill: "#fff", width: 20, height: 20 }} />
                </div>
                {
                  (props.extended) ? (
                    <div className="search-bar-extended">
                    {
                      movies.map((movie) => {
                        if (movie.name_fr.toLowerCase().trim().startsWith(searchMovie.toLowerCase().trim()) || movie.name_en.toLowerCase().trim().startsWith(searchMovie.toLowerCase().trim())) {
                          return (
                            <Link to={`/watch/${movie._id}`} key={`movie-${movie._id}`} onClick={() => resetSearchBar()}>
                              <div className="search-bar-extended-result"><img src={movie.poster} width="20" height="20" alt={`movie-${movie._id}`} style={{marginRight: 10}} />{(language === 'fr') ? movie.name_fr : movie.name_en}</div>
                            </Link>
                          )
                        } else {
                          return null;
                        }
                      })
                    }
                    </div>
                  ) : (
                    null
                  )
                }
              </div>
            </div>
            ) : (
              <div className="App-header align-center">
                <img className="logo" src={process.env.PUBLIC_URL + '/logo.png'} alt="Logo" />
              </div>
            )
          }
        </header>
    );

}

export default Header;
