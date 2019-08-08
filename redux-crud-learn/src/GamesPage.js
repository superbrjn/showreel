import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GamesList from './GamesList';
import { fetchGames, deleteGame } from './actions';

class GamesPage extends Component {

  componentDidMount() {
    this.props.fetchGames(); // ajax GET req to the server
  }

  render() {
    return (
      <div className="GamesPage">
        <h1>Games List</h1>

        <GamesList games={this.props.games} deleteGame={this.props.deleteGame} />
      </div>
    );
  }
}

GamesPage.propTypes = {
  games: PropTypes.array.isRequired,
  fetchGames: PropTypes.func.isRequired,
  deleteGame: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    games: state.games
  }
}

export default connect(mapStateToProps, { fetchGames, deleteGame })(GamesPage);
