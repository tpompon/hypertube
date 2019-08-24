import React from 'react';
import { Link } from "react-router-dom";

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    const { language } = this.props;

    return (
      <div className="App-footer">
        <div className="footer-text">42 Project by tpompon & syboeuf</div>
      </div>
    );
  }
}

export default Header;
