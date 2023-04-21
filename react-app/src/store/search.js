const GETSEARCHRESULTS  =  'search/GET_SEARCH_RESULTS';
const ClEAR = 'search/CLEAR';

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

const initialState = { results: {} };

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
    default:
      return state;
  }
}

export default searchReducer;
