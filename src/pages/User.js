import React from 'react';
import MoviesSlider from '../components/MoviesSlider'

const users = [
  { id: 1, firstname: 'Thomas', lastname: 'Pompon', username: 'tpompon', avatar: '/avatars/tpompon.png', birthdate: '30/06/1999', age: '20', gender: 'male', nationality: 'FR', language: 'french', email: 'tpompon@hypertube.com', phone: '+33685589963', verified: true },
  { id: 2, firstname: 'Irina', lastname: 'Paré', username: 'ipare', avatar: '/avatars/irina.jpg', birthdate: '01/01/1999', age: '20', gender: 'female', nationality: 'FR', language: 'french', email: 'ipare@hypertube.com', phone: '+33785241441', verified: false },
  { id: 3, firstname: 'Audrey', lastname: 'Fortin', username: 'afortin', avatar: '/avatars/afortin.jpg', birthdate: '21/08/1998', age: '21', gender: 'female', nationality: 'FR', language: 'french', email: 'afortin@hypertube.com', phone: '+33670405523', verified: false }
]

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

class User extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: this.props.match.params.username,
      user: {}
    }
  }

  componentWillMount() {
    this.setState({user: users.find(x => x.username === this.state.username)});
  }

  copyProfileURL = () => {
    const { user } = this.state;
    const profileURL = document.createElement('textarea');
    const tooltipText = document.getElementsByClassName("tooltip-text")[0];
    tooltipText.innerHTML = "Copied to clipboard";
    profileURL.value = `${window.location.origin}/user/${user.username}`;
    profileURL.setAttribute('readonly', '');
    profileURL.style = {display: 'none', position: 'absolute', left: '-9999px'};
    document.body.appendChild(profileURL);
    profileURL.select();
    document.execCommand('copy');
    document.body.removeChild(profileURL);
  }

  resetTooltip = () => {
    const tooltipText = document.getElementsByClassName("tooltip-text")[0];
    tooltipText.innerHTML = "Copy to clipboard";
  }

  render() {
    
    const { user } = this.state;
    const { language } = this.props;

    return (
      <div className="text-center">
        {
          user ? (
            <div>
              <div style={{backgroundImage: "url('/pattern.svg')", paddingTop: 40, paddingBottom: 40, marginTop: -20}}>
                <div className="profile-avatar center">
                  <img src={user.avatar} alt={`Avatar ${user.username}`} />
                </div>
                <div style={{marginTop: 20}}>
                  <div>{user.firstname} {user.lastname}</div>
                  <div className="tooltip">
                    <div className="username" onClick={() => this.copyProfileURL()} onMouseLeave={() => this.resetTooltip()}>@{user.username}</div>
                    <span className="tooltip-text">Copy to clipboard</span>
                  </div>
                </div>
              </div>
              <h2>{(language === 'FR') ? 'Coups de coeur' : 'Heartbeat'}</h2>
              <MoviesSlider number={1} movies={heartbeat} language={language} />
              <h2>{(language === 'FR') ? 'Vus récemment' : 'Recently watched'}</h2>
              <MoviesSlider number={2} movies={recents} language={language} />
            </div>
          ) : (
            <h2>{(language === 'FR') ? 'Aucun utilisateur trouvé' : 'User not found'}</h2>
          )
        }
      </div>
    );
  }
}

export default User;
