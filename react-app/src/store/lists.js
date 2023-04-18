//todo add task to list, create list, delete list

const SETALLLISTS = 'lists/ALL';
const SETSINGLELIST = 'lists/SINGLE';
const CREATELIST = 'lists/CREATE';
const UPDATELISTNAME = 'lists/UPDATENAME';
const DELETELIST = 'lists/DELETE';


const allLists1 = (arr) => {
  return {
    type: SETALLLISTS,
    arr
  };
};

const singleList1 = (obj) => {
  return {
    type: SETSINGLELIST,
    obj
  };
};

const renameList1 = (obj) => {
  return {
    type: UPDATELISTNAME,
    obj
  };
};

const createList1 = (obj) => {
  return {
    type: CREATELIST,
    obj
  };
};

const deleteList1 = (listId) => {
  return {
    type: DELETELIST,
    listId
  };
};

export const allLists = () => async (dispatch) => {
  const response = await fetch(`/api/lists/all`)
  if (response.ok) {
    const data = await response.json();
    dispatch(allLists1(data));
  };
  return response
};

export const singleList = (listId) => async (dispatch) => {
  const response = await fetch(`/api/lists/${listId}`)
  if (response.ok) {
    const data = await response.json();
    dispatch(singleList1(data));
  };
  return response
};

export const createlist = (formData) => async (dispatch) => {
  const response = await fetch(`/api/lists`, {
    method: 'POST',
    headers: {
			"Content-Type": "application/json",
		},
    body: JSON.stringify(formData)
  })
  if (response.ok) {
    const data = await response.json();
    dispatch(createList1(data));
    dispatch(singleList1(data.id))
  };
  return response
};


export const renameList = (listId, formData) => async (dispatch) => {
  const response = await fetch(`/api/lists/${listId}`, {
    method: 'PUT',
    headers: {
			"Content-Type": "application/json",
		},
    body: JSON.stringify(formData)
  })
  if (response.ok) {
    const data = await response.json();
    dispatch(renameList1(data));
    dispatch(singleList1(listId))
  };
  return response
};

export const deleteList = (listId) => async (dispatch) => {
  const response = await fetch(`/api/lists/${listId}`, {
    method: 'DELETE'
  })
  if (response.ok) {
    const data = await response.json();
    dispatch(deleteList1(listId));
  };
  return response
};

const initialState = {
  allLists: {},
  singleList: {}
};

const listReducer = (state = initialState, action) => {
  switch (action.type) {
    case SETALLLISTS:
      let newState1 = { singleList: { ...state.singleList }, allLists: {} };
      action.arr.forEach(s => newState1.allLists[s.id] = s);
      return newState1;
    case SETSINGLELIST:
      // we do not know if list.tasks will copy or not... if problems arise we can adjust
      let newState2 = { allLists: { ...state.allLists }, singleList: {}};
      newState2.singleList = { ...action.obj };
      return newState2;
    case UPDATELISTNAME:
      let newState3 = { allLists: { ...state.allLists }, singleList: {} };
      let list1 = action.obj
      newState3.allLists[list1.id] = { ...list1 };
      return newState3
    case CREATELIST:
      let newState5 = { allLists: { ...state.allLists }, singleList: {} };
      let list2 = action.obj
      newState5.allLists[list2.id] = { ...list2 };
      return newState5
    case DELETELIST:
      let newState6 = { allLists: { ...state.allLists }, singleList: {...state.singleList} };
      delete newState6.allLists[action.listId]
      if (newState6.singleList.id == action.listId) newState6.singleList = {}
      return newState6
    default:
      return state;
  }
};

export default listReducer;
