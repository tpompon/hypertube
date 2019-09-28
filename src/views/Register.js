import React from 'react';
import axios from 'axios'
import config from '../config'
import translations from '../translations'
import Button from '../components/Button'
import { Link } from "react-router-dom";

class Register extends React.Component {

  constructor(props) {
    super(props);
    this.firstname = React.createRef();
    this.lastname = React.createRef();
    this.username = React.createRef();
    this.password = React.createRef();
    this.email = React.createRef();
    this.phone = React.createRef();
    this.city = React.createRef();
    this.state = {
      password: '',
      confirmPassword: ''
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onEnter, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onEnter, false);
  }

  onEnter = (e) => {
    if (e.keyCode === 13) {
      this.register();
    }
  }

  register = () => {
    if (this.verifyPasswords()) {
      const body = {
        origin: window.location.origin,
        firstname: this.firstname.current.value,
        lastname: this.lastname.current.value,
        username: this.username.current.value,
        password: this.password.current.value,
        // avatar: `http://${hostname}:${port}/public/avatars/${req.body.avatar}`,
        // cover: req.body.cover,
        // birthdate: req.body.birthdate,
        // age: req.body.age,
        // gender: req.body.gender,
        // language: req.body.language,
        email: this.email.current.value,
        phone: this.phone.current.value,
        city: this.city.current.value,
        // country: req.body.country
      }
  
      axios.post(`http://${config.hostname}:${config.port}/users`, body)
      .then(res => document.getElementById('success').style.display = 'block')
    } else {
      console.log('Invalid password');
    }
  }

  verifyPasswords = () => {
    const warnMatch = document.getElementsByClassName('warn')[0];
    const warnLength = document.getElementsByClassName('warn')[1];

    const { password, confirmPassword } = this.state;
    let matchVerif = false;
    let lengthVerif = false;

    if (password !== confirmPassword) {
      warnMatch.style.display = 'block';
    } else {
      warnMatch.style.display = 'none';
      matchVerif = true;
    }

    if (password.length < 8) {
      warnLength.style.display = 'block';
    } else {
      warnLength.style.display = 'none';
      lengthVerif = true;
    }

    if (matchVerif && lengthVerif) {
      return true;
    } else {
      return false;
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
        <h2>{translations[language].register.title}</h2>
        <div id="success" className="success" onClick={() => document.getElementById('success').style.display = 'none'}>
          Account created, confirmation email has been sent
        </div>
        <input className="dark-input" ref={this.firstname} type="text" placeholder={translations[language].register.firstname} style={{marginRight: 10, marginTop: 5, marginBottom: 5}} />
        <input className="dark-input" ref={this.lastname} type="text" placeholder={translations[language].register.lastname} style={{marginLeft: 10, marginTop: 5, marginBottom: 5}} />
        <br />
        <input className="dark-input" ref={this.username} type="text" placeholder={translations[language].register.username} style={{marginRight: 10, marginTop: 5, marginBottom: 5}} />
        <input className="dark-input" ref={this.password} type="password" placeholder={translations[language].register.password} style={{marginLeft: 10, marginTop: 5, marginBottom: 5}} onChange={this.handlePassword} />
        <br />
        <input className="dark-input" ref={this.email} type="email" placeholder={translations[language].register.email} style={{width: '100%', marginTop: 5, marginBottom: 5}} />
        <br />
        <input className="dark-input" ref={this.city} type="text" placeholder={translations[language].register.city} style={{marginRight: 10, marginTop: 5, marginBottom: 5}} />
        <input className="dark-input" ref={this.phone} type="text" placeholder={translations[language].register.phone} style={{marginLeft: 10, marginTop: 5, marginBottom: 5}} />
        <br />
        
        <input className="dark-input" type="password" placeholder={translations[language].register.confirmPassword} style={{width: '100%', marginTop: 5, marginBottom: 10}} onChange={this.handleConfirmPassword} />
        <div className="warnings">
          <p className="warn">{translations[language].register.warns.match}</p>
          <p className="warn">{translations[language].register.warns.length}</p>
        </div>
        <div className="row" style={{ justifyContent: 'space-around' }} onClick={() => this.register()}>
          <Button content={translations[language].register.submit} />
        </div>
        <div className="link center" style={{ marginTop: 20, fontSize: '.8em', opacity: .8 }}>
          <Link to="/login">Login</Link>
        </div>
      </div>
    );
  }
}

export default Register;
