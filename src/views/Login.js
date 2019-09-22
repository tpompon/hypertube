import React from 'react';
import axios from 'axios'
import config from '../config'
import translations from '../translations'
import { Link, Redirect } from "react-router-dom";
import Button from '../components/Button'
import { ReactComponent as TwitterIcon } from '../svg/twitter.svg'
import { ReactComponent as FourtyTwoIcon } from '../svg/42.svg'
import { ReactComponent as FacebookIcon } from '../svg/facebook.svg'

axios.defaults.withCredentials = true;

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: 'none',
      error2: 'none',
      link: translations[this.props.language].login.inputs.forgotPassword
    }
    this.usernameInput = React.createRef();
    this.passwordInput = React.createRef();
    this.forgotInput = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('keydown', (e) => {
      var key = e.which || e.keyCode;
      if (key === 13) {
        this.authenticate();
      }
    });
  }

  authenticate = () => {
    const body = {
      username: this.usernameInput.current.value,
      password: this.passwordInput.current.value
    }
    axios.post(`http://${config.hostname}:${config.port}/auth/login/local`, body)
      .then((res) => {
        //alert(res.data.status);
        if (res.data.success) {
          window.location.href = "http://localhost:3000/";
          // this.props.history.push('/');
        } else {
          //console.log(res.data.status)
          this.setState({ error: res.data.status});
          document.getElementById('error').style.display = 'block';
        }
      });
  }

  toggleForgot = () => {
    const forgotForm = document.getElementById('forgot-form');
    const loginForm = document.getElementById('login-form');

    if (forgotForm.style.display === 'none') {
      forgotForm.style.display = 'block';
      loginForm.style.display = 'none';
    } else {
      forgotForm.style.display = 'none';
      loginForm.style.display = 'block';
    }
  }

  sendResetLink = () => {
    const body = {
      email: this.forgotInput.current.value,
      origin: window.location.origin
    }
    axios.post(`${config.serverURL}/auth/forgot`, body)
    .then((res) => {
      if (!res.data.success) {
        this.setState({ error2: res.data.status});
        document.getElementById('error2').style.display = 'block';
      } else {
        document.getElementById('success').style.display = 'block';
      }
    })
  }

  render() {
    const { language } = this.props;

    return (
      <div className="dark-card center text-center">
        <h2>{translations[language].login.title}</h2>
        <div id="success" className="success" onClick={() => document.getElementById('success').style.display = 'none'}>
          Mail has been sent
        </div>
        <div id="error2" className="error" onClick={() => document.getElementById('error2').style.display = 'none'}>
          {this.state.error2}
        </div>
        <div id="forgot-form" style={{display: 'none', width: 420}}>
          <input ref={this.forgotInput} className="dark-input" type="text" placeholder='E-mail' style={{width: '100%', marginTop: 20, marginBottom: 20 }} />
          <div className="row" style={{ justifyContent: 'space-around' }}>
            <div style={{ display: 'table' }} onClick={() => this.sendResetLink()}><Button content='Send reset link' /></div>
          </div>
        </div>
        <div id="error" className="error" onClick={() => document.getElementById('error').style.display = 'none'}>
          {this.state.error}
        </div>
        <div id="login-form">
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 20 }}>
            <button className="oauth-btn oauth-btn-42" style={{width: '31%'}}><FourtyTwoIcon fill="#fff" width="25" height="25" /></button>
            <button className="oauth-btn oauth-btn-twitter" style={{width: '31%'}}><TwitterIcon fill="#fff" width="25" height="25" /></button>
            <button className="oauth-btn oauth-btn-facebook" style={{width: '31%'}}><FacebookIcon fill="#fff" width="25" height="25" /></button>
          </div>
          <input ref={this.usernameInput} className="dark-input" type="text" placeholder={translations[language].login.inputs.username} style={{width: '100%', marginTop: 5, marginBottom: 5}} />
          <input ref={this.passwordInput} className="dark-input" type="password" placeholder={translations[language].login.inputs.password} style={{width: '100%', marginTop: 5, marginBottom: 20}} />
          <div className="row" style={{ justifyContent: 'space-around' }}>
            <div style={{ display: 'table' }} onClick={() => this.authenticate()}><Button content={translations[language].login.inputs.submit} /></div>
          </div>
        </div>
        <div className="row" style={{ marginTop: 20, fontSize: '.8em', opacity: .8 }}>
          <div className="link center" style={{marginRight: 5}} onClick={() => { this.toggleForgot(); this.setState({link: 'Login'})} }>{this.state.link}</div>/<div className="link center" style={{marginLeft: 5}}><Link to="/register">{translations[language].login.inputs.register}</Link></div>
        </div>
      </div>
    );
  }
}

export default Login;
