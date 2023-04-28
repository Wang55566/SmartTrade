const GETSEARCHRESULTS  =  'search/GET_SEARCH_RESULTS';
const ClEAR = 'search/CLEAR';
const GETRESULTDETAILS = 'search/GET_RESULT_DETAILS';

const getSearchResults = (results) => {
  return {
    type: GETSEARCHRESULTS,
    payload: results
  }
}
const clear = () => {
  return {
    type: ClEAR,
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

const initialState = { results: {}, resultdetails: {} };

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case GETSEARCHRESULTS:
      const state1 = { ...state };
      state1.results = action.payload;
      return state1
    case ClEAR:
      const state2 = { ...state };
      state2.results = {};
      return state2;
    case GETRESULTDETAILS:
      const state3 = { ...state };
      state3.resultdetails = action.payload;
      return state3;
    default:
      return state;
  }
}

export default searchReducer;
