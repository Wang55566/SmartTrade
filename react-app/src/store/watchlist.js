const GETWATCHLISTS = 'watchlist/GET_WATCH_LIST'
const GETONEWATCHLIST = 'watchlist/GET_ONE_WATCH_LIST'
const CREATEWATCHLIST = 'watchlist/CREATE_WATCH_LIST'
const UPDATEWATCHLIST = 'watchlist/UPDATE_WATCH_LIST'
const DELETEWATCHLIST = 'watchlist/DELETE_WATCH_LIST'

const getWatchLists = (watchlists) => {
  return {
    type: GETWATCHLISTS,
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
