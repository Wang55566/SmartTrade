const GETALLASSETS  =  'asset/GET_ALL_ASSETS' ;
const GETONEASSET  =  'asset/GET_ONE_ASSET' ;
const CREATEASSET  =  'asset/CREATE_ASSET' ;
const UPDATEASSET  =  'asset/UPDATE_ASSET' ;
const DELETEASSET  =  'asset/DELETE_ASSET' ;
const CLEARSINGLEASSET  =  'asset/CLEAR_SINGLE_ASSET' ;

const clearSingleAsset = () => {
  return {
    type: CLEARSINGLEASSET
  }
}

const getAllAssets = (assets) => {
  return {
    type: GETALLASSETS,
    payload: assets
  }
}

const getOneAsset = (asset) => {
  return {
    type: GETONEASSET,
    payload: asset
  }
}

const createAsset = (asset) => {
  return {
    type: CREATEASSET,
    payload: asset
  }
}

const updateAsset = (asset) => {
  return {
    type: UPDATEASSET,
    payload: asset
  }
}

const deleteAsset = (id) => {
  return {
    type: DELETEASSET,
    payload: id
  }
}

export const clearSingle = () => async (dispatch) => {
  dispatch(clearSingleAsset());
}

export const getAll = () => async (dispatch) => {
  const response = await fetch('/api/assets');
  if(response.ok) {
    const data = await response.json();
    dispatch(getAllAssets(data));
  }
}

export const getOne = (id) => async (dispatch) => {
  const response = await fetch(`/api/assets/${id}`);
  if(response.ok) {
    const data = await response.json();
    dispatch(getOneAsset(data));
  }
}

export const create = (asset) => async (dispatch) => {

  const response = await fetch('/api/assets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(asset)
  })
  if(response.ok) {
    const data = await response.json();
    dispatch(createAsset(data));
    dispatch(getAll());
  }
}

export const update = (asset) => async (dispatch) => {
  const response = await fetch(`/api/assets/${asset.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(asset)
  })
  if(response.ok) {
    const data = await response.json();
    dispatch(updateAsset(data));
  }
  return response;
}

export const remove = (id) => async (dispatch) => {
  const response = await fetch(`/api/assets/${id}`, {
    method: 'DELETE'
  })
  if(response.ok) {
    dispatch(deleteAsset(id));
  }
}

const initialState = {
  allAssets: {},
  singleAsset: {}
};

const assetReducer = (state = initialState, action) => {
  switch (action.type) {
    case GETALLASSETS:
      const state1 = { singleAsset: {...state.singleAsset}};
      state1.allAssets = action.payload;
      return state1
    case GETONEASSET:
      const state2 = { allAssets: {...state.allAssets}};
      state2.singleAsset = action.payload;
      return state2
    case CREATEASSET:
      const state3 = { allAssets: {...state.allAssets}, singleAsset: {...state.singleAsset}};
      state3.allAssets[action.payload.id] = action.payload;
      console.log('-----create action.payload-----', action.payload)
      state3.singleAsset = action.payload;
      return state3
    case UPDATEASSET:
      const state4 = { allAssets: {...state.allAssets}, singleAsset: {...state.singleAsset}};
      state4.allAssets[action.payload.id] = action.payload;
      state4.singleAsset = action.payload;
      return state4
    case DELETEASSET:
      const state5 = { allAssets: {...state.allAssets}, singleAsset: {...state.singleAsset}}
      delete state5.allAssets[action.payload]
      state5.singleAsset = {};
      return state5
    case CLEARSINGLEASSET:
      const state6 = { allAssets: {...state.allAssets}, singleAsset: {...state.singleAsset}}
      state6.singleAsset = {};
      return state6
    default:
      return state;
  }
}

export default assetReducer;
