import React, { Component } from 'react';
import '../assets/App.css';
import { connect } from 'react-redux'
import User from '../components/User'
import Page from '../components/Page'
import { bindActionCreators } from 'redux'
import * as pageActions from '../actions/PageActions'

class App extends Component {
  /* version 1 - explanation
  render() {
    return (
      <div className="App">
        hello, { this.props.user }!
      </div>
    );
  }*/
  /* version 2 - solid component
  render() {
    const { name } = this.props.user
    const { year, photos } = this.props.page

    return (
      <div>
        <p>Привет из App, {name}!</p>
        <p>У тебя {photos.length} фото за {year} год</p>
      </div>
    )
  }*/
  // version 3 - decomposed into components/User and components/Page
  // for its independent updates / modularity
  render() {
    const { user, page } = this.props
    const { getPhotos } = this.props.pageActions

    return (
      <div className='row'>
        {/*<User name={user.name} />*/}
        <Page photos={page.photos} year={page.year} getPhotos={getPhotos} fetching={page.fetching} />
      </div>
    )
  }
}

// connect() первым аргументом принимает "маппинг" (соответствие) state к props,
// а вторым маппинг dispatch к props
function mapStateToProps (state) {
  return {
    user: state.user,
    page: state.page
  }
}

function mapDispatchToProps(dispatch) {
  return {
    pageActions: bindActionCreators(pageActions, dispatch)
  }
}

// подключаем React компонент к Redux store.
export default connect(mapStateToProps, mapDispatchToProps)(App);
