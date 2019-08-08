import React, { Component } from 'react';
import './App.css';
import { NavLink, Route } from 'react-router-dom'; // browser module
import GamesPage from './GamesPage';
import GameFormPage from './GameFormPage';

const ActiveLink = ({ label, to, activeOnlyWhenExact}) => (
  <Route path={to} exact={activeOnlyWhenExact} children={({ match }) => (
      <NavLink className={match ? 'active item' : 'item'} to={to}>{label}</NavLink>
    )} />
);

class App extends Component {
  render() {
    return (
      <div className="ui container">
        <div className="ui three item menu">
          <ActiveLink activeOnlyWhenExact to="/" label="Home" />
          <ActiveLink activeOnlyWhenExact exact to="/games" label="Games" />
          <ActiveLink activeOnlyWhenExact exact to="/games/new" label="Add New Game" />
        </div>

        <Route exact path="/games" component={GamesPage} />
        <Route path="/games/new" component={GameFormPage} />
        <Route path="/games/:_id" component={GameFormPage} />

      </div>
    );
  }
}

export default App;
