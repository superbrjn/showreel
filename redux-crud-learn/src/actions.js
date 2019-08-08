/* Constants */
export const SET_GAMES = 'SET_GAMES';
export const ADD_GAME = 'ADD_GAME';
export const GAME_FETCHED = 'GAME_FETCHED';
export const GAME_UPDATED = 'GAME_UPDATED';
export const GAME_DELETED = 'GAME_DELETED';

/* util */
function handleResponse(response) {
  if (response.ok) { // 200
    return response.json(); // promise
  } else {
    let error = new Error(response.statusText); // new err obj
    error.response = response; // add res to this new obj
    throw error; // break app untill you fix it
  }
}

/* ActionCreators */
export function setGames(games) {
  return {
    type: SET_GAMES,
    games
  }
}

export function addGame(game) {
  return {
    type: ADD_GAME,
    game
  }
}

export function gameFetched(game) {
  return {
    type: GAME_FETCHED,
    game
  }
}

export function gameUpdated(game) {
  return {
    type: GAME_UPDATED,
    game
  }
}

export function gameDeleted(gameId) {
  return {
    type: GAME_DELETED,
    gameId
  }
}

/* API CRUD */
export function saveGame(data) { // Create
  // thunk fn, so it's return another fn
  return dispatch => {
    // POST req
    fetch('/api/games', { // fetch returns promise, and takes only strings
      method: 'post',
      body: JSON.stringify(data), // convert data objects to strings
      headers: {
        "Content-Type": "application/json"
      }
    }).then(handleResponse) // err handler from this side
      .then(data => dispatch(addGame(data.game))); // dispatch pure action - backend ajax
  }
}

export function updateGame(data) { // Update
  // thunk fn, so it's return another fn
  return dispatch => {
    // PUT req
    fetch(`/api/games/${data._id}`, { // fetch returns promise, and takes only strings
      method: 'put',
      body: JSON.stringify(data), // convert data objects to strings
      headers: {
        "Content-Type": "application/json"
      }
    }).then(handleResponse) // err handler from this side
      .then(data => dispatch(gameUpdated(data.game))); // dispatch pure action - backend ajax
  }
}

// add error handler / catch() -- added at server-side
export function fetchGames() { // Read: Show All
  return dispatch => {
    fetch('/api/games') // GET
      .then(res => res.json()) // data to strings
      .then(data => dispatch(setGames(data.games))); // send action data payload
  }
}

export function fetchGame(id) { // Read: Show One by Id
  return dispatch => {
    fetch(`/api/games/${id}`) // GET
      .then(res => res.json()) // data to strings
      .then(data => dispatch(gameFetched(data.game))); // send action data payload
  }
}

export function deleteGame(id) { // Destroy
  // thunk fn, so it's return another fn
  return dispatch => {
    // DELETE req
    fetch(`/api/games/${_id}`, { // fetch returns promise, and takes only strings
      method: 'delete',
      headers: {
        "Content-Type": "application/json"
      }
    }).then(handleResponse) // err handler from this side
      .then(data => dispatch(gameDeleted(id))); // dispatch pure action - backend ajax
  }
}
