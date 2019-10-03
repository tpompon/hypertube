import React, { useContext } from 'react';
import translations from 'translations'
import { Link } from "react-router-dom";
import { UserConsumer } from 'store';

const Footer = () => {

  const context = useContext(UserConsumer)
  const { language } = context

  return (
    <div className="App-footer">
      <div className="footer-text">{translations[language].footer.title}</div>
    </div>
  )

}

export default Footer;
