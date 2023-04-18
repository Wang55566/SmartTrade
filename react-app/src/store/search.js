const ADDSEARCHRESULTS = 'search/ADDSEARCHRESULTS';

const setSearchResults = (obj) => {
  return {
    type: ADDSEARCHRESULTS,
    obj
  };
};

 export const allSearch = (query) => async (dispatch) => {
  const response = await fetch(`/api/search?search=${query}`)
  if (response.ok) {
    const data = await response.json();
    dispatch(setSearchResults(data));
  };
  return response
};

const initialState = {
  searchResults: {},
  numCompleted: 0,
  numNotCompleted: 0
 };

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADDSEARCHRESULTS:
      let newState = {searchResults: {}};
      action.obj.tasks.forEach(s => newState.searchResults[s.id] = s);
      newState.numCompleted = action.obj.numCompleted
      newState.numNotCompleted = action.obj.numNotCompleted
      return newState;
    default:
      return state;
  }
};

export default searchReducer;
