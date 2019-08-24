import React from 'react';
import { Link } from "react-router-dom";
import Button from '../components/Button'
import { ReactComponent as TwitterIcon } from '../twitter.svg'
import { ReactComponent as FourtyTwoIcon } from '../42.svg'
import { ReactComponent as FacebookIcon } from '../facebook.svg'

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {

    const { language } = this.props;

    return (
      <div className="dark-card center text-center">
        <h2>{(language === 'FR') ? "Se connecter" : "Log in"}</h2>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 20 }}>
          <button className="oauth-btn oauth-btn-42" style={{width: '31%'}}><FourtyTwoIcon fill="#fff" width="25" height="25" /></button>
          <button className="oauth-btn oauth-btn-twitter" style={{width: '31%'}}><TwitterIcon fill="#fff" width="25" height="25" /></button>
          <button className="oauth-btn oauth-btn-facebook" style={{width: '31%'}}><FacebookIcon fill="#fff" width="25" height="25" /></button>
        </div>
        <input className="dark-input" type="text" placeholder={(language === 'FR') ? "Nom d'utilisateur ou e-mail" : "Username or e-mail"} style={{width: '100%', marginTop: 5, marginBottom: 5}} />
        <input className="dark-input" type="password" placeholder={(language === 'FR') ? "Mot de passe" : "Password"} style={{width: '100%', marginTop: 5, marginBottom: 20}} />
        <div className="row" style={{ justifyContent: 'space-around' }}>
          <Button content={(language === 'FR' ? "Se connecter" : "Log in")} />
        </div>
        <div className="row" style={{ marginTop: 20, fontSize: '.8em', opacity: .8 }}>
          <div className="link center" style={{marginRight: 5}}>{(language === 'FR') ? "Mot de passe oublié" : "Forgot password"}</div>/<div className="link center" style={{marginLeft: 5}}><Link to="/register">{(language === 'FR') ? "S'inscrire" : "Register"}</Link></div>
        </div>
      </div>
    );
  }
}

export default Login;
