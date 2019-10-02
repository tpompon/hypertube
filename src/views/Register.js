import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios'
import config from 'config'
import translations from 'translations'
import Button from 'components/Button'
import { Link } from "react-router-dom";
import { UserConsumer } from 'store';

const Register = () => {

  const [newUser, updatenewUser] = useState({
    origin: window.location.origin,
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    confirmPassword: "",
    // avatar: `http://${hostname}:${port}/public/avatars/${req.body.avatar}`,
    // cover: req.body.cover,
    // birthdate: req.body.birthdate,
    // age: req.body.age,
    // gender: req.body.gender,
    // language: req.body.language,
    email: "",
    phone: "",
    city: "",
    // country: req.body.country
  })
  const [toggleSuccess, updateToggleSuccess] = useState(false)
  const [warnMatch, updateWarnMatch] = useState(false)
  const [warnLength, updateWarnLength] = useState(false)
  const uploadAvatar = useRef(null)
  const context = useContext(UserConsumer)
  const { language } = context

  useEffect(() => {
    verifyPasswords()
  })

  const register = () => {
    if (newUser.password === newUser.confirmPassword && newUser.password.length >= 8) {
      axios.post(`http://${config.hostname}:${config.port}/users`, newUser)
       .then(() => updateToggleSuccess(true))
    } else {
      console.log('Invalid password');
    }
  }

  const verifyPasswords = () => {
    if (newUser.password !== newUser.confirmPassword) {
      updateWarnMatch(true)
    } else {
      updateWarnMatch(false)
    }
    if (newUser.password.length < 8) {
      updateWarnLength(true)
    } else {
      updateWarnLength(false)
    }
  }

  const onChange = (event, option) => {
    updatenewUser({ ...newUser, [option]: event.target.value })
  }

  const onChangeAvatar = (event) => {
    if (event.target.files[0]) {
      event.preventDefault();
      const data = new FormData();
      data.append('file', event.target.files[0]);
      data.append('filename', event.target.files[0].name);
      alert('OK');
      // Treat image upload and show it on form, save it temp, and move it in the user folder only if register success
    }
  }

  return (
    <div className="dark-card center text-center">
      <div className="profile-avatar center">
        <a className="profile-avatar-overlay" onClick={() => uploadAvatar.current.click()}>Upload avatar</a> {/* To translate */}
        <input type="file" id="file" ref={ uploadAvatar } onChange={(e) => onChangeAvatar(e)} style={{display: "none"}}/>
        <img src={`http://${config.hostname}:${config.port}/public/avatars/default_avatar.png`} alt={`Upload avatar`} />
      </div>

      <h2>{translations[language].register.title}</h2>
      {
        (toggleSuccess) ? (
          <div className="success" style={{ display: "block" }} onClick={() => updateToggleSuccess(false)}>
            Account created, confirmation email has been sent
          </div>
        ) : null
      }
      
      <input className="dark-input" type="text" value={newUser.firstname} onChange={ (event) => onChange(event, "firstname")} placeholder={translations[language].register.firstname} style={{marginRight: 10, marginTop: 5, marginBottom: 5}} required />
      <input className="dark-input" type="text" value={newUser.lastname} onChange={ (event) => onChange(event, "lastname")} placeholder={translations[language].register.lastname} style={{marginLeft: 10, marginTop: 5, marginBottom: 5}} required />
      <br />
      <input className="dark-input" type="text" value={newUser.username} onChange={ (event) => onChange(event, "username")} placeholder={translations[language].register.username} style={{marginRight: 10, marginTop: 5, marginBottom: 5}} required />
      <input className="dark-input" type="password" value={newUser.password} onChange={ (event) => onChange(event, "password")} placeholder={translations[language].register.password} style={{marginLeft: 10, marginTop: 5, marginBottom: 5}} required />
      <br />
      <input className="dark-input" type="email" value={newUser.email} onChange={ (event) => onChange(event, "email")} placeholder={translations[language].register.email} style={{width: '100%', marginTop: 5, marginBottom: 5}} required />
      <br />
      <input className="dark-input" type="text" value={newUser.city} onChange={ (event) => onChange(event, "city")} placeholder={translations[language].register.city} style={{marginRight: 10, marginTop: 5, marginBottom: 5}} />
      <input className="dark-input" type="number" value={newUser.phone} onChange={ (event) => onChange(event, "phone")} placeholder={translations[language].register.phone} style={{marginLeft: 10, marginTop: 5, marginBottom: 5}} />
      <br />
      <input className="dark-input" type="password" value={newUser.confirmPassword} onChange={ (event) => onChange(event, "confirmPassword")} placeholder={translations[language].register.confirmPassword} style={{width: '100%', marginTop: 5, marginBottom: 10}} required />
      <div className="warnings">
        { warnMatch ? <p style={{ display: "block" }} className="warn">{translations[language].register.warns.match}</p> : null }
        { warnLength ? <p style={{ display: "block" }} className="warn">{translations[language].register.warns.length}</p> : null }
      </div>
      <div className="row" style={{ justifyContent: 'space-around' }} onClick={() => register()}>
        <Button content={translations[language].register.submit} />
      </div>
      <div className="link center" style={{ marginTop: 20, fontSize: '.8em', opacity: .8 }}>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );

}

export default Register;
