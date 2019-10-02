import React from 'react';
import translations from 'translations'
import { Link } from "react-router-dom";

const Footer = ({ language }) => (
  <div className="App-footer">
    <div className="footer-text">{translations[language].footer.title}</div>
  </div>
)

export default Footer;
