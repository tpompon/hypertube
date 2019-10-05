import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import config from "config";
import translations from "translations";
import Button from "components/Button";
import Loading from "components/Loading";
import { UserConsumer } from "store";

const Settings = () => {
  const context = useContext(UserConsumer);
  const [user, updateUser] = useState({});
  const [_isLoaded, updateIsLoaded] = useState(false);
  const [language, updateLanguage] = useState(context.language);

  useEffect(() => {
    getDataUser();
  }, []);

  const getDataUser = async () => {
    const responseAuth = await axios.get(
      `http://${config.hostname}:${config.port}/auth`
    );
    if (responseAuth) {
      const responseUser = await axios.get(
        `http://${config.hostname}:${config.port}/users/${responseAuth.data.user._id}`
      );
      if (responseUser) {
        updateUser(responseUser.data.user[0]);
        updateIsLoaded(true);
      }
    }
  };

  const onChange = (event, option) => {
    updateUser({ ...user, [option]: event.target.value });
  };

  const handleChangeLanguage = event => {
    updateLanguage(event.target.value);
  };

  const handleSubmit = async event => {
    const key = event.which || event.keyCode;
    if (key === 13) {
      const response = await axios.put(
        `http://${config.hostname}:${config.port}/users/${user._id}`,
        user
      );
      console.log(response.data);
    }
  };

  return (
    <div>
      {_isLoaded ? (
        <div
          onKeyDown={event => handleSubmit(event)}
          className="dark-card center text-center"
          style={{ width: "40%" }}
        >
          <h2>{translations[language].settings.title}</h2>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <input
              className="dark-input"
              type="text"
              value={user.firstname}
              placeholder={translations[language].settings.firstname}
              onChange={event => onChange(event, "firstname")}
              style={{ width: "32%", marginTop: 5, marginBottom: 5 }}
            />
            <input
              className="dark-input"
              type="text"
              value={user.lastname}
              placeholder={translations[language].settings.lastname}
              onChange={event => onChange(event, "lastname")}
              style={{ width: "32%", marginTop: 5, marginBottom: 5 }}
            />
            <input
              className="dark-input"
              type="text"
              value={user.username}
              placeholder={translations[language].settings.username}
              onChange={event => onChange(event, "username")}
              style={{ width: "32%", marginTop: 5, marginBottom: 5 }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <input
              className="dark-input"
              type="email"
              value={user.email}
              placeholder={translations[language].settings.email}
              onChange={event => onChange(event, "email")}
              style={{ width: "49%", marginTop: 5, marginBottom: 5 }}
            />
            <input
              className="dark-input"
              type="number"
              value={user.phone || ""}
              placeholder={translations[language].settings.phone}
              onChange={event => onChange(event, "phone")}
              style={{ width: "49%", marginTop: 5, marginBottom: 5 }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <input
              className="dark-input"
              type="password"
              placeholder={translations[language].settings.newPassword}
              style={{
                width: "49%",
                marginRight: "1%",
                marginTop: 5,
                marginBottom: 5
              }}
            />
            <input
              className="dark-input"
              type="password"
              placeholder={translations[language].settings.confirmPassword}
              style={{
                width: "49%",
                marginLeft: "1%",
                marginTop: 5,
                marginBottom: 5
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 20
            }}
          >
            <input
              className="dark-input"
              type="text"
              value={user.country || ""}
              placeholder={translations[language].settings.country}
              onChange={event => onChange(event, "country")}
              style={{ width: "35%", marginTop: 5, marginBottom: 5 }}
            />
            <input
              className="dark-input"
              type="text"
              value={user.city || ""}
              placeholder={translations[language].settings.city}
              onChange={event => onChange(event, "city")}
              style={{ width: "35%", marginTop: 5, marginBottom: 5 }}
            />
            <select
              className="dark-input"
              onChange={handleChangeLanguage}
              style={{ width: "26%", marginTop: 5 }}
            >
              <option value="fr">
                {translations[language].settings.languages.french}
              </option>
              <option value="en">
                {translations[language].settings.languages.english}
              </option>
            </select>
          </div>
          <div className="row" style={{ justifyContent: "space-around" }}>
            <Button
              action={event => handleSubmit(event)}
              content={translations[language].settings.submit}
            />
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Settings;
