import React from 'react';
import translations from '../translations'
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
    // const passwordInput = document.getElementsByClassName('dark-input')[3];
    // const confirmPasswordInput = document.getElementsByClassName('dark-input')[7];

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
        <h2>{translations[language].register.title}</h2>
        <input className="dark-input" type="text" placeholder={translations[language].register.firstname} style={{marginRight: 10, marginTop: 5, marginBottom: 5}} />
        <input className="dark-input" type="text" placeholder={translations[language].register.lastname} style={{marginLeft: 10, marginTop: 5, marginBottom: 5}} />
        <br />
        <input className="dark-input" type="text" placeholder={translations[language].register.username} style={{marginRight: 10, marginTop: 5, marginBottom: 5}} />
        <input className="dark-input" type="password" placeholder={translations[language].register.password} style={{marginLeft: 10, marginTop: 5, marginBottom: 5}} onChange={this.handlePassword} />
        <br />
        <input className="dark-input" type="email" placeholder={translations[language].register.email} style={{width: '100%', marginTop: 5, marginBottom: 5}} />
        <br />
        <input className="dark-input" type="text" placeholder={translations[language].register.city} style={{marginRight: 10, marginTop: 5, marginBottom: 5}} />
        <input className="dark-input" type="text" placeholder={translations[language].register.phone} style={{marginLeft: 10, marginTop: 5, marginBottom: 5}} />
        <br />
        
        <input className="dark-input" type="password" placeholder={translations[language].register.confirmPassword} style={{width: '100%', marginTop: 5, marginBottom: 10}} onChange={this.handleConfirmPassword} />
        <div className="warnings">
          <p className="warn">{translations[language].register.warns.match}</p>
          <p className="warn">{translations[language].register.warns.length}</p>
        </div>
        <div className="row" style={{ justifyContent: 'space-around' }}>
          <Button content={translations[language].register.submit} />
        </div>
      </div>
    );
  }
}

export default Register;
