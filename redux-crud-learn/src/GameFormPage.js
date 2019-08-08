import React, { Component } from 'react';
import { connect} from 'react-redux';
import { saveGame, fetchGame, updateGame } from './actions';
import { Redirect } from 'react-router-dom';
import GameForm from './GameForm';

class GameFormPage extends Component {

  state = {
    redirect: false
  }

  componentDidMount = () => {
    const { match } = this.props; // props.match.params.etc...
    if (match.params._id) {
      this.props.fetchGame(match.params._id);
    }
  }

  saveGame = ({_id, title, cover}) => {
    if (_id) { // check if its not null
      return this.props.updateGame({_id, title, cover}).then( // put req, res:
        () => { this.setState({ redirect: true })} // success fn, done
        //,(err) => err.response.json().then(({errors}) => this.setState({errors, loading: false}))
      );
    } else { // otherwise dispatch game create action
      return this.props.saveGame({ title, cover }).then( // post req, res:
        () => { this.setState({ redirect: true })} // success fn, done
        //,(err) => err.response.json().then(({errors}) => this.setState({errors, loading: false}))
      );
    }
  }

  render() {
    return (
      <div>
        {
          this.state.redirect ?
          <Redirect to="/games" /> :
          <GameForm game={this.props.game} saveGame={this.saveGame} />
        }
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const { match } = props;
  if (match.params._id) {
    return {
      game: state.games.find(item => item._id === match.params._id)
      // search every game in state, and run fn to compare its url and id
    }
  }

  return { game: null };
}

export default connect(mapStateToProps, { saveGame, fetchGame, updateGame })(GameFormPage);
