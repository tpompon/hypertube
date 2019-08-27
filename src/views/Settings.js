import React from 'react';
import axios from 'axios'
import config from '../config'
import translations from '../translations'
import Button from '../components/Button'

class Settings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {},
      language: 'Français'
    }
  }

  componentWillMount() {
    axios.get(`http://${config.hostname}:${config.port}/user/ipare`)
      .then(res => this.setState({user: res.data}));
  }

  handleChangeFirstname = (event) => {
    this.setState({user: { ...this.state.user, firstname: event.target.value }});
  }
  handleChangeLastname = (event) => {
    this.setState({user: { ...this.state.user, lastname: event.target.value }});
  }
  handleChangeUsername = (event) => {
    this.setState({user: { ...this.state.user, username: event.target.value }});
  }
  handleChangeEmail = (event) => {
    this.setState({user: { ...this.state.user, email: event.target.value }});
  }
  handleChangePhone = (event) => {
    this.setState({user: { ...this.state.user, phone: event.target.value }});
  }
  handleChangeCountry = (event) => {
    this.setState({user: { ...this.state.user, country: event.target.value }});
  }
  handleChangeCity = (event) => {
    this.setState({user: { ...this.state.user, city: event.target.value }});
  }
  handleChangeLanguage = (event) => {
    this.setState({language: event.target.value});
  }

  handleSubmit = () => {
    axios.put(`http://${config.hostname}:${config.port}/user/ipare`, this.state.user);
  }

  render() {
    const { user } = this.state;
    const { language } = this.props;

    return (
      <div className="dark-card center text-center" style={{ width: '40%' }}>
        <h2>{translations[language].settings.title}</h2>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <input className="dark-input" type="text" value={user.firstname} placeholder={translations[language].settings.firstname} onChange={this.handleChangeFirstname} style={{width: '32%', marginTop: 5, marginBottom: 5}} />
          <input className="dark-input" type="text" value={user.lastname} placeholder={translations[language].settings.lastname} onChange={this.handleChangeLastname} style={{width: '32%', marginTop: 5, marginBottom: 5}} />
          <input className="dark-input" type="text" value={user.username} placeholder={translations[language].settings.username} onChange={this.handleChangeUsername} style={{width: '32%', marginTop: 5, marginBottom: 5}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <input className="dark-input" type="email" value={user.email} placeholder={translations[language].settings.email} onChange={this.handleChangeEmail} style={{width: '49%', marginTop: 5, marginBottom: 5}} />
        <input className="dark-input" type="text" value={user.phone} placeholder={translations[language].settings.phone} onChange={this.handleChangePhone} style={{width: '49%', marginTop: 5, marginBottom: 5}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <input className="dark-input" type="password" placeholder={translations[language].settings.newPassword} style={{width: '49%', marginRight: '1%', marginTop: 5, marginBottom: 5}} />
        <input className="dark-input" type="password" placeholder={translations[language].settings.confirmPassword} style={{width: '49%', marginLeft: '1%', marginTop: 5, marginBottom: 5}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 20}}>
          <input className="dark-input" type="text" value={user.country} placeholder={translations[language].settings.country} onChange={this.handleChangeCountry} style={{width: '35%',  marginTop: 5, marginBottom: 5}} />
          <input className="dark-input" type="text" value={user.city} placeholder={translations[language].settings.city} onChange={this.handleChangeCity} style={{width: '35%', marginTop: 5, marginBottom: 5}} />
          <select className="dark-input" onChange={this.handleChangeLanguage} style={{width: '26%', marginTop: 5 }}>
            <option>{translations[language].settings.languages.french}</option>
            <option>{translations[language].settings.languages.english}</option>
          </select>
        </div>
        <div className="row" style={{ justifyContent: 'space-around' }}>
          <div onClick={this.handleSubmit}><Button content={translations[language].settings.submit} /></div>
        </div>
      </div>
    );
  }
}

export default Settings;
