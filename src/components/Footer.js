import React from 'react';
import translations from '../translations'
import { Link } from "react-router-dom";

class Footer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    const { language } = this.props;

    return (
      <div className="App-footer">
        <div className="footer-text">{translations[language].footer.title}</div>
      </div>
    );
  }
}

export default Footer;
