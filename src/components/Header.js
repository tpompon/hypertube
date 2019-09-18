import React from 'react';
import axios from 'axios';
import config from '../config'
import translations from '../translations'
import { ReactComponent as SearchIcon } from '../svg/search.svg'
import { Link } from "react-router-dom";

axios.defaults.withCredentials = true;

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      search: "",
      movies: [],
      user: {},
      _isAuth: false
    }
  }

  componentDidMount() {
    axios.get(`http://${config.hostname}:${config.port}/auth`)
    .then(res => {
      if (res.data.auth) {
        axios.get(`http://${config.hostname}:${config.port}/user/${res.data.user.username}`)
        .then(res => {
          if (res.data.success) {
            this.setState({_isAuth: true, user: res.data.user[0]});
          }
        });
        axios.get(`http://${config.hostname}:${config.port}/movies`)
        .then(res => {
          if (res.data.success)
            this.setState({movies: res.data.movies}, () => {
              const showSearchBar = document.getElementsByClassName('show-search-bar')[0];
              const searchBarCollapse = document.getElementsByClassName('search-bar-collapse')[0];
              const avatar = document.getElementsByClassName('avatar')[0];
              const avatarDropdown = document.getElementsByClassName('avatar-dropdown')[0];
          
              document.onclick = (e) => {
                if (e.target.classList[0] !== 'avatar-dropdown' && e.target.classList[0] !== 'avatar-dropdown-item') {
                  if (e.target.classList[0] !== 'avatar') {
                    this.closeMenus();
                  }
                } else if (e.target.classList[0] !== 'input-search-bar') {
                  this.closeMenus();
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
            });
        });
      }
    });
  }

  resetSearchBar = () => {
    const searchBarExtended = document.getElementsByClassName('search-bar-extended')[0];
    const searchBarExtendedLowRes = document.getElementsByClassName('search-bar-extended')[1];
    const searchBar = document.getElementsByClassName('search-bar')[0];
    const searchBarCollapse = document.getElementsByClassName('search-bar-collapse')[0];

    this.setState({search: ""});
    this.props.updateSearch("");

    searchBar.style.borderRadius = '20px 20px 20px 20px'
    searchBarCollapse.style.borderRadius = '0px 0px 0px 0px'
    searchBarExtended.style.display = 'none';
    searchBarExtendedLowRes.style.display = 'none';
  }

  closeMenus = () => {
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

  handleSearch = (event) => {
    const searchBarExtended = document.getElementsByClassName('search-bar-extended')[0];
    const searchBarExtendedLowRes = document.getElementsByClassName('search-bar-extended')[1];
    const searchBar = document.getElementsByClassName('search-bar')[0];
    const searchBarCollapse = document.getElementsByClassName('search-bar-collapse')[0];

    if (this.props.extended) {
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

    this.setState({ search: event.target.value });
    this.props.updateSearch(event.target.value);
  }

  render() {
    const { search, user, movies, _isAuth } = this.state;
    const { language } = this.props;

    return (
      <header style={{ marginBottom: 20 }}>
          {
            _isAuth ? (
              <div>
                <div className="App-header align-center">
                  <Link to="/" onClick={() => this.closeMenus()}>
                    <img className="logo" src={process.env.PUBLIC_URL + '/logo.png'} alt="Logo" />
                  </Link>
                  <div className="search-bar">
                    <div className="row align-center">
                      <input className="input-search-bar" type="text" placeholder={translations[language].header.searchPlaceholder} spellCheck="false" value={search} onChange={this.handleSearch} onClick={this.handleSearch} />
                      <SearchIcon className="submit-search-bar" style={{ fill: "#fff", width: 20, height: 20 }} />
                    </div>
                    {
                      (this.props.extended) ? (
                        <div className="search-bar-extended">
                        {
                          movies.map((movie) => {
                            if (movie.name_fr.toLowerCase().trim().startsWith(search.toLowerCase().trim()) || movie.name_en.toLowerCase().trim().startsWith(search.toLowerCase().trim())) {
                              return (
                                <Link to={`/watch/${movie._id}`} key={`movie-${movie._id}`} onClick={() => this.resetSearchBar()}>
                                  <div className="search-bar-extended-result"><img src={movie.poster} width="20" height="20" alt={`movie-${movie._id}`} style={{marginRight: 10}} />{(language === 'FR') ? movie.name_fr : movie.name_en}</div>
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
                      <Link to="/profile" onClick={() => this.closeMenus()}>
                        <div className="avatar-dropdown-item">
                          {translations[language].header.avatarMenu.profile}
                        </div>
                      </Link>
                      <Link to="/settings" onClick={() => this.closeMenus()}>
                        <div className="avatar-dropdown-item">
                          {translations[language].header.avatarMenu.settings}
                        </div>
                      </Link>
                      <Link to="/logout" onClick={() => this.closeMenus()}>
                        <div className="avatar-dropdown-item">
                          {translations[language].header.avatarMenu.logout}
                        </div>
                      </Link>
                    </div>
                  </div>
                  
                </div>
                <div className="search-bar-collapse">
                <div className="row align-center">
                  <input className="input-search-bar-collapse" type="text" placeholder={translations[language].header.searchPlaceholder} spellCheck="false" value={search} onChange={this.handleSearch} onClick={this.handleSearch} />
                  <SearchIcon className="submit-search-bar-collapse" style={{ fill: "#fff", width: 20, height: 20 }} />
                </div>
                {
                  (this.props.extended) ? (
                    <div className="search-bar-extended">
                    {
                      movies.map((movie) => {
                        if (movie.name_fr.toLowerCase().trim().startsWith(search.toLowerCase().trim()) || movie.name_en.toLowerCase().trim().startsWith(search.toLowerCase().trim())) {
                          return (
                            <Link to={`/watch/${movie._id}`} key={`movie-${movie._id}`} onClick={() => this.resetSearchBar()}>
                              <div className="search-bar-extended-result"><img src={movie.poster} width="20" height="20" alt={`movie-${movie._id}`} style={{marginRight: 10}} />{(language === 'FR') ? movie.name_fr : movie.name_en}</div>
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
}

export default Header;
