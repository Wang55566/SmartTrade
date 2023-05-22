const GETSEARCHRESULTS  =  'search/GET_SEARCH_RESULTS';
const CLEAR = 'search/CLEAR';
const GETRESULTDETAILS = 'search/GET_RESULT_DETAILS';
const GETOVERVIEW = 'search/GET_OVERVIEW';
const GETNEWS = 'search/GET_NEWS';
const GETINTRADAYDATA = 'search/GET_INTRADAY_DATA';
const GETDAILYDATA = 'search/GET_DAILY_DATA';

const getIntradayData = (intradaydata) => {
  return {
    type: GETINTRADAYDATA,
    payload: intradaydata
  }
}

const getDailyData = (dailydata) => {
  return {
    type: GETDAILYDATA,
    payload: dailydata
  }
}

const getNews = (news) => {
  return {
    type: GETNEWS,
    payload: news
  }
}

const getOverview = (overview) => {
  return {
    type: GETOVERVIEW,
    payload: overview
  }
}

const getSearchResults = (results) => {
  return {
    type: GETSEARCHRESULTS,
    payload: results
  }
}
const clear = () => {
  return {
    type: CLEAR,
  }
}

const resultDetails = (resultdetails) => {
  return {
    type: GETRESULTDETAILS,
    payload: resultdetails
  }
}

export const allSearch = (query) => async (dispatch) => {
  const response = await fetch(`/api/search/${query}`);
  if(response.ok) {
    const data = await response.json();
    dispatch(getSearchResults(data));
  }
}

export const clearSearch = () => async (dispatch) => {
  dispatch(clear());
}

export const getResultDetails = (symbol) => async (dispatch) => {
  const response = await fetch(`/api/search/${symbol}/details`);
  if(response.ok) {
    const data = await response.json();
    dispatch(resultDetails(data));
  }
}

export const getOverviewDetails = (symbol) => async (dispatch) => {
  const response = await fetch(`/api/search/${symbol}/overview`);
  if(response.ok) {
    const data = await response.json();
    dispatch(getOverview(data));
  }
}

export const getNewsDetails = (symbol) => async (dispatch) => {
  const response = await fetch(`/api/search/${symbol}/news`);
  if(response.ok) {
    const data = await response.json();
    dispatch(getNews(data));
  }
}

export const getIntraday = (symbol) => async (dispatch) => {
  const response = await fetch(`/api/search/${symbol}/intraday`);
  if(response.ok) {
    const data = await response.json();
    dispatch(getIntradayData(data));
  }
}

export const getDaily = (symbol) => async (dispatch) => {
  const response = await fetch(`/api/search/${symbol}/daily`);
  if(response.ok) {
    const data = await response.json();
    dispatch(getDailyData(data));
  }
}

const initialState = { results: {}, resultDetails: {}, overview: {}, news: {}, intraday: {}, daily: {} };

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case GETSEARCHRESULTS:
      const state1 = { ...state };
      state1.results = action.payload;
      return state1
    case CLEAR:
      const state2 = { ...state };
      state2.results = {};
      return state2;
    case GETRESULTDETAILS:
      const state3 = { ...state };
      state3.resultDetails = action.payload;
      return state3;
    case GETOVERVIEW:
      const state4 = { ...state };
      state4.overview = action.payload;
      return state4;
    case GETNEWS:
      const state5 = { ...state };
      state5.news = action.payload;
      return state5;
    case GETINTRADAYDATA:
      const state6 = { ...state };
      state6.intraday = action.payload;
      return state6;
    case GETDAILYDATA:
      const state7 = { ...state };
      state7.daily = action.payload;
      return state7;
    default:
      return state;
  }
}

export default searchReducer;
