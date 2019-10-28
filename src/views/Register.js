import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import config from "config";
import translations from "translations";
import Button from "components/Button";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";
import { UserConsumer } from "store";

import { verifyPasswd, verifyEmail, verifyUsername, verifyNameOrCity, verifyPhone, verifyAvatarExt, verifyAvatarSize } from "utils/functions"

const Register = () => {
  const [newUser, updatenewUser] = useState({
    origin: window.location.origin,
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    confirmPassword: "",
    avatar: `${config.serverURL}/public/avatars/default_avatar.png`,
    email: "",
    phone: "",
    city: ""
  });
  const [success, setSuccess] = useState(false);
  const [warnMatch, updateWarnMatch] = useState(false);
  const [warnLength, updateWarnLength] = useState(false);
  const [error, setError] = useState(null);
  const uploadAvatar = useRef(null);
  const recaptchaRef = useRef(null);
  const context = useContext(UserConsumer);
  const { language } = context;

  useEffect(() => {
    verifyPasswords();
  });

  const onChangeReCAPTCHA = key => {
    // console.log(key);
  };

  const register = () => {

    setError(null);

    setTimeout(async () => {
      if (verifyNameOrCity(newUser.firstname)) {
        if (verifyNameOrCity(newUser.lastname)) {
          if (verifyUsername(newUser.username)) {
            if (verifyPasswd(newUser.password, newUser.confirmPassword)) {
              if (verifyEmail(newUser.email)) {
                if (verifyNameOrCity(newUser.city)) {
                  if (verifyPhone(newUser.phone)) {
                    const response = await axios.post(`http://${config.hostname}:${config.port}/users`, newUser);
                    if (response && response.data.success)
                      setSuccess(true);
                    else
                      setError("Username or email already used")
                  } else setError("Invalid phone");
                } else setError("Invalid city");
              } else setError("Invalid email");
            } else setError("Invalid password");
          } else setError("Invalid username");
        } else setError("Invalid lastname");
      } else setError("Invalid firstname");
    }, 100)
  };

  const verifyPasswords = () => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=?!*()@%&]).{8,32}$/g
    if (newUser.password !== newUser.confirmPassword && newUser.confirmPassword.trim() !== '')
      updateWarnMatch(true);
    else
      updateWarnMatch(false);
    if (!regex.test(newUser.password))
      updateWarnLength(true);
    else
      updateWarnLength(false);
  };

  const onEnter = e => {
    if (e.keyCode === 13) register();
  };

  const onChange = (event, option) => {
    updatenewUser({ ...newUser, [option]: event.target.value });
  };

  const onChangeAvatar = async event => {
    if (event.target.files[0]) {
      if (verifyAvatarExt(event.target.files[0])) {
        if (verifyAvatarSize(event.target.files[0])) {
          event.preventDefault();
          const data = new FormData();
          data.append("file", event.target.files[0]);
          data.append("filename", event.target.files[0].name);
          const res = await axios.post(`${config.serverURL}/register/avatar`, data);
          if (res.data.success) {
            updatenewUser({
              ...newUser,
              avatar: `http://${config.hostname}:${config.port}/public/avatars/tmp/${res.data.file}`
            });
          }
        } else {
          setError("Avatar size too high")
        }
      } else {
        setError("Avatar extension invalid")
      }
    }
  };

  return (
    <div className="dark-card center text-center">
      <div className="profile-avatar center">
        <div
          className="profile-avatar-overlay"
          onClick={() => uploadAvatar.current.click()}
        >
          Upload avatar
        </div>
        {/* To translate */}
        <input
          type="file"
          id="file"
          ref={uploadAvatar}
          onChange={e => onChangeAvatar(e)}
          style={{ display: "none" }}
        />
        <img src={newUser.avatar} alt={`Upload avatar`} />
      </div>

      <div style={{
        fontSize: 14,
        marginTop: 20,
        color: 'rgba(255, 255, 255, 0.6)'
      }}>
        Only jpeg, jpg or png files up to 5mb.
      </div>

      <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        sitekey="6LfG57sUAAAAAKw1pjiU7uAgDgtOFEAhpEWdirAw"
        onChange={onChangeReCAPTCHA}
      />

      <h2>{translations[language].register.title}</h2>
      {success ? (
        <div
          className="success"
          style={{ display: "block" }}
          onClick={() => setSuccess(false)}
        >
          Account created, confirmation email has been sent
        </div>
      ) : null}

      {
        error ? (
          <div
            id="error"
            className="error" style={{display: 'block'}}
            onClick={() => { document.getElementById("error").style.display = "none"; setError(null); }}
          >
            {error}
          </div>
        ) : null
      }

      <div className="row" style={{width: '100%'}}>
        <input
          className="dark-input"
          type="text"
          value={newUser.firstname}
          onChange={event => onChange(event, "firstname")}
          placeholder={translations[language].register.firstname}
          style={{ marginRight: 10, marginTop: 5, marginBottom: 5, width: '100%' }}
          required
          onKeyDown={onEnter}
        />
        <input
          className="dark-input"
          type="text"
          value={newUser.lastname}
          onChange={event => onChange(event, "lastname")}
          placeholder={translations[language].register.lastname}
          style={{ marginLeft: 10, marginTop: 5, marginBottom: 5, width: '100%' }}
          required
          onKeyDown={onEnter}
        />
      </div>
      <br />
      <input
        className="dark-input"
        type="text"
        value={newUser.username}
        onChange={event => onChange(event, "username")}
        placeholder={translations[language].register.username}
        style={{ width: "100%", marginRight: 10, marginTop: 5, marginBottom: 5 }}
        required
        onKeyDown={onEnter}
      />
      <br />
      <div className="row" style={{width: '100%'}}>
        <input
          className="dark-input"
          type="password"
          value={newUser.password}
          onChange={event => onChange(event, "password")}
          placeholder={translations[language].register.password}
          style={{ marginRight: 10, marginTop: 5, marginBottom: 5, width: '100%' }}
          required
          onKeyDown={onEnter}
        />
        <input
          className="dark-input"
          type="password"
          value={newUser.confirmPassword}
          onChange={event => onChange(event, "confirmPassword")}
          placeholder={translations[language].register.confirmPassword}
          style={{ marginRight: 10, marginTop: 5, marginBottom: 5, width: '100%' }}
          required
          onKeyDown={onEnter}
        />
      </div>
      <br />
      <input
        className="dark-input"
        type="email"
        value={newUser.email}
        onChange={event => onChange(event, "email")}
        placeholder={translations[language].register.email}
        style={{ width: "100%", marginTop: 5, marginBottom: 5 }}
        required
        onKeyDown={onEnter}
      />
      <br />
      <div className="row" style={{width: '100%'}}>
        <input
          className="dark-input"
          type="text"
          value={newUser.city}
          onChange={event => onChange(event, "city")}
          placeholder={translations[language].register.city}
          style={{ marginRight: 10, marginTop: 5, marginBottom: 5, width: '100%' }}
          onKeyDown={onEnter}
        />
        <input
          className="dark-input"
          type="tel"
          pattern="[0-9]{10}"
          value={newUser.phone}
          onChange={event => onChange(event, "phone")}
          placeholder={translations[language].register.phone}
          style={{ marginLeft: 10, marginTop: 5, marginBottom: 5, width: '100%' }}
          onKeyDown={onEnter}
        />
      </div>
      <div className="warnings">
        {warnMatch ? (
          <p style={{ display: "block" }} className="warn">
            {translations[language].register.warns.match}
          </p>
        ) : null}
        {warnLength ? (
          <p style={{ display: "block" }} className="warn">
            {translations[language].register.warns.length}
          </p>
        ) : null}
      </div>

      <div className="row" style={{ justifyContent: "space-around" }}>
        <Button
          action={() => register()}
          content={translations[language].register.submit}
        />
      </div>
      <div
        className="link center"
        style={{ marginTop: 20, fontSize: ".8em", opacity: 0.8 }}
      >
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Register;
