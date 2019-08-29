import React from 'react';
import axios from 'axios';
import config from '../config'
import translations from '../translations'
import { ReactComponent as SearchIcon } from '../svg/search.svg'
import { Link } from "react-router-dom";

const movies = [
  { id: 1, name_fr: "L'Arnacoeur", name_en: "L'Arnacoeur", poster: "/posters/arnacoeur.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 2, name_fr: "Hunger Games", name_en: "Hunger Games", poster: "/posters/hunger_games.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 3, name_fr: "Le Monde de Narnia", name_en: "Narnia's World", poster: "/posters/narnia.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 4, name_fr: "Pirates des Caraïbes", name_en: "Pirates of Caraïbes", poster: "/posters/pirates_des_caraibes.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 5, name_fr: "Star Wars: Le Réveil de la Force", name_en: "Star Wars: Strength Awakening", poster: "/posters/star_wars.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 6, name_fr: "Sully", name_en: "Sully", poster: "/posters/sully.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 7, name_fr: "Star Wars: Les Derniers Jedi", name_en: "Star Wars: The Last Jedi", poster: "/posters/star_wars2.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.2 },
  { id: 8, name_fr: "Titanic", name_en: "Titanic", poster: "/posters/titanic.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 9, name_fr: "Spiderman: Homecoming", name_en: "Spiderman: Homecoming", poster: "/posters/spiderman.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 },
  { id: 10, name_fr: "Dunkerque", name_en: "Dunkerque", poster: "/posters/dunkerque.jpg", description_fr: "Un film sympa et cool", description_en: "A really nice movie, yeah", author: "tpompon", rating: 4.8 }
]

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      search: "",
      user: {}
    }
  }

  componentWillMount() {
    axios.get(`http://${config.hostname}:${config.port}/user/ipare`)
    .then(res => {
      if (res.data.success) {
        this.setState({user: res.data.user[0]});
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
    const avatarDropdown = document.getElementsByClassName('avatar-dropdown')[0];
    avatarDropdown.style.display = "none";

    const searchBarExtended = document.getElementsByClassName('search-bar-extended')[0];
    const searchBarExtendedLowRes = document.getElementsByClassName('search-bar-extended')[1];
    const searchBar = document.getElementsByClassName('search-bar')[0];
    const searchBarCollapse = document.getElementsByClassName('search-bar-collapse')[0];

    searchBar.style.borderRadius = '20px 20px 20px 20px'
    searchBarCollapse.style.borderRadius = '0px 0px 0px 0px'
    searchBarExtended.style.display = 'none';
    searchBarExtendedLowRes.style.display = 'none';
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

  componentDidMount() {
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
  }

  render() {
    const { search, user } = this.state;
    const { language } = this.props;

    return (
      <header style={{ marginBottom: 20 }}>
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
                        <Link to={`/watch/${movie.id}`} key={`movie-${movie.id}`} onClick={() => this.resetSearchBar()}>
                          <div className="search-bar-extended-result"><img src={movie.poster} width="20" height="20" alt={`movie-${movie.id}`} style={{marginRight: 10}} />{(language === 'FR') ? movie.name_fr : movie.name_en}</div>
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
                      <Link to={`/watch/${movie.id}`} key={`movie-${movie.id}`} onClick={() => this.resetSearchBar()}>
                        <div className="search-bar-extended-result"><img src={movie.poster} width="20" height="20" alt={`movie-${movie.id}`} style={{marginRight: 10}} />{(language === 'FR') ? movie.name_fr : movie.name_en}</div>
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
      </header>
    );
  }
}

export default Header;
