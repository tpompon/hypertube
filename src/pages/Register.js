import React from 'react';
import Button from '../components/Button'

class Register extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirmPassword: ''
    }
  }

  verifyPasswords = () => {
    const passwordInput = document.getElementsByClassName('dark-input')[3];
    const confirmPasswordInput = document.getElementsByClassName('dark-input')[7];

    const warnMatch = document.getElementsByClassName('warn')[0];
    const warnLength = document.getElementsByClassName('warn')[1];

    const { password, confirmPassword } = this.state;

    if (password !== confirmPassword) {
      warnMatch.style.display = 'block';
    } else {
      warnMatch.style.display = 'none';
    }

    if (password.length < 8) {
      warnLength.style.display = 'block';
    } else {
      warnLength.style.display = 'none';
    }
  }

  handlePassword = (event) => {
    this.setState({ password: event.target.value }, () => this.verifyPasswords());
  }
  handleConfirmPassword = (event) => {
    this.setState({ confirmPassword: event.target.value }, () => this.verifyPasswords());
  }

  render() {

    const { language } = this.props;

    return (
      <div className="dark-card center text-center">
        <h2>{(language === 'FR') ? 'S\'inscrire' : 'Register'}</h2>
        <input className="dark-input" type="text" placeholder={(language === 'FR') ? 'Prénom' : 'First name'} style={{marginRight: 10, marginTop: 5, marginBottom: 5}} />
        <input className="dark-input" type="text" placeholder={(language === 'FR') ? 'Nom' : 'Last name'} style={{marginLeft: 10, marginTop: 5, marginBottom: 5}} />
        <br />
        <input className="dark-input" type="text" placeholder={(language === 'FR') ? 'Nom d\'utilisateur' : 'Username'} style={{marginRight: 10, marginTop: 5, marginBottom: 5}} />
        <input className="dark-input" type="password" placeholder={(language === 'FR') ? 'Mot de passe' : 'Password'} style={{marginLeft: 10, marginTop: 5, marginBottom: 5}} onChange={this.handlePassword} />
        <br />
        <input className="dark-input" type="email" placeholder={(language === 'FR') ? 'E-mail' : 'E-mail'} style={{width: '100%', marginTop: 5, marginBottom: 5}} />
        <br />
        <input className="dark-input" type="text" placeholder={(language === 'FR') ? 'Ville' : 'City'} style={{marginRight: 10, marginTop: 5, marginBottom: 5}} />
        <input className="dark-input" type="text" placeholder={(language === 'FR') ? 'Téléphone' : 'Phone'} style={{marginLeft: 10, marginTop: 5, marginBottom: 5}} />
        <br />
        
        <input className="dark-input" type="password" placeholder={(language === 'FR') ? 'Confirmer mot de passe' : 'Confirm password'} style={{width: '100%', marginTop: 5, marginBottom: 10}} onChange={this.handleConfirmPassword} />
        <div className="warnings">
          <p className="warn">{(language === 'FR') ? 'Les mots de passe ne correspondent pas' : 'Passwords don\'t match'}</p>
          <p className="warn">{(language === 'FR') ? 'Le mot de passe doit contenir 8 caractères minimum' : 'Password must contains at least 8 characters'}</p>
        </div>
        <div className="row" style={{ justifyContent: 'space-around' }}>
          <Button content={(language === 'FR') ? 'S\'inscrire' : 'Register'} />
        </div>
      </div>
    );
  }
}

export default Register;
