import React from 'react';
import Button from '../components/Button'

class Settings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: 'tpompon',
      email: 'tpompon@student.42.fr',
      phone: '+33 6 42 42 42 42',
      language: 'Français'
    }
  }

  handleChangeUsername = (event) => {
    this.setState({username: event.target.value});
  }
  handleChangeEmail = (event) => {
    this.setState({email: event.target.value});
  }
  handleChangePhone = (event) => {
    this.setState({phone: event.target.value});
  }
  handleChangeLanguage = (event) => {
    this.setState({language: event.target.value});
  }

  handleSubmit = () => {
    alert(`Done!\n\n${this.state.username}\n${this.state.email}\n${this.state.phone}\n${this.state.language}`);
  }

  render() {

    const { language } = this.props;

    return (
      <div className="dark-card center text-center" style={{ width: '40%' }}>
        <h2>{(language === 'FR') ? 'Paramètres' : 'Settings'}</h2>
        <input className="dark-input" type="text" value={this.state.username} placeholder={(language === 'FR') ? 'Nom d\'utilisateur' : 'Username'} onChange={this.handleChangeUsername} style={{width: '20%', marginTop: 5, marginBottom: 5}} />
        <input className="dark-input" type="email" value={this.state.email} placeholder={(language === 'FR') ? 'E-mail' : 'E-mail'} onChange={this.handleChangeEmail} style={{width: '39%', marginLeft: '1%', marginTop: 5, marginBottom: 5}} />
        <input className="dark-input" type="text" value={this.state.phone} placeholder={(language === 'FR') ? 'Téléphone' : 'Phone'} onChange={this.handleChangePhone} style={{width: '39%', marginLeft: '1%', marginTop: 5, marginBottom: 5}} />
        <input className="dark-input" type="password" placeholder={(language === 'FR') ? 'Nouveau mot de passe' : 'New password'} style={{width: '49%', marginRight: '1%', marginTop: 5, marginBottom: 5}} />
        <input className="dark-input" type="password" placeholder={(language === 'FR') ? 'Confirmer mot de passe' : 'Confirm password'} style={{width: '49%', marginLeft: '1%', marginTop: 5, marginBottom: 5}} />
        <select className="dark-input" type="password" onChange={this.handleChangeLanguage} style={{width: '100%', marginTop: 5, marginBottom: 20}}>
          <option>{(language === 'FR') ? 'Français' : 'French'}</option>
          <option>{(language === 'FR') ? 'Anglais' : 'English'}</option>
        </select>
        <div className="row" style={{ justifyContent: 'space-around' }}>
          <div onClick={this.handleSubmit}><Button content={(language === 'FR') ? 'Sauvegarder' : 'Save'} /></div>
        </div>
      </div>
    );
  }
}

export default Settings;
