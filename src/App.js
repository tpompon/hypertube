import React from 'react';
import './App.css';
import Header from './components/Header'
import Footer from './components/Footer'
import Movie from './pages/Movie'
import MoviesList from './pages/MoviesList'
import Profile from './pages/Profile'
import User from './pages/User'
import Settings from './pages/Settings'
import Register from './pages/Register'
import Login from './pages/Login'
import Logout from './pages/Logout'
import NotFound from './pages/NotFound'

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      search: "",
      language: "FR"
    }
  }

  updateSearch = (input) => {
    this.setState({search: input});
  }

  render() {
    const { search, language } = this.state;

    return (
      <Router>
        <div className="App">
          <div className="App-wrapper">
          <Header updateSearch={this.updateSearch} language={language} extended={true} />
          <Switch>
            <Route exact path='/' component={() => <MoviesList search={search} language={language} />} />
            <Route exact path='/watch/:id' component={(match) => <Movie {...match} language={language} />} />
            <Route exact path='/user/:username' component={(match) => <User {...match} language={language} />} />
            <Route exact path='/profile' component={() => <Profile language={language} />} />
            <Route exact path='/settings' component={() => <Settings language={language} />} />
            <Route exact path='/register' component={() => <Register language={language} />} />
            <Route exact path='/login' component={() => <Login language={language} />} />
            <Route exact path='/logout' component={() => <Logout language={language} />} />
            <Route component={() => <NotFound language={language} />} />
          </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
