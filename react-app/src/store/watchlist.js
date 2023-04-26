const GETALLWATCHLISTS = 'watchlist/GET_WATCH_LIST'
const GETONEWATCHLIST = 'watchlist/GET_ONE_WATCH_LIST'
const CREATEWATCHLIST = 'watchlist/CREATE_WATCH_LIST'
const UPDATEWATCHLIST = 'watchlist/UPDATE_WATCH_LIST'
const DELETEWATCHLIST = 'watchlist/DELETE_WATCH_LIST'
const CLEARONEWATCHLIST = 'watchlist/CLEAR_WATCH_LIST'

const ADDONESTOCKTOONELIST = 'watchlist/ADD_ONE_STOCK_TO_ONE_LIST'
const REMOVEONESTOCKFROMONELIST = 'watchlist/REMOVE_ONE_STOCK_FROM_ONE_LIST'
const MOVEONESTOCKFROMONELISTTOANOTHER = 'watchlist/MOVE_ONE_STOCK_FROM_ONE_LIST_TO_ANOTHER'


const clearOnelist = () => {
  return {
    type: CLEARONEWATCHLIST
  }
}

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

export const clearAList = () => async (dispatch) => {
  dispatch(clearOnelist())
}

export const getAllLists = () => async (dispatch) => {

  const response = await fetch('/api/watchlists')
  if (response.ok) {
    const data = await response.json()
    dispatch(getWatchLists(data))
  }
}

export const getOneList = (id) => async (dispatch) => {
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

export const updateOneList = (name, id) => async (dispatch) => {
  console.log(name)
  const response = await fetch(`/api/watchlists/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({name, id})
  })
  if (response.ok) {
    const data = await response.json()
    dispatch(updateWatchList(data))
    return data
  }
}

export const deleteOneList = (id) => async (dispatch) => {
  const response = await fetch(`/api/watchlists/${id}`, {
    method: 'DELETE'
  })
  if (response.ok) {
    dispatch(deleteWatchList(id))
  }
}

export const addStockToList = (symbol, quoted_price_to_fixed, selectedValue) => async (dispatch) => {
  const response = await fetch(`/api/watchlists/${selectedValue}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({symbol, market_price: quoted_price_to_fixed, watchlist_id: selectedValue})
  })
  if (response.ok) {
    const data = await response.json()
    dispatch(getAllLists())
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
    case UPDATEWATCHLIST:
      const state4 = { ...state };
      state4.allLists[action.payload.id] = action.payload;
      return state4;
    case DELETEWATCHLIST:
      const state5 = { ...state };
      delete state5.allLists[action.payload.id];
      return state5;
    case CLEARONEWATCHLIST:
      const state6 = { ...state };
      state6.oneList = {};
      return state6;
    default:
      return state;
  }
}

export default watchlistReducer;
