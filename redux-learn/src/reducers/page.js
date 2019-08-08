import {
  GET_PHOTOS_REQUEST,
  GET_PHOTOS_SUCCESS
} from '../constants/Page'

const initialState = {
  year: 2016,
  photos: [],
  fetching: false // 'загрузка'
}

export default function page(state = initialState, action) {

  /*switch (action.type) {
    case SET_YEAR:
      return { ...state, year: action.payload }

    default:
      return state;
  }*/
  switch (action.type) {
    case GET_PHOTOS_REQUEST:
      return { ...state, year: action.payload, fetching: true }

    case GET_PHOTOS_SUCCESS:
      return { ...state, photos: action.payload, fetching: false }

    default:
      return state;
  }
}
