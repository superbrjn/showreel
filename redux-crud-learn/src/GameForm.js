import React, { Component } from 'react';
import classnames from 'classnames'; // errors highlighting
/* Commented --> moved to GameFormPage
import { connect} from 'react-redux';
import { saveGame, fetchGame, updateGame } from './actions';
import {Redirect} from 'react-router-dom';*/

class GameForm extends Component {
  state = {
    _id: this.props.game ? this.props._id : null,
    title: this.props.game ? this.props.title : '',
    cover: this.props.game ? this.props.cover : '',
    errors: {},
    loading: false, // on loading message
    //done: false // form data is ok and submitted
  }

  componentWillRecieveProps = (nextProps) => {
    this.setState({
      _id: nextProps.game._id,
      title: nextProps.game.title,
      cover: nextProps.game.cover
    })
  }

  /*componentDidMount = () => {
    if (this.props.params._id) {
      this.props.fetchGame(this.props.params._id);
    }
  }*/

  handleChange = (e) => {
    if (!!this.state.errors[e.target.name]) {
      let errors = Object.assign({}, this.state.errors); // clone component errors
      delete errors[e.target.name]; // clear err message
      this.setState({
        [e.target.name]: e.target.value,
        errors // keep/show err message if so exist
      });
    } else { // if no errors show this particular state
      this.setState({ [e.target.name]: e.target.value });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();

    // validation (client-side)
    let errors = {};
    if (this.state.title === '') errors.title = "Can't be empty.";
    if (this.state.cover === '') errors.cover = "Can't be empty.";
    this.setState({ errors });
    const isValid = Object.keys(errors).length === 0;

    /* when upper validation code is commented and IF (arg) statment downthere is set to (true) -- you can check server-side validation work*/

    if (isValid)/*(true)*/ {
      const { _id, title, cover } = this.state; // return promise
      this.setState({ loading: true }); // no err, show loading before submitting
      /*if (_id) { // check if its not null
        this.props.updateGame({_id, title, cover}).then( // put req, res:
          () => { this.setState({ done: true }) }, // success fn, done
          (err) => err.response.json().then(({errors}) => this.setState({errors, loading: false}))
        );
      } else { // otherwise dispatch game create action
        this.props.saveGame({ title, cover }).then( // post req, res:
          () => { this.setState({ done: true }) }, // success fn, done
          (err) => err.response.json().then(({errors}) => this.setState({errors, loading: false}))
        );
      }*/
      this.props.saveGame({_id, title, cover}) // link to new obj in GameFormPage
        .catch((err) => err.response.json().then(({errors}) => this.setState({ errors, loading: false })));
    }
  }

  render() {
    const form = (
      <form className={classnames('ui', 'form', {loading: this.state.loading})} onSubmit={this.handleSubmit}>
      {/*<form className="ui form" to prevet default sending, add onSubmit handler >*/}
        <h1>Add New Game</h1>

        {!!this.state.errors.global && <div className="ui negative message"><p>{this.state.errors.global}</p></div>}

        {/*<div className="field">*/}
        <div className={classnames('field', {error: !!this.state.errors.title})}>
          <label htmlFor="title">Title</label>
          <input id="title" name="title" value={this.state.title} onChange={this.handleChange} />
          <span>{this.state.errors.title}</span>
        </div>

        <div className={classnames('field', {error: !!this.state.errors.cover})}>
          <label htmlFor="Cover">Cover URL</label>
          <input id="Cover" name="cover" value={this.state.cover} onChange={this.handleChange} />
          <span>{this.state.errors.cover}</span>
        </div>

        <div className="field">
          { this.state.cover !== '' && <img src={this.state.cover} alt="cover" className="ui small bordered image" /> }
        </div>

        <div className="field">
          <button className="ui primary button">Save</button>
        </div>
      </form>
    )
    return (
      <div>
        {/* this.state.done ? <Redirect to="/games" /> : form */}
        { form }
      </div>
    );
  }
}

/*function mapStateToProps(state, props) {
  if (props.params._id) {
    return {
      game: state.games.find(item => item._id === props.params._id)
      // search every game in state, and run fn to compare its url and id
    }
  }

  return { game: null };
}

export default connect(mapStateToProps, { saveGame, fetchGame, updateGame })(GameForm);*/
export default GameForm;
