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
    this.usernameInput = React.createRef();
    this.passwordInput = React.createRef();
  }

  authenticate() {
    const body = {
      username: this.usernameInput.current.value,
      password: this.passwordInput.current.value
    }
    axios.post(`http://${config.hostname}:${config.port}/auth/login`, body)
      .then((res) => {
        //alert(res.data.status);
        if (res.data.success) {
          // this.props.history.push('/');
        }
      });
  }



  render() {
    const { language } = this.props;

    return (
      <div className="dark-card center text-center">
        <h2>{translations[language].login.title}</h2>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 20 }}>
          <button className="oauth-btn oauth-btn-42" style={{width: '31%'}}><FourtyTwoIcon fill="#fff" width="25" height="25" /></button>
          <button className="oauth-btn oauth-btn-twitter" style={{width: '31%'}}><TwitterIcon fill="#fff" width="25" height="25" /></button>
          <button className="oauth-btn oauth-btn-facebook" style={{width: '31%'}}><FacebookIcon fill="#fff" width="25" height="25" /></button>
        </div>
        <input ref={this.usernameInput} className="dark-input" type="text" placeholder={translations[language].login.inputs.username} style={{width: '100%', marginTop: 5, marginBottom: 5}} />
        <input ref={this.passwordInput} className="dark-input" type="password" placeholder={translations[language].login.inputs.password} style={{width: '100%', marginTop: 5, marginBottom: 20}} />
        <div className="row" style={{ justifyContent: 'space-around' }}>
          <div style={{ display: 'table' }} onClick={() => this.authenticate() }><Button content={translations[language].login.inputs.submit} /></div>
        </div>
        <div className="row" style={{ marginTop: 20, fontSize: '.8em', opacity: .8 }}>
          <div className="link center" style={{marginRight: 5}}>{translations[language].login.inputs.forgotPassword}</div>/<div className="link center" style={{marginLeft: 5}}><Link to="/register">{translations[language].login.inputs.register}</Link></div>
        </div>
      </div>
    );
  }
}

export default Login;
