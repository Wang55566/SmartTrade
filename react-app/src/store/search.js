const GETSEARCHRESULTS  =  'search/GET_SEARCH_RESULTS';

const getSearchResults = (results) => {
  return {
    type: GETSEARCHRESULTS,
    payload: results
  }
}

export const allSearch = (query) => async (dispatch) => {
  const response = await fetch(`/api/search/${query}`);
  if(response.ok) {
    const data = await response.json();
    dispatch(getSearchResults(data));
  }
}

const initialState = { results: {} };

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case GETSEARCHRESULTS:
      const state1 = { ...state };
      state1.results = action.payload;
      return state1
    default:
      return state;
  }
}

export default searchReducer;
