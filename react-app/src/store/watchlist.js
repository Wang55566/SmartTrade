const GETALLWATCHLISTS = 'watchlist/GET_WATCH_LIST'
const GETONEWATCHLIST = 'watchlist/GET_ONE_WATCH_LIST'
const CREATEWATCHLIST = 'watchlist/CREATE_WATCH_LIST'
const UPDATEWATCHLIST = 'watchlist/UPDATE_WATCH_LIST'
const DELETEWATCHLIST = 'watchlist/DELETE_WATCH_LIST'

const getWatchLists = (watchlists) => {
  return {
    type: GETALLWATCHLISTS,
    payload: watchlists
  }
}

const getOneWatchList = (watchlist) => {
  return {
    type: GETONEWATCHLIST,
    payload: watchlist
  }
}

const createWatchList = (watchlist) => {
  return {
    type: CREATEWATCHLIST,
    payload: watchlist
  }
}

const updateWatchList = (watchlist) => {
  return {
    type: UPDATEWATCHLIST,
    payload: watchlist
  }
}

const deleteWatchList = (id) => {
  return {
    type: DELETEWATCHLIST,
    payload: id
  }
}

export const getAllLists = () => async (dispatch) => {

  const response = await fetch('/api/watchlists')
  if (response.ok) {
    const data = await response.json()
    dispatch(getWatchLists(data))
  }
}

export const getOnelist = (id) => async (dispatch) => {
  const response = await fetch(`/api/watchlists/${id}`)
  if (response.ok) {
    const data = await response.json()
    dispatch(getOneWatchList(data))
  }
}

export const createOneList = (watchlist) => async (dispatch) => {
  const response = await fetch('/api/watchlists', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(watchlist)
  })
  if (response.ok) {
    const data = await response.json()
    dispatch(createWatchList(data))
    return data
  }
}

const initialState = { allLists: {}, oneList: {} };

const watchlistReducer = (state = initialState, action) => {
  switch(action.type) {
    case GETALLWATCHLISTS:
      const state1 = { ...state };
      state1.allLists = action.payload;
      return state1;
    case GETONEWATCHLIST:
      const state2 = { ...state };
      state2.oneList = action.payload;
      return state2;
    case CREATEWATCHLIST:
      const state3 = { ...state };
      state3.allLists[action.payload.id] = action.payload;
      return state3;
    default:
      return state;
  }
}

export default watchlistReducer;
