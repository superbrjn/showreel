import React, { Component } from 'react'
import PropTypes from 'prop-types';
// ES7-> ::this.onYearBtnClick === this.onYearBtnClick.bind(this)

export default class Page extends Component {
  onYearBtnClick(e) {
    this.props.getPhotos(+e.target.innerText)
  }

  render() {
    const { year, photos, fetching } = this.props

    //return <div><p>У тебя {photos.length} фото за {year} год</p></div>
    return (
      <div className="ib page">
        <p>
          <button className='btn' onClick={this.onYearBtnClick.bind(this)} >2016</button>{' '}
          <button className='btn' onClick={this.onYearBtnClick.bind(this)} >2015</button>{' '}
          <button className='btn' onClick={this.onYearBtnClick.bind(this)} >2014</button>
        </p>
        <h3>{year} год</h3>
          {
            fetching ?
            <p>Загрузка...</p>
            :
            <p>У тебя {photos.length} фото.</p>
          }
      </div>
    )
  }
}

Page.propTypes = {
  year: PropTypes.number.isRequired,
  photos: PropTypes.array.isRequired,
  getPhotos: PropTypes.func.isRequired
}
