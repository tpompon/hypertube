import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import config from 'config'
import translations from 'translations'
import { ReactComponent as SearchIcon } from 'svg/search.svg'
import { Link } from "react-router-dom";
import { UserConsumer } from "store"

axios.defaults.withCredentials = true;

const Header = (props) => {

  const { language, extended } = props
  const [searchMovie, updateSearchMovie] = useState("")
  const [movies, updateMovies] = useState([])
  const [user, updateUser] = useState({})
  const [_isAuth, updateIsAuth] = useState(false)
  const [searchInProgress, updateSearchInProgress] = useState(false)
  const [toggleSearchBarCollapse, updateToggleSearchBarCollapse] = useState(false)
  const [toggleAvatarDropdown, updateToggleAvatarDropdown] = useState(false)
  const context = useContext(UserConsumer)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async() => {
    const responseAuth = await axios.get(`http://${config.hostname}:${config.port}/auth`)
    if (responseAuth.data.auth) {
      updateIsAuth(true)
      const responseUser = await axios.get(`http://${config.hostname}:${config.port}/user/${responseAuth.data.user._id}`)
      if (responseUser.data.success) {
        updateUser(responseUser.data.user[0])
        const responseMovies = await axios.get(`http://${config.hostname}:${config.port}/movies`)
        if (responseMovies.data.success) {
          updateMovies(responseMovies.data.movies)
          document.onclick = (e) => {
            if (e.target.classList[0] !== 'avatar-dropdown' && e.target.classList[0] !== 'avatar-dropdown-item') {
              if (e.target.classList[0] !== 'avatar') {
                closeMenus();
              }
            } else if (e.target.classList[0] !== 'input-search-bar') {
              closeMenus();
            }
          }
        }
      }
    }
  }

  const resetSearchBar = () => {
    updateSearchMovie("");
    updateSearchInProgress(false)
    context.updateSearch("");
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
    if (extended) {
      if (event.target.value.trim() !== '') {
        updateSearchInProgress(true)
      } else {
        updateSearchInProgress(false)
      }
    }
    updateSearchMovie(event.target.value)
    context.updateSearch(event.target.value);
  }

  return (
    <header style={{ marginBottom: 20 }}>
        {
          _isAuth ? (
            <div>
              <div className="App-header align-center">
                <Link to="/" onClick={() => closeMenus()}>
                  <img className="logo" src={process.env.PUBLIC_URL + '/logo.png'} alt="Logo" />
                </Link>
                <div style={{ borderRadius: (searchInProgress) ? '20px 20px 0px 0px' : '20px 20px 20px 20px' }} className="search-bar">
                  <div className="row align-center">
                    <input className="input-search-bar" type="text" placeholder={translations[language].header.searchPlaceholder} spellCheck="false" value={searchMovie} onChange={handleSearch} />
                    <SearchIcon className="submit-search-bar" style={{ fill: "#fff", width: 20, height: 20 }} />
                  </div>
                  {
                    (extended) ? (
                      <div className="search-bar-extended" style={{ display: (searchInProgress) ? "block" : "none" }}>
                      {
                        movies.map((movie) => {
                          if (movie.name.toLowerCase().trim().startsWith(searchMovie.toLowerCase().trim()) || movie.name.toLowerCase().trim().startsWith(searchMovie.toLowerCase().trim())) {
                            return (
                              <Link to={`/watch/${movie._id}`} key={`movie-${movie._id}`} onClick={() => resetSearchBar()}>
                                <div className="search-bar-extended-result"><img src={movie.poster} width="20" height="20" alt={`movie-${movie._id}`} style={{marginRight: 10}} />{movie.name}</div>
                              </Link>
                            )
                          }
                          return null;
                        })
                      }
                      </div>
                    ) : null
                  }
                </div>
                <SearchIcon onClick={ () => updateToggleSearchBarCollapse(!toggleSearchBarCollapse) } className="show-search-bar" style={{ fill: "#fff", width: 20, height: 20 }} />
                <div style={{position: 'relative'}}>
                  <img onClick={ () => updateToggleAvatarDropdown(!toggleAvatarDropdown) } className="avatar" src={user.avatar} alt="Avatar" width="50" height="50" />
                  <div className="avatar-dropdown" style={{ display: (toggleAvatarDropdown) ? "block" : "none" }}>
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
              <div className="search-bar-collapse" style={{ display: (toggleSearchBarCollapse) ? "block" : "none", borderRadius: (searchInProgress) ? '0px 0px 20px 20px' : '0px 0px 0px 0px' }}>
                <div className="row align-center">
                  <input className="input-search-bar-collapse" type="text" placeholder={translations[language].header.searchPlaceholder} spellCheck="false" value={searchMovie} onChange={handleSearch} />
                  <SearchIcon className="submit-search-bar-collapse" style={{ fill: "#fff", width: 20, height: 20 }} />
                </div>
                {
                  (extended) ? (
                    <div className="search-bar-extended" style={{ display: (searchInProgress) ? "block" : "none" }}>
                    {
                      movies.map((movie) => {
                        if (movie.name.toLowerCase().trim().startsWith(searchMovie.toLowerCase().trim()) || movie.name.toLowerCase().trim().startsWith(searchMovie.toLowerCase().trim())) {
                          return (
                            <Link to={`/watch/${movie._id}`} key={`movie-${movie._id}`} onClick={() => resetSearchBar()}>
                              <div className="search-bar-extended-result"><img src={movie.poster} width="20" height="20" alt={`movie-${movie._id}`} style={{marginRight: 10}} />{movie.name}</div>
                            </Link>
                          )
                        }
                        return null
                      })
                    }
                    </div>
                  ) : null
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
