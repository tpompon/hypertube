import React from 'react';
import axios from 'axios'
import config from '../config'
import translations from '../translations'
import { Link } from "react-router-dom";
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
      forgot: false,
      link: translations[this.props.language].login.inputs.forgotPassword
    }
    this.usernameInput = React.createRef();
    this.passwordInput = React.createRef();
    this.forgotInput = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onEnter, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onEnter, false);
  }

  onEnter = (e) => {
    const { forgot } = this.state;
    if (e.keyCode === 13) {
      forgot ? this.sendResetLink() : this.authenticate();
    }
  }

  toggleForgot = () => {
    this.setState({
      forgot: !this.state.forgot,
      link: this.state.forgot ? translations[this.props.language].login.inputs.forgotPassword : translations[this.props.language].login.title
    })
  };

  authenticate = (strategy) => {
    if (strategy === 'twitter') {
      window.location.href = `http://${config.hostname}:${config.port}/oauth/twitter/`;
    } else if (strategy === '42') {
      window.location.href = `http://${config.hostname}:${config.port}/oauth/42/`;
    } else {
      const body = {
        username: this.usernameInput.current.value,
        password: this.passwordInput.current.value
      }
      axios.post(`http://${config.hostname}:${config.port}/auth/login/local`, body)
        .then((res) => {
          //alert(res.data.status);
          if (res.data.success) {
            window.location.href = `http://localhost:3000/`;
            // this.props.history.push('/');
          } else {
            this.setState({ error: res.data.status });
            document.getElementById('error').style.display = 'block';
          }
        });
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
    const { forgot } = this.state;
    const { language } = this.props;

    return (
      <div className="dark-card center text-center">
        <h2>{translations[language].login.title}</h2>
        {
          forgot ? (
            <div>
              <div id="success" className="success" onClick={() => document.getElementById('success').style.display = 'none'}>
                Mail has been sent
              </div>
              <div id="error2" className="error" onClick={() => document.getElementById('error2').style.display = 'none'}>
                {this.state.error2}
              </div>
              <div id="forgot-form" style={{ width: 420}}>
                <input ref={this.forgotInput} className="dark-input" type="email" placeholder='E-mail' style={{width: '100%', marginBottom: 20 }} />
                <div className="row" style={{ justifyContent: 'space-around' }}>
                  <div style={{ display: 'table' }} onClick={() => this.sendResetLink()}><Button content='Send reset link' /></div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div id="error" className="error" onClick={() => document.getElementById('error').style.display = 'none'}>
                {this.state.error}
              </div>
              <div id="login-form">
                <div className="row" style={{ justifyContent: 'space-between', marginBottom: 20 }}>
                  <button onClick={() => this.authenticate('42')} className="oauth-btn oauth-btn-42" style={{width: '31%'}}><FourtyTwoIcon fill="#fff" width="25" height="25" /></button>
                  <button onClick={() => this.authenticate('twitter')} className="oauth-btn oauth-btn-twitter" style={{width: '31%'}}><TwitterIcon fill="#fff" width="25" height="25" /></button>
                  <button className="oauth-btn oauth-btn-facebook" style={{width: '31%'}}><FacebookIcon fill="#fff" width="25" height="25" /></button>
                </div>
                <input ref={this.usernameInput} className="dark-input" type="text" placeholder={translations[language].login.inputs.username} style={{width: '100%', marginTop: 5, marginBottom: 5}} />
                <input ref={this.passwordInput} className="dark-input" type="password" placeholder={translations[language].login.inputs.password} style={{width: '100%', marginTop: 5, marginBottom: 20}} />
                <div className="row" style={{ justifyContent: 'space-around' }}>
                  <div style={{ display: 'table' }} onClick={() => this.authenticate()}><Button content={translations[language].login.inputs.submit} /></div>
                </div>
              </div>
            </div>
          )
        }
        <div className="row" style={{ marginTop: 20, fontSize: '.8em', opacity: .8 }}>
          <div className="link center" style={{marginRight: 5}} onClick={() => this.toggleForgot() }>{this.state.link}</div>/<div className="link center" style={{marginLeft: 5}}><Link to="/register">{translations[language].login.inputs.register}</Link></div>
        </div>
      </div>
    );
  }
}

export default Login;
