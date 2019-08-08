import {
  GET_PHOTOS_REQUEST,
  GET_PHOTOS_SUCCESS
} from '../constants/Page'

export function setYear(year) {

  /*return {
    type: SET_YEAR,
    payload: year
  }*/
  return (dispatch) => {
    dispatch({
      type: GET_PHOTOS_REQUEST,
      payload: year
    })

    setTimeout(() => { // emulation of server request
      dispatch({
        type: GET_PHOTOS_SUCCESS,
        payload: [1,2,3,4,5]
      })
    }, 1000)
  }
}
